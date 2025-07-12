import { Button, createTheme, Title } from "@mantine/core";

export const theme = createTheme({
    colors: {
        'lightblue': [ "#ecf4ff", "#dce4f5", "#b9c7e2", "#94a8d0", "#748dc0", "#5f7cb7", "#5474b4", "#44639f", "#3a5890", "#2c4b80"]
    },
    components: {
        'Title': Title.extend({
            styles: {
                root: {
                    fontFamily: 'Paytone One, sans-serif',
                    fontWeight: 'normal'
                }
            }
        }),
        'Button': Button.extend({
            styles: {
                root: {
                    height: '36px',
                }
            }
        })
    }
})