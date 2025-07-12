import CustomModal from "@/components/ui/modal";
import { Button, FileInput, Grid, Group, LoadingOverlay, MultiSelect, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { mdiAttachment, mdiMail } from "@mdi/js";
import Icon from "@mdi/react";
import { RefObject, useCallback, useRef, useState } from "react";
import { sendEmail } from "../api/send-email";
import { ActionButtonProps } from "@/components/ui/button/action-button/interfaces";
import TextEditor from "@/components/ui/tiptap/text-editor";
import { notifications } from "@mantine/notifications";
import { DataGrid } from "devextreme-react";

type SendEmailModalProps = {
    refTable: RefObject<DataGrid<ContactAttributes, any> | null>
    onSuccess: () => void;
    onError: (error: Error | string) => void;
}


const SendEmailModal = (props: SendEmailModalProps) => {
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);

    const formRef = useRef<HTMLFormElement>(null)
    const form = useForm<EmailPayloadValues>({
        mode: "uncontrolled",
        initialValues: {
            to: [],
            subject: "",
            message: "",
            files: []
        }
    })

    const modal_actions: ActionButtonProps[] = [
        {
            label: 'Enviar',
            click: () => formRef.current?.requestSubmit()
        }
    ]
    
    const openEmailModal = useCallback(async () => {
        const data = await props.refTable?.current?.instance?.getSelectedRowsData()
        if(!data || !data.length) {
            return notifications.show({
                title: "Erro",
                message: "Selecione pelo menos um contato e tente novamente.",
                color: "red",
                position: "top-right"
            })
        }
        form.setFieldValue('to', data.map(d => d.email));

        setOpened(true);
    }, [props.refTable, form])
       
    const onClose = () => {
        setOpened(false)
        form.reset()
    }
    
    const SendEmailButton = () => (
        <Button bg="teal" radius="md" onClick={openEmailModal}>
            <Group gap={5}>
                <Icon path={mdiMail} size="20" />
                Novo Email
            </Group>
        </Button>
    )

    

    const onSubmit = async (values: EmailPayloadValues) => {
        setLoading(true);
        try {
            const { success, message } = await sendEmail(values);
            if(!success) throw new Error(message);

            notifications.show({
                title: "SUCESSO",
                message,
                color: "green",
                position: "top-right"
            })

            props.onSuccess();
        } catch (error) {
             notifications.show({
                title: "ERRO",
                message: error.message,
                color: "red",
                position: "top-right"
            })
        } finally {
            setLoading(false);
            setOpened(false);
            form.reset();
        }
    }


    

    
    return (
        <>
            <SendEmailButton />
            <CustomModal            	
                title={`Novo Email`}
                opened={opened}
                actions={modal_actions}
                size="70%"
                centered    
                onClose={onClose}
            >
                <LoadingOverlay visible={loading} />
                <form ref={formRef} onSubmit={form.onSubmit(onSubmit)}>
                    <Grid>
                        <Grid.Col span={12}>
                            <MultiSelect                            	
                                label="Para:"
                                readOnly
                                multiple
                                required
                                key={form.key('to')}
                                {...form.getInputProps('to')}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <TextInput                            	
                                label="Assunto"
                                required
                                key={form.key('subject')}
                                {...form.getInputProps('subject')}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <FileInput                            	
                                label="Anexos"
                                multiple
                                leftSection={<Icon path={mdiAttachment} size="20" />}
                                key={form.key(`files'`)}
                                {...form.getInputProps(`files`)}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <TextEditor
                            	key={form.key('message')}
                                {...form.getInputProps(`message`)}
                            />
                        </Grid.Col>
                    </Grid>
                </form>
            </CustomModal>
        </>
    )
}

export default SendEmailModal;