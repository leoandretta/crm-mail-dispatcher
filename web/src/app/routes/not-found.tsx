import { paths } from '@/config/paths';
import { Button, Container } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const NotFoundRoute = () => {
    const navigate = useNavigate();
    const onClick = () => {
        navigate(paths.app.path(), { replace: true });
    }

    return (
        <Container pt="200px" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <h1>404 - Página não existe</h1>
            {/* <p>Sorry, the page you are looking for does not exist.</p> */}
            <Button onClick={onClick} variant='light'>
                Página inicial
            </Button>
        </Container>
    );
};

export default NotFoundRoute;