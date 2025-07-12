import { Application } from 'express';
import { Server } from 'http';

export interface IServer {
  app: Application;
  server: Server;

  setMiddlewares(): void;
  setRoutes(): void;
  setStatic(): void;

  start(): Promise<void>;
}


export interface IServerListenOptions {
  port: number, 
  hostname: string
}