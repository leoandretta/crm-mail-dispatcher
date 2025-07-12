
import { BaseRepository } from "@/database/classes";
import { ContactAttributes, ContactCreationAttributes, ContactUpdateAttributes } from "../interfaces";
import { Contact } from "../models";

export class ContactRepository extends BaseRepository<
    Contact,
    ContactAttributes,
    ContactCreationAttributes,
    ContactUpdateAttributes
>
{
    constructor()
    {
        super(Contact);
    }
}