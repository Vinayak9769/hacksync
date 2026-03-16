import { Request, Response } from "express";
import s3PdfStorageService from "../services/s3PdfStorageService";

class StorageController {
    /**
     * Upload generated PDF documents to S3.
     * POST /api/storage/generated-pdf
     */
    async uploadGeneratedPdf(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file;
            if (!file) {
                res.status(400).json({
                    error: "PDF file is required in the 'file' field.",
                });
                return;
            }

            const source = String(req.body?.source || "").toLowerCase();
            if (source !== "generated") {
                res.status(400).json({
                    error: "Only generated PDFs are allowed for this endpoint.",
                });
                return;
            }

            const fileName = String(
                req.body?.fileName || file.originalname || "generated-document.pdf",
            );

            if (
                file.mimetype !== "application/pdf" ||
                !fileName.toLowerCase().endsWith(".pdf")
            ) {
                res.status(400).json({
                    error: "Only PDF files are accepted for upload.",
                });
                return;
            }

            const upload = await s3PdfStorageService.uploadGeneratedPdf({
                fileBuffer: file.buffer,
                fileName,
                documentType: req.body?.documentType,
                sessionId: req.body?.sessionId,
            });

            res.status(201).json({
                success: true,
                message: "Generated PDF uploaded to S3 successfully",
                storage: {
                    provider: "s3",
                    bucket: upload.bucket,
                    key: upload.key,
                    url: upload.url,
                },
            });
        } catch (error) {
            console.error("Failed to upload generated PDF:", error);
            const message =
                error instanceof Error ? error.message : "Failed to upload PDF";

            const statusCode =
                message.includes("not configured") ||
                message.includes("credentials")
                    ? 503
                    : 500;

            res.status(statusCode).json({
                error: message,
            });
        }
    }
}

export default new StorageController();
