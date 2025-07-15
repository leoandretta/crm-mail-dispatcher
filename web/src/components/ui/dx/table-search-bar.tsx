import { TextInput } from "@mantine/core";
import { DataGrid } from "devextreme-react";
import { RefObject, useState } from "react";

type TableSearchBarProps = {
    width?: string | number;
    refTable: RefObject<DataGrid<ContactAttributes, any> | null>
}

const TableSearchBar = ({ refTable, width }: TableSearchBarProps) => {
        const [search, setSearch] = useState<string>('');

        const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.currentTarget

            if (!refTable.current?.instance) throw new Error(`Não há uma tabela instanciada!`);
            
            const dataGrid = refTable.current.instance;
            if (!value) {
                dataGrid?.clearFilter();
            } else {
                const columns = dataGrid?.getVisibleColumns() ?? [];
                const filters: ([string, string, string|number|Date] | 'and' | 'or')[] = []
                for (const column of columns)
                {
                    if(!column.dataField || column.dataField == 'actions') continue;
                    else if(column.allowSearch !== false) {
                        if(filters.length !== 0) filters.push('or');
                        if(!column.dataType) continue;

                        const searchOperators: { [key: string]: string } = {
                            "string": "contains",
                            "number": "=",
                            "date": "=",
                            "datetime": "=",
                            "boolean": "=",
                            "object": "=",
                        }

                        filters.push([column.dataField, searchOperators[column.dataType], value])
                    }
                }
                dataGrid?.filter(filters);
            }
            
            setSearch(value);
        }
        
        return (
            <TextInput
                placeholder="Buscar"
                value={search}
                onChange={handleSearchChange}
                w={width}
                size="md"
                radius="md"
            />
        )
    };
    export default TableSearchBar;