import { ActionIcon, Group, Modal, Paper, SimpleGrid, Text } from "@mantine/core";
import { CustomModalProps } from "./types"
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import { ReactNode } from "react";
import ActionButton from "../button/action-button";

const CustomModal = (props: CustomModalProps) => {
    const ModalActions = () => {
        if(!props.actions) return;
        const ActionButtons = () => {
            return props.actions!.map((action, index) => (
                <ActionButton
                    key={`btn-${index}`}
                    label={action.label}
                    tooltip={action.tooltip}
                    icon={action.icon}
                    color={action.color}
                    disabled={action.disabled}
                    show={action.show}
                    click={action.click}
                    type={action.type}
                    width={action.width}
                />
            ))
        }
        const ActionBar = ({ children }: { children: ReactNode}) => {
            return (
                <Paper w="100%" h="5%"  bottom="0" px={15} py={10} radius="0">
                    { children }
                </Paper>
            )
        }
        if(!props.fillActions)
        {
            return (
                <ActionBar>
                    <Group justify="end" align="center">
                        <ActionButtons />
                    </Group>
                </ActionBar>
            )
        }
        else 
        {
            return (
                <ActionBar>
                    <SimpleGrid spacing={10} cols={props.actions.length}>
                        <ActionButtons />
                    </SimpleGrid>
                </ActionBar>
            )
        }
    }
    
    return (
        <Modal.Root
        	opened={props.opened}
        	onClose={props.onClose}
            size={props.size}
            centered={props.centered}
            mah="70%"
        >
            <Modal.Overlay blur={3} backgroundOpacity={0.55} />
            <Modal.Content mah="100%">
                <Modal.Header h="5%"  >
                    <Text fz="h3" >{ props.title }</Text>
                    {
                        !props.persistent && (
                            <ActionIcon
                                variant="transparent"
                                onClick={props.onClose}
                                c="black"
                            >
                                <Icon path={mdiClose} />
                            </ActionIcon>
                        )
                    }
                </Modal.Header>
                <Modal.Body mah="70%" py={10} px={20} >
                    {
                        props.children
                    }
                </Modal.Body>
                <ModalActions />
            </Modal.Content>
            
        </Modal.Root>
    );
}
export default CustomModal