import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import path from "path";

interface UploadGeneratedPdfRequest {
    fileBuffer: Buffer;
    fileName: string;
    documentType?: string;
    sessionId?: string;
}

interface UploadGeneratedPdfResponse {
    bucket: string;
    key: string;
    url: string;
}

class S3PdfStorageService {
    private readonly bucketName: string =
        process.env.S3_PDF_BUCKET || process.env.S3_BUCKET_NAME || "";
    private readonly region: string = process.env.AWS_REGION || "";
    private client: S3Client | null = null;

    private getClient(): S3Client {
        if (!this.bucketName || !this.region) {
            throw new Error(
                "S3 PDF storage is not configured. Set S3_PDF_BUCKET (or S3_BUCKET_NAME) and AWS_REGION.",
            );
        }

        if (!this.client) {
            this.client = new S3Client({ region: this.region });
        }

        return this.client;
    }

    private normalizeFileName(fileName: string): string {
        const safeBase = path
            .basename(fileName || "generated-document.pdf")
            .replace(/[^a-zA-Z0-9._-]/g, "-");

        if (safeBase.toLowerCase().endsWith(".pdf")) {
            return safeBase;
        }

        return `${safeBase}.pdf`;
    }

    private sanitizeMetadataValue(value?: string): string {
        return (value || "")
            .toLowerCase()
            .replace(/[^a-z0-9._-]/g, "-")
            .slice(0, 120);
    }

    async uploadGeneratedPdf(
        request: UploadGeneratedPdfRequest,
    ): Promise<UploadGeneratedPdfResponse> {
        if (!request.fileBuffer || request.fileBuffer.length === 0) {
            throw new Error("Cannot upload an empty PDF file.");
        }

        const normalizedFileName = this.normalizeFileName(request.fileName);
        if (!normalizedFileName.toLowerCase().endsWith(".pdf")) {
            throw new Error("Only PDF files are supported for S3 upload.");
        }

        const dateSegment = new Date().toISOString().slice(0, 10);
        const key = `generated-pdfs/${dateSegment}/${randomUUID()}-${normalizedFileName}`;

        await this.getClient().send(
            new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: request.fileBuffer,
                ContentType: "application/pdf",
                Metadata: {
                    source: "generated",
                    documenttype: this.sanitizeMetadataValue(request.documentType),
                    sessionid: this.sanitizeMetadataValue(request.sessionId),
                },
            }),
        );

        const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL;
        const url = publicBaseUrl
            ? `${publicBaseUrl.replace(/\/$/, "")}/${key}`
            : `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;

        return {
            bucket: this.bucketName,
            key,
            url,
        };
    }
}

export default new S3PdfStorageService();
