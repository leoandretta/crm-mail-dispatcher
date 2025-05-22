import { Router } from "express";
import { ContactControllers } from "../controllers";

const contactRouter = Router({ mergeParams: true })

contactRouter.route('/dx')
    .get(ContactControllers.devextreme);

contactRouter.route('/:id')
    .get(ContactControllers.findById)
    .put(ContactControllers.update)
    .delete(ContactControllers.delete);

contactRouter.route('/')
    .get(ContactControllers.find)
    .post(ContactControllers.create);

export{ contactRouter }