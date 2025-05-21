import { Router } from "express";
import { authRouter } from "./modules/auth/routes";
import { contactRouter } from "./modules/contact/routes";
import { companyRoutes } from "./modules/company/routes";
import { emailRouter } from "./modules/email/routes";
import { verifyJWT } from "@/middlewares/verify-jwt";
const apiRoutes = Router()

apiRoutes.use("/auth", authRouter);

apiRoutes.use(verifyJWT);

apiRoutes.use("/companies", companyRoutes);
apiRoutes.use("/contacts", contactRouter);
apiRoutes.use("/emails", emailRouter);

export { apiRoutes };