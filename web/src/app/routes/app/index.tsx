import { AppLayout } from "@/components/layouts/AppLayout"
import TableContact from "@/features/contacts/components/table-contact"


const AppRoot = () => {
    return (
        <AppLayout >
            <TableContact  />
        </AppLayout>
    )
}

export { AppRoot }