import { AppConfig } from "@/config";
import { BadRequest, Forbidden } from "@/utils/exceptions";
import { Request, Response, NextFunction } from "express"
import jwt, { TokenExpiredError } from "jsonwebtoken"

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers["authorization"]?.replace(/Bearer /g, "");
        if(!token) throw new BadRequest("Token não informado");

        const decoded = jwt.verify(token, AppConfig.jwt.accessToken);    
        if(typeof decoded === "string") throw new Forbidden("Token inválido");

        next();
    } catch (error) {
        if(error instanceof TokenExpiredError) {
            res.sendStatus(403);
        }
        else {
            res.sendStatus(error?.code ?? error.status ?? error.statusCode);
        }
    }
}

