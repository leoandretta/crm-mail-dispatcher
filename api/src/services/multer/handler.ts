import express from "express";
import multer from "multer";
import CustomStorage from "./storage";

class MulterHandler implements multer.Multer
{
    private _upload: multer.Multer;

    constructor() 
    {
        this._upload = this.setupUpload();
    }

    private setupUpload(): multer.Multer {
        const storage = new CustomStorage();

        return multer({ storage })
    }

    public single(fieldName: string): express.RequestHandler {
        return this._upload.single(fieldName)
    }

    public array(fieldName: string, maxCount?: number): express.RequestHandler {
        return this._upload.array(fieldName, maxCount)
    }

    public fields(fields: readonly multer.Field[]): express.RequestHandler {
        return this._upload.fields(fields)
    }

    public any(): express.RequestHandler {
        return this._upload.any();
    }

    public none(): express.RequestHandler {
        return this._upload.none()
    }
    
}

export default new MulterHandler();

