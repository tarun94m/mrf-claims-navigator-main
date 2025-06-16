import fs from "fs/promises";

export const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

export const initDirectories = async () => {
  await ensureDirectoryExists("./mrf-files");
  await ensureDirectoryExists("./uploads");
};
