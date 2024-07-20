import multer from "multer";

export const userUploads = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2097152 },
});

export const driveUploads = multer({
  storage: multer.memoryStorage(),
  limits: {fileSize: 10485760}
})