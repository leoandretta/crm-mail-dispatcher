import { Router } from "express";
import { CompanyControllers } from "../controllers";

const companyRoutes = Router({ mergeParams: true })

companyRoutes.route('/:id')
    .get(CompanyControllers.findById)
    .put(CompanyControllers.update);

companyRoutes.route('/')
    .get(CompanyControllers.find)
    .post(CompanyControllers.create);

export{ companyRoutes }