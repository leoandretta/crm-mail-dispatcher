import { useCallback, useMemo, useRef, useState } from "react";
import { DataGrid, Template } from "devextreme-react";
import type { ColumnHeaderCellTemplateData, ColumnCellTemplateData, Column } from "devextreme/ui/data_grid";
import CustomStore from "devextreme/data/custom_store";
import { 
        Column as DXColumn, 
        Paging as DXPaging, 
        Item as DXItem,
        Toolbar as DXToolbar,
        DataGrid as DataGridRef,
        Selection,
        SearchPanel,
} from "devextreme-react/data-grid"
import { ActionIcon, Button, Group, Text, Tooltip } from "@mantine/core";
import TableSearchBar from "@/components/ui/dx/table-search-bar";
import TableReloadButton from "@/components/ui/dx/table-reload-button";
import CreateContactModal from "./create-contact";
import SendEmailModal from "@/features/email/components/send-email";
import './table-contact.css'
import { contactsColumns } from "@/config/columns";
import UpdateContactModal from "./update-contact";
import Icon from "@mdi/react";
import { mdiPencil, mdiPlus } from "@mdi/js";
import { getContacts } from "../api/get-contacts";

const TableContact = () => {
    const dataGridRef = useRef<DataGridRef>(null);

    const [isModalCreateOpen, setModalCreateOpen] = useState(false);
    const [isModalUpdateOpen, setModalUpdateOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null)
    
    const [current_page, setPage] = useState(0);
    const [current_page_size, setPageSize] = useState(10);
    
    const columns: Column[] = useMemo(() => contactsColumns, [])
    
    const handleCreate = () => {
        setModalCreateOpen(true);
    }

    const handleUpdate = (id: number) => {
        setModalUpdateOpen(true)
        setSelectedId(id);
    }
    
    const onModalSuccess = () => {
        setModalCreateOpen(false);
        setModalUpdateOpen(false);
        dataGridRef.current?.instance.state(null);
    }

    const onModalClose = () => {
        setModalUpdateOpen(false)
        setModalCreateOpen(false)
    }

    const CreateContactButton = () => (
        <Button radius="md" onClick={handleCreate}>
            <Group gap={5}>
                <Icon path={mdiPlus} size="20" />
                Cadastrar
            </Group>
        </Button>
    )
    
    const headerCellRender = useCallback((data: ColumnHeaderCellTemplateData) => {
        return (
            <div className="cff" >
                { data.column.caption }
            </div>
        )
    }, [])

    const actionCellRender = useCallback((data: ColumnCellTemplateData) => {
        return (
            <Tooltip key="update-btn" label="Editar" position="bottom">
                <ActionIcon variant="light" radius="xl" onClick={() => handleUpdate(data.data.id)} >
                    <Icon path={mdiPencil} size="20" />
                </ActionIcon>
            </Tooltip>
        )
    }, [])

    const phoneCellRender = useCallback(({ data }: ColumnCellTemplateData ) => {
        const default_phone = data.phones.find((e: any) => e.primary == true)
        if(!default_phone) 
        {
            return <Text>Não informado</Text>
        }
        else 
        {
            return <Text>{ default_phone.phone }</Text>
        }
    }, [])

    const dataSource = useMemo<CustomStore>(() => {
        return new CustomStore({
            key: 'id',
            load: async (options) => {
                try {
                    options.customQueryParams = {
                        attributes: columns.map(el => el.dataField).filter(c => c !== 'actions')
                    }
            
                    if(options.filter) options.filter = JSON.stringify(options.filter);
                    if(options.group) options.group = JSON.stringify(options.group);
                    if(options.sort) options.sort = JSON.stringify(options.sort);
                    if(options.customQueryParams) options.customQueryParams = JSON.stringify(options.customQueryParams);

                    return await getContacts(options)
                } catch (error) {
                    throw new Error(error.message)
                }
            }
        })
    }, [columns]);

    
    return (
        <>
            <DataGrid
                id="contacts-table"
                height="100%"
                width="100%"
                ref={dataGridRef}
                renderAsync
                showRowLines
                showBorders
                wordWrapEnabled
                remoteOperations
                dataSource={dataSource}
                sorting={{ mode: "multiple", showSortIndexes: true }}
                headerFilter={{ visible: true }}
                loadPanel={{ enabled: true, shading: false, text: "Carregando contatos..."}}
                scrolling={{ mode: "standard", rowRenderingMode: "standard", renderAsync: true, preloadEnabled: true }}
                pager={{ visible: true, displayMode: "full", showPageSizeSelector: true, showNavigationButtons: true, allowedPageSizes: [10, 25, 50]}}
            >
                <SearchPanel
                    visible
                    highlightSearchText
                    searchVisibleColumnsOnly
                />
                
                <DXToolbar visible  >
                    <DXItem location="before" template="reload-table" />
                    <DXItem location="before" template="add-button" />
                    <DXItem location="before" template="send-mail-button" />
                    <DXItem name="searchPanel" location="after" template="search-bar"/>
                </DXToolbar>
                
                <Selection deferred mode="multiple" selectAllMode="allPages" showCheckBoxesMode="always" />
                {
                    columns.map((column, index) => (
                        <DXColumn
                            key={`column-${index}`}
                            headerCellTemplate="title-header"
                            renderAsync
                            cellTemplate={column.cellTemplate}
                            visibleIndex={column.visibleIndex}
                            alignment={column.alignment}
                            allowSearch={column.allowSearch}
                            allowSorting={column.allowSorting}
                            allowFiltering={column.allowFiltering}
                            allowHeaderFiltering={column.allowHeaderFiltering}
                            caption={column.caption}
                            dataField={column.dataField}
                            dataType={column.dataType}
                            falseText={column.falseText ?? 'Não'}
                            trueText={column.trueText ?? 'Sim'}
                            fixed={column.fixed}
                            fixedPosition={column.fixedPosition ?? "right"}
                            format={column.format}
                            sortOrder={column.sortOrder}
                            visible={column.visible}
                            width={column.width}
                            headerFilter={column.headerFilter}
                        />
                    ))
                }
                <DXPaging
                    enabled
                    pageIndex={current_page}
                    onPageIndexChange={setPage}
                    pageSize={current_page_size}
                    onPageSizeChange={setPageSize}
                />
                <Template name="search-bar" >
                    <TableSearchBar refTable={dataGridRef} width="500px" />
                </Template>
            
                <Template name="reload-table" >
                    <TableReloadButton refTable={dataGridRef} />
                </Template>
            
                <Template name="add-button" >
                    <CreateContactButton />
                </Template>
                
                <Template name="send-mail-button">
                    <SendEmailModal refTable={dataGridRef} onSuccess={onModalSuccess} onError={onModalClose} />
                </Template>

                <Template name="title-header" render={headerCellRender} />

                <Template name="actions" render={actionCellRender} />
            
                <Template name="phones.phone" render={phoneCellRender} />
            </DataGrid>

            <CreateContactModal opened={isModalCreateOpen} onSuccess={onModalSuccess} onClose={onModalClose} />
            <UpdateContactModal opened={isModalUpdateOpen} onSuccess={onModalSuccess} onClose={onModalClose} contactId={selectedId} />
        </>
    )
}

export default TableContact;