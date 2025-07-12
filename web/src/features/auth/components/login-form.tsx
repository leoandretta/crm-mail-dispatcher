import { Grid, TextInput, PasswordInput, Anchor, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import useAuth from "@/hooks/useAuth";

type LoginFormProps = {
    onSuccess: () => void
}

type LoginFormValues =
{
    email: string;
    password: string;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
    const { login } = useAuth()
    const form = useForm<LoginFormValues>({
        initialValues: {
            email: '',
            password: ''
        },
    })

    const onSubmit = async (values: LoginFormValues) => {
        await login(values);
        onSuccess();
    }
    
    // const onClickForget = () => {
    //     navigate(paths.auth["forgot-password"].path())
    // }
    
    return (
        <form onSubmit={form.onSubmit(onSubmit)}>
            <Grid>
                <Grid.Col span={{ base: 12 }}>
                    <TextInput
                        label="Email"
                        required
                        key={form.key('email')}
                        {...form.getInputProps('email')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12 }}>
                    <PasswordInput
                        label="Senha"
                        required
                        mt="md"
                        key={form.key('password')}
                        {...form.getInputProps('password')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12 }} >
                    <Grid justify="end">
                        <Anchor size="sm" href="/esqueci-minha-senha" >
                            Esqueceu sua senha?
                        </Anchor>
                    </Grid>
                </Grid.Col>
                <Grid.Col span={{ base: 12 }}>
                    <Button fullWidth mt={'xl'} type="submit">
                        Entrar
                    </Button>
                </Grid.Col>
            </Grid>
        </form>
    )
}