import { Server as HTTPServer, createServer } from "http";
import express, { Application } from "express";
import { IServer } from "../config/interfaces";
import AppDataSource from "@/database";
import { AppConfig } from "@/config";
import { serverCors } from "./utils/cors";
import serverRoutes from "./router";
import { errorHandler } from "@/middlewares/error-handler";
import { unknownRoute } from "@/middlewares/unknown-route";
import cookieParser from "cookie-parser";
import { resolve } from "path";


class Server implements IServer {
  app: Application;
  server: HTTPServer;

  constructor() {
    this.app = express();
    
    this.setStatic();
    this.setMiddlewares();
    this.setRoutes();

    this.server = createServer(this.app);
  }

  setMiddlewares(): void {
    this.app.use(express.json({}));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(cookieParser())
//    this.app.use(serverCors);
  }

  setRoutes(): void {
    this.app.use(serverRoutes);
    this.app.use(unknownRoute);
    this.app.use(errorHandler);
  }

  setStatic(): void {
    const staticPath = resolve(__dirname, '../public');
    this.app.use("/public", express.static(staticPath));
  }

  async start(): Promise<void> {
    try {
      await AppDataSource.synchronize();
      
      this.server.listen(AppConfig.server, () => {
        const addressInfo = this.server.address();
        if(typeof addressInfo === 'string')
        {
          console.log(`Sistema Atlas inicializado em ${this.server.address()?.toString()}`);
        }
        else if(addressInfo)
          {
            const host = addressInfo.address === '::' ? (AppConfig.server.hostname ?? 'localhost') : addressInfo.address
            console.log(`Sistema Atlas inicializado em http://${host}:${addressInfo.port}`);
        }
        console.log(`Ambiente: ${AppConfig.escopo.toUpperCase()}`);
        console.log('====================================');
      });
    }
    catch (error) {
      console.error(`Erro ao iniciar servidor: ${error.message}`);
    }
  }
}

export default Server;
