import { Grid, TextInput, Title } from "@mantine/core"
import { useForm } from "@mantine/form";
import { ReactNode } from "react"

type ForgotPasswordProps = {
    children?: ReactNode,
    email_sent: boolean;
}

export const ForgotPasswordForm = (props: ForgotPasswordProps) => {
    const form = useForm({
        initialValues: {
            email: ''
        }
    })
    
    return (
        <form>
            <Grid>
                <Grid.Col>
                    <Title size="xl" ta="center" ff={'text'} fw="bold">
                        Recuperação de senha
                    </Title>
                </Grid.Col>
                <Grid.Col>
                    <TextInput
                    	label="Email"
                    	required
                    	disabled={props.email_sent}
                        key="email"
                        {...form.getInputProps('email')}
                    />
                </Grid.Col>
                <Grid.Col>
                    { props.children }
                </Grid.Col>
            </Grid>
        </form>
    )
}