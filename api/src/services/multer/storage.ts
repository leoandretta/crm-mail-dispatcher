import { formatFilename } from "@/utils/format";
import { Request } from "express"
import { StorageEngine } from "multer";
import { Readable } from "stream";

class CustomStorage implements StorageEngine
{
    async _handleFile(req: Request, file: Express.Multer.File, cb: (error: Error | null, info?: Partial<Express.Multer.File>) => void): Promise<void> {
        try {
            const fileBuffer = await this.streamToBuffer(file.stream);
            const fileName = formatFilename(file.originalname)

            if(!req.attachments) req.attachments = []

            req.attachments.push({ filename: fileName, content: fileBuffer, encoding: "utf-8" })

            cb(null, {
                buffer: fileBuffer,
                filename: fileName,
                size: fileBuffer.length
            })
        } catch (error) {
            cb(error);
        }
    }

    _removeFile(req: Request, file: Express.Multer.File, cb: (error: Error | null) => void): void {
        cb(null);
    }

    private async streamToBuffer(stream: Readable): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', reject);
        });
    }

}
export default CustomStorage;