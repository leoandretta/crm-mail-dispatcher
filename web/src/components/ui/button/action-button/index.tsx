import { ActionButtonProps } from "./interfaces";
import { Button, Tooltip } from "@mantine/core"
import Icon from "@mdi/react"

const ActionButton = (props: ActionButtonProps) => {
    
    const handleShow = (handle: ActionButtonProps['show']): boolean => {
        if(typeof handle == 'undefined') return true;
        else if(typeof handle == 'function') return handle()
        else if(typeof handle == 'boolean') return handle
        return false;
    }

    const handleDisabled = (handle: ActionButtonProps['disabled']): boolean => {
        if(typeof handle == 'undefined') return false;
        else if(typeof handle == 'function') return handle()
        else if(typeof handle == 'boolean') return handle
        return true;
    }
    
    const handleClick = (handle: ActionButtonProps['click']) => {
        if(typeof handle == 'undefined') return null;
        else if(typeof handle !== 'function') return null
        else return handle()
        
    }
    
    const IconButton = () => (
        <Button
            color={props.color}
            radius="md"
            disabled={handleDisabled(props.disabled)}
            onClick={() => handleClick(props.click)}
            w={props.width}
        >
            {
                props.icon && <Icon path={props.icon} size={"20px"} />
            }
            { props.label }
        </Button>
    )
    
    return handleShow(props.show) && (
        props.tooltip ? (
            <Tooltip key={`tp-${props.tooltip}`} label={props.tooltip} position="bottom">
                <IconButton />    
            </Tooltip>
        ) : (
            <IconButton />
        )
    )
}

export default ActionButton;