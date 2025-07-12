import CustomModal from "@/components/ui/modal"
import { Autocomplete, Grid, InputBase, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { mdiAccount, mdiAt, mdiDomain, mdiPhone } from "@mdi/js"
import Icon from "@mdi/react"
import { useEffect, useMemo, useRef, useState } from "react"
import { ContactCreateValues, createContact } from "../api/create-contact"
import { ActionButtonProps } from "@/components/ui/button/action-button/interfaces"
import { IMaskInput } from 'react-imask';
import { getCompanies } from "@/features/companies/api/get-companies"


type CreateContactModalProps = {
    opened: boolean;
    onSuccess: (data: ContactAttributes) => void;
    onClose: (error?: Error | string) => void;
}

const CreateContactModal = ({ opened, onSuccess, onClose}: CreateContactModalProps) => {
    const formRef = useRef<HTMLFormElement>(null)
    const [companies, setCompanies] = useState<string[]>([])

    const form = useForm<ContactCreateValues>({
        initialValues: {
            name: '',
            company_name: '',
            email: '',
            phone: '',
        }
    })

    const modal_actions: ActionButtonProps[] = useMemo(() => [
        {
            label: 'Cadastrar',
            click: () => formRef.current?.requestSubmit()
        }
    ], [])

    const onSubmit = async (values: ContactCreateValues) => {
        try {
    
            const res = await createContact(values)
            if(!res.success) throw new Error(res.message);

            onSuccess(res.data)
            
            notifications.show({
                message: res.message,
                color: 'green',
                position: "top-right"
            })
        } catch (error) {
            onClose(error);
            notifications.show({
                message: error.message,
                color: 'red',
                position: "top-right"
            })
        }
        finally {
            form.reset();
        }
    }

    const onCancel = () => {
        form.reset()
        onClose();
    }

    useEffect(() => {
        const fetchData = async () => {
            if(!opened) return;
            try {
                const res = await getCompanies();
                if(!res.success) throw new Error(res.message)
                
                setCompanies(res.data.map(c => c.name));
                
            } catch (error) {
                notifications.show({
                    title: "Erro",
                    message: error.message,
                    color: "red",
                    position: "top-right"
                })
            }
        }
        fetchData()
    }, [opened])

    return (
        <CustomModal
            opened={opened}
            onClose={onCancel}
            title="Novo Contato"
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
                        <Autocomplete                            	
                            label="Empresa"
                            required
                            data={companies}
                            comboboxProps={{offset: 0, shadow: "lg", }}
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
export default CreateContactModal;