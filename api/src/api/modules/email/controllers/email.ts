import { Request, Response, NextFunction } from "express";
import { EmailServices } from "../services";

class EmailControllers
{
    async send(req: Request, res: Response, next: NextFunction)
    {
        try {
            await EmailServices.send(req.body, req.attachments)

            res.status(200).json({ success: true, message: "Emails enviados com sucesso."});
        } catch (error) {
            next(error);
        }
    }
}

export default new EmailControllers();