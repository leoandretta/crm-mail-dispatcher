import CustomModal from "@/components/ui/modal"
import { notifications } from "@mantine/notifications"
import { useCallback, useMemo, useState } from "react"
import { ContactAttributes } from "@crm-mail-dispatcher/shared/interfaces/contact"
import { ActionButtonProps } from "@/components/ui/button/action-button/interfaces"
import { deleteContact } from "../api/delete-contact"
import { LoadingOverlay, Text } from "@mantine/core"

type DeleteContactModalProps = {
    opened: boolean;
    onSuccess: (data: ContactAttributes) => void;
    onClose: () => void;
    contactId: number | null;
}

const DeleteContactModal = ({ opened, onSuccess, onClose, contactId }: DeleteContactModalProps) => {
    const [loading, setLoading] = useState(false);
    
    const onSubmit = useCallback(async () => {
        setLoading(true);
        try {
            if(!contactId) throw new Error("Contato não informado");
            
            const res = await deleteContact(contactId)
            if(!res.success) throw new Error(res.message);

            onSuccess(res.data)
            notifications.show({
                message: res.message,
                color: 'green'
            })
        } catch (error) {
            notifications.show({
                message: error.message,
                color: 'red'
            })
        } finally {
            setLoading(false);
            onClose();
        }
    }, [contactId, onSuccess, onClose])

    const onCancel = () => {
        setLoading(false);
        onClose()
    }
    
    const modal_actions: ActionButtonProps[] = useMemo(() => [
        {
            label: 'Deletar',
            color: "red",
            width: "100%",
            click: onSubmit
        }
    ], [onSubmit]);

    return (
        <CustomModal
            title="Deseja deletar este contato?"
            opened={opened}
            onClose={onCancel}
            centered
            actions={modal_actions}
        >
            <LoadingOverlay visible={loading} />
            <Text ta={"center"} c="red" fz="sm" fs="italic">Para reverter esta ação será necessário falar com o suporte!</Text>
        </CustomModal>
    )
}
export default DeleteContactModal;