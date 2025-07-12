import { Request, Response, NextFunction } from "express";
import { AuthServices } from "../services";

class AuthController
{

    async getUser(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        try {
            const data = await AuthServices.getUser(req.cookies);

            res.status(200).json(data)
        } catch (error) {
            next(error);
        }
    }

    async register(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        try {
            const data = await AuthServices.register(req.body);

            res.status(200).json({ success: true, message: "Usuário cadastrado com sucesso", data })
        } catch (error) {
            next(error);
        }
    }
    
    async authenticate(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        try {
            const [accessToken, refreshToken] = await AuthServices.authenticate(req.body);

            res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "lax", secure: false, maxAge: 24 * 60 * 60 * 1000 })
            res.json({ accessToken })
        } catch (error) {
            next(error);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        try {
            const [accessToken] = await AuthServices.refresh(req.cookies);

            res.json({ accessToken })
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        try {
            await AuthServices.logout(req.cookies);

            res.clearCookie("jwt", { httpOnly: true, sameSite: "lax", secure: false  }); 

            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }

    
}

export default new AuthController();