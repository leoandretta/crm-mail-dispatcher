import { AppConfig } from "@/config";
import Mailer from "./classes";

const MailDispatch = new Mailer(AppConfig.mailer)

export default MailDispatch;
