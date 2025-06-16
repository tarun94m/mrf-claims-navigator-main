import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import { generateMRFFile } from "../utils/mrfGenerator.js";

const metadataPath = "./mrf-files/metadata.json";

export const healthCheck = (req, res) => {
  res.json({ status: "OK", message: "MRF API is live" });
};

export const generateMRF = async (req, res) => {
  try {
    const { claims, customer } = req.body;

    if (!claims?.length || !customer) {
      return res
        .status(400)
        .json({ success: false, error: "Missing claims or customer" });
    }

    const mrfData = generateMRFFile(claims, customer);
    const fileId = uuidv4();
    const filename = `mrf_${customer
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase()}_${new Date().toISOString().split("T")[0]}.json`;
    const filePath = path.join("./mrf-files", filename);

    await fs.writeFile(filePath, JSON.stringify(mrfData, null, 2));

    let metadata = [];
    try {
      const existing = await fs.readFile(metadataPath, "utf8");
      metadata = JSON.parse(existing);
    } catch {}

    const fileMeta = {
      id: fileId,
      filename,
      customer,
      createdAt: new Date().toISOString(),
      size: JSON.stringify(mrfData).length,
      recordCount: claims.length,
      filePath,
    };

    metadata.push(fileMeta);
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    res.json({
      success: true,
      fileId,
      filename,
      message: `Generated MRF for ${customer}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMRFFiles = async (req, res) => {
  try {
    const content = await fs.readFile(metadataPath, "utf8");
    const metadata = JSON.parse(content);
    const sorted = metadata
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(({ filePath, ...rest }) => rest);
    res.json(sorted);
  } catch {
    res.json([]);
  }
};

export const downloadMRF = async (req, res) => {
  try {
    const { fileId } = req.params;
    const metadata = JSON.parse(await fs.readFile(metadataPath, "utf8"));
    const file = metadata.find((f) => f.id === fileId);

    if (!file)
      return res.status(404).json({ success: false, error: "File not found" });

    await fs.access(file.filePath);
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.filename}"`
    );
    const data = await fs.readFile(file.filePath);
    res.send(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getFileDetails = async (req, res) => {
  try {
    const { fileId } = req.params;
    const metadata = JSON.parse(await fs.readFile(metadataPath, "utf8"));
    const file = metadata.find((f) => f.id === fileId);

    if (!file)
      return res.status(404).json({ success: false, error: "File not found" });

    const { filePath, ...details } = file;
    res.json(details);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
