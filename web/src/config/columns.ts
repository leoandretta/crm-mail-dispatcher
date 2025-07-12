import { Column } from "devextreme/ui/data_grid";

export const contactsColumns: Column[] = [
    { 
        dataField: "id", 
        dataType: "number", 
        caption: "ID", 
        visible: false,
    },
    { 
        caption: "Nome",
        dataField: "name",
        dataType: "string",
        width: "30%",
        sortOrder: "asc",
        alignment: "center",
    },
    { 
        caption: "Empresa",
        dataField: "company.name",
        dataType: "string",
        width: "30%",
        alignment: "center",
    },
    { 
        caption: "Email",
        dataField: "email",
        dataType: "string",
        width: "30%",
        alignment: "center",
    },
    { 
        caption: "Telefone",
        dataField: "phone",
        dataType: "string",
        width: "20%",
        alignment: "center",
    },
    { 
        dataField: "active", 
        dataType: "boolean", 
        caption: "Ativo", 
        visible: false
    },
    { 
        caption: "Ações",
        dataField: "actions",
        width: "10%",
        alignment: "center",
        cellTemplate: "actions",
        allowSorting: false,
        allowHeaderFiltering: false,
        allowSearch: false,
        allowResizing: false,
        allowReordering: false,
    },
    
]