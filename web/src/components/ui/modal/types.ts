import { ReactNode } from "react";
import { ActionButtonProps } from "../button/action-button/interfaces";

export type CustomModalProps = {
    opened: boolean;
    onClose: () => void;
    title?: string;
    centered?: boolean;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | string | number
    persistent?: boolean;
    fillActions?: boolean;
    actions?: ActionButtonProps[]
    children?: ReactNode
}