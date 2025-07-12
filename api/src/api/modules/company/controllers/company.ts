import { ICRUDController } from "@/config/interfaces";
import { Request, Response, NextFunction } from "express";
import { CompanyServices } from "../services";


class CompanyControllers implements ICRUDController
{
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await CompanyServices.find()

            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error);
        }
    }
    
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await CompanyServices.findOne(req.query);

            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error);
        }
    }

    async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);

            const data = await CompanyServices.findById(id);

            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await CompanyServices.create(req.body);

            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            
            const data = await CompanyServices.update(id, req.body);

            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            
            const data = await CompanyServices.delete(id);

            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error);
        }
    }
    
}

export default new CompanyControllers();