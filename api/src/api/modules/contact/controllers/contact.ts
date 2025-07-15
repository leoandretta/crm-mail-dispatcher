import { ICRUDController } from "@/config/interfaces";
import { Request, Response, NextFunction } from "express";
import { ContactServices } from "../services";


class CompanyContactControllers implements ICRUDController
{
    async devextreme(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await ContactServices.devextreme(req.query);
            
            res.status(200).json(data);
        }
        catch (error) { 
            next(error)
        }
    }

    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await ContactServices.find()

            res.status(200).json({ success: true, data, message: "Lista de contatos retornada com sucesso" })
        } catch (error) {
            next(error);
        }
    }
    
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const data = await ContactServices.findOne(req.query);

            res.status(200).json({ success: true, data, message: "Contato retornado com sucesso" })
        } catch (error) {
            next(error);
        }
    }

    async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const data = await ContactServices.findById(id, req.query);

            res.status(200).json({ success: true, data, message: "Contato retornado com sucesso" })
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await ContactServices.create(req.body);

            res.status(200).json({ success: true, data, message: "Contato cadastrado com sucesso" })
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id)
            const data = await ContactServices.update(id, req.body);

            res.status(200).json({ success: true, data, message: "Contato editado com sucesso" })
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await ContactServices.delete(req.params.id);

            res.status(200).json({ success: true, message: "Contato deletado com sucesso" })
        } catch (error) {
            next(error);
        }
    }
    
}

export default new CompanyContactControllers();