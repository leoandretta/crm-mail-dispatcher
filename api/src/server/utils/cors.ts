import { AppConfig } from "@/config";
import { BadRequest } from "@/utils/exceptions";
import cors from "cors"

export const serverCors = cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      `http://${AppConfig.server.hostname}:3000`,
      `https://${AppConfig.server.hostname}:3000`
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new BadRequest("Não permitido pelo CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Access-Control-Allow-Origin"],
  maxAge: 86400,
})