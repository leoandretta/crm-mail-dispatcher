import { AppConfig } from "@/config";
import { AuthenticationPayloadValues, AuthUser } from "@/config/interfaces/authentication";
import AppDataSource from "@/database";
import { UserCreationAttributes, UserAttributes } from "@/database/schemas/auth/interfaces";
import { UserRepository } from "@/database/schemas/auth/repositories";
import { BadRequest, DatabaseError, Forbidden, NotFound, Unauthorized } from "@/utils/exceptions";
import bcrypt from "bcrypt";
import jwt, { TokenExpiredError } from "jsonwebtoken"
class AuthServices 
{
    private userRepository: UserRepository;
    
    constructor()
    {
        this.userRepository = new UserRepository();
    }
    
    async getUser(cookies?: Record<string, string>): Promise<AuthUser>
    {
        try {
            if(!cookies?.jwt) throw new BadRequest("JWT obrigatório");

            const refreshToken = cookies.jwt;
            const user = await this.userRepository.findOne({
                where: { refreshToken }
            })
            if(!user) throw new Forbidden("Usuário não encontrado");

            const decoded = jwt.verify(refreshToken, AppConfig.jwt.refreshToken);
            if(typeof decoded === "string") throw new Unauthorized("Token inválido");


            return {
                name: user.name,
                email: user.email
            };
            
        } catch (error) {
            throw error;
        }
    }

    async register(payload: UserCreationAttributes): Promise<UserAttributes>
    {
        const transaction = await AppDataSource.transaction();
        try {
            const { name, email, password } = payload;
            const user = await this.userRepository.findOne({
                where: { email },
            })
            if(user) throw new DatabaseError("Já existe um usuário com este email cadastrado");
            
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await this.userRepository.create({
                name, 
                email, 
                password: hashedPassword
            },{ transaction })
            if(!newUser) throw new DatabaseError("Não foi possível registrar este usuário!");

            await transaction.commit();

            return newUser;
            
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async authenticate(payload: AuthenticationPayloadValues): Promise<[accessToken: string, refreshToken: string]>
    {
        const transaction = await AppDataSource.transaction()
        try {
            const { email, password } = payload
            if (!email) throw new Error('Email de login não informado');
            else if (!password) throw new Error('Senha não informada');
            
            const user = await this.userRepository.findOne({
                where: { email }
            })

            if(!user) throw new NotFound("Usuário não encontrado!");
            else if(!user.active) throw new NotFound("Usuário inativo!");

            const passwordMatch = await bcrypt.compare(password, user.password);
            if(!passwordMatch) throw new Unauthorized("Senha incorreta!");
            
            const accessToken = jwt.sign(
                {
                    "userName": user.name,
                    "userEmail": user.email,
                },
                AppConfig.jwt.accessToken,
                { expiresIn: "1h" }
            )

            const refreshToken = jwt.sign(
                {
                    "userName": user.name,
                    "userEmail": user.email,
                },
                AppConfig.jwt.refreshToken,
                { expiresIn: "1d" }
            )
            user.refreshToken = refreshToken;
            await user.save({ transaction });

            await transaction.commit();
            
            return [accessToken, refreshToken]

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async refresh(cookies?: Record<string, string>): Promise<[accessToken: string]>
    {
        const transaction = await AppDataSource.transaction();
        try {
            if(!cookies?.jwt) throw new BadRequest("JWT obrigatório");

            const refreshToken = cookies.jwt;
            const user = await this.userRepository.findOne({
                where: { refreshToken }
            })
            if(!user) throw new Forbidden("Usuário não encontrado");

            const decoded = jwt.verify(refreshToken, AppConfig.jwt.refreshToken);
            if(typeof decoded === "string") throw new Unauthorized("Token inválido");

            const accessToken = jwt.sign(
                {
                    "userName": decoded.userName,
                    "userEmail": decoded.userEmail,
                },
                AppConfig.jwt.accessToken,
                { expiresIn: "1h" }
            )

            return [accessToken];
            
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    

    async logout(cookies?: Record<string, string>): Promise<void>
    {
        const transaction = await AppDataSource.transaction();
        try {
            if(!cookies?.jwt) return;
            const refreshToken = cookies.jwt;

            const user = await this.userRepository.findOne({
                where: { refreshToken }
            });
            if(!user) return ;

            user.refreshToken = null

            await user.save({ transaction });

            await transaction.commit();           

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

export default new AuthServices();