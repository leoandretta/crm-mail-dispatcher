import { AppConfig } from "../config";
import { Database } from "./classes/database";

const AppDataSource = new Database(AppConfig.database, {
    extensions: ["unaccent"]
})

export default AppDataSource;