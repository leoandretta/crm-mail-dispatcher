import { Request, Response, NextFunction } from "express";

export interface ICRUDController
{
    
    find(req: Request, res: Response, next: NextFunction): Promise<void>;
    findOne(req: Request, res: Response, next: NextFunction): Promise<void>;
    findById(req: Request, res: Response, next: NextFunction): Promise<void>;
    
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}