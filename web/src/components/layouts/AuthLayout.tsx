import { Component, PropsWithChildren, ReactNode } from "react";
import classes from './AuthLayout.module.css'
import { env } from "@/config/env";
import { Title, Paper, Container } from "@mantine/core";

type AuthLayoutProps = {
    title: string;
}

class AuthLayout extends Component<PropsWithChildren<AuthLayoutProps>>
{

    render(): ReactNode {
        return (
            <div className={classes.wrapper}>
                <Container fluid w="500px" className={classes.container}>
                    <img src={`${env.static}/images/logo.png`} width="200px" height="150px" style={{opacity: 0.7}} />
                    <Title ta="center" my={30}>
                        MAIL DISPATCHER
                    </Title>
                    <Paper withBorder shadow="md" p={30} radius="md">
                        
                        { this.props.children }
                    </Paper>
                </Container>
            </div>
        )
    }
}

export { AuthLayout }