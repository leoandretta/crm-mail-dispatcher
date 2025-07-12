import { Router } from "express";
import { apiRoutes } from "../api/routes";

const serverRoutes = Router({ mergeParams: true });

serverRoutes.use('/api', apiRoutes)

export default serverRoutes;