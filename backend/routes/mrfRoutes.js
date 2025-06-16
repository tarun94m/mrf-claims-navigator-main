import express from "express";
import {
  healthCheck,
  generateMRF,
  getMRFFiles,
  downloadMRF,
  getFileDetails,
} from "../controllers/mrfController.js";

const router = express.Router();

router.get("/health", healthCheck);
router.post("/generate-mrf", generateMRF);
router.get("/mrf-files", getMRFFiles);
router.get("/download/:fileId", downloadMRF);
router.get("/file/:fileId", getFileDetails);

export default router;
