import { Router } from "express";
import { EmailControllers } from "../controllers";
import { MulterHandler } from "@/services/multer";

const emailRouter = Router({ mergeParams: true })

emailRouter.route('/')
    .post(MulterHandler.array("files", 5), EmailControllers.send)

export{ emailRouter }