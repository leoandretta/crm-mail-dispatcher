import { ReactNode } from "react";
import classes from './AppLayout.module.css'
import { ActionIcon, Button,    Group, Title, Tooltip } from "@mantine/core";
import Icon from "@mdi/react";
import { ActionButtonProps } from "../ui/button/action-button/interfaces";
import Logo from "@/assets/images/logo.png"
import { mdiAccount, mdiLogout } from "@mdi/js";
import useAuth from "@/hooks/useAuth";

type AppLayoutProps = {
    actions?: ActionButtonProps[];
    children?: ReactNode;
}
const AppLayout = ({ actions, children}: AppLayoutProps) => {
    const { user, logout } = useAuth()
    return (
        <div className={classes.wrapper}>
            <header>
                <div className={classes.header_wrapper}>
                    <img src={Logo} height="70px"/>
                    {
                        actions && actions.map(action => {
                            const ActionButton = () => (
                                <Button variant="light" onClick={() => action.click && action.click()}>
                                    {
                                        action.icon && <Icon path={action.icon} size="25" />
                                    }
                                    {action.label}
                                </Button>
                            )
                            return (
                                action.tooltip ? (
                                    <Tooltip key={action.tooltip} label={action.tooltip}>
                                        <ActionButton/>
                                    </Tooltip>
                                ) : (
                                    <ActionButton key={action.tooltip} />
                                )
                            )
                        })
                    }
                    <Group>
                        <Icon path={mdiAccount} size="30" color="darkblue" />
                        <Title size="25" c="darkblue">
                            { user?.name?.replace(/\s.+/, "") }
                        </Title>
                        <ActionIcon variant="transparent" onClick={logout} radius="xl">
                            <Icon path={mdiLogout} size="30" color="gray" />
                        </ActionIcon>
                    </Group>
                </div>
            </header>
            <main className={classes.content_wrapper}>
                {children}
            </main>
        </div>
    )
}

export { AppLayout }