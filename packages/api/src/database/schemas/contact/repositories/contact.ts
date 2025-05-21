
import { BaseRepository } from "@/database/classes";
import { Contact } from "@/database/models";
import { ContactAttributes, ContactCreationAttributes, ContactUpdateAttributes } from "@crm-mail-dispatcher/shared/interfaces/contact";

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