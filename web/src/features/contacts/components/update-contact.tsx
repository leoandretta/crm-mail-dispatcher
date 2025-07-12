import CustomModal from "@/components/ui/modal"
import { Grid, InputBase, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { mdiAccount, mdiAt, mdiDomain, mdiPhone } from "@mdi/js"
import Icon from "@mdi/react"
import { useEffect, useMemo, useRef } from "react"
import { ActionButtonProps } from "@/components/ui/button/action-button/interfaces"
import { getContact } from "../api/get-contact"
import { ContactUpdateValues, updateContact } from "../api/update-contact"
import { IMaskInput } from "react-imask"

type CreateContactModalProps = {
    opened: boolean;
    onSuccess: (data: ContactAttributes) => void;
    onClose: (error?: Error | string) => void;
    contactId: number | null;
}

const UpdateContactModal = ({ opened, onSuccess, onClose, contactId }: CreateContactModalProps) => {
    const formRef = useRef<HTMLFormElement>(null)
    
    const form = useForm<ContactUpdateValues>({
        initialValues: {
            name: '',
            company_name: '',
            email: '',
            phone: ''
        }
    })

    const modal_actions: ActionButtonProps[] = useMemo(() => [
        {
            label: 'Salvar',
            click: () => formRef.current?.requestSubmit()
        }
    ], []);

    useEffect(() => {
        const fetchData = async () => {
            if(!opened) return;
            try {
                if(!contactId) throw new Error("Contato não identificado");
                const response = await getContact(contactId);
                if(!response.success) throw new Error(response.message)
                const { data } = response
                if(!data.company) throw new Error(`Dados de empresa e telefones não recebidos`);

                form.setValues({
                    name: data.name,
                    company_name: data.company.name,
                    email: data.email,
                    phone: data.phone
                })

            } catch (error) {
                notifications.show({
                    title: "Erro",
                    message: error.message,
                    color: "red",
                    position: "top-right"
                })
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [opened, contactId])

    const onSubmit = async (values: ContactUpdateValues) => {
        try {
    
            if(!contactId) throw new Error("Contato não informado");
            
            const res = await updateContact(contactId, values)
            if(!res.success) throw new Error(res.message);

            onSuccess(res.data)
            
            notifications.show({
                message: res.message,
                color: 'green'
            })
        } catch (error) {
            onClose(error);
            notifications.show({
                message: error.message,
                color: 'red'
            })
        }
        finally {
            form.reset();
        }

    }

    const onCancel = () => {
        form.reset()
        onClose()
    }
    
    return (
        <CustomModal
            opened={opened}
            onClose={onCancel}
            title="Editar Contato"
            actions={modal_actions}
        >
            <form ref={formRef} onSubmit={form.onSubmit(onSubmit)}>
                <Grid>
                    <Grid.Col span={12}>
                        <TextInput                            	
                            label="Nome"
                            required
                            leftSection={<Icon path={mdiAccount} size="20" />}
                            key={form.key('name')}
                            {...form.getInputProps('name')}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <TextInput                            	
                            label="Empresa"
                            required
                            leftSection={<Icon path={mdiDomain} size="20" />}
                            key={form.key('company_name')}
                            {...form.getInputProps('company_name')}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <TextInput                            	
                            label="Email"
                            required
                            leftSection={<Icon path={mdiAt} size="20" />}
                            key={form.key(`email'`)}
                            {...form.getInputProps(`email`)}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <InputBase
                            label="Telefone"
                            required
                            leftSection={<Icon path={mdiPhone} size="20" />}
                            component={IMaskInput}
                            mask="(00) 00000-0000"
                            key={form.key(`phone'`)}
                            {...form.getInputProps(`phone`)}
                        />
                    </Grid.Col>
                </Grid>
            </form>
        </CustomModal>
    )
}
export default UpdateContactModal;