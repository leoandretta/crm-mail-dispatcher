import { Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { mdiReload } from "@mdi/js";
import Icon from "@mdi/react";
import { DataGrid } from "devextreme-react";
import dxDataGrid from "devextreme/ui/data_grid";
import { RefObject } from "react";

type TableReloadButtonProps = {
    refTable: RefObject<DataGrid<ContactAttributes, any> | null>
    dataGrid?: dxDataGrid
}

const TableReloadButton = ({ refTable }: TableReloadButtonProps) => {
    const onClick = () => {
        try {
            if (!refTable.current?.instance) throw new Error(`Não há uma tabela instanciada!`);
            
            refTable.current.instance.state(null)
        } 
        catch (error) {
            notifications.show({
                title: "Erro",
                message: error.message,
                color: "red"
            })
        }
    }
    return (
        <Button
            color="yellow.5"
            bd="1px solid"
            radius="md"
            onClick={onClick}
        >
            <Group gap={5}>
                <Icon path={mdiReload} size="20" />
                Recarregar
            </Group>
        </Button>
    )
};

export default TableReloadButton;