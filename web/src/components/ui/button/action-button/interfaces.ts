import { DefaultMantineColor } from "@mantine/core";

type ActionHandleParams= {
    item: EntityAttributes,
    index: number,
    items: EntityAttributes[]   
}

export type ActionButtonProps = {
    show?: boolean | ( (params?: ActionHandleParams) => boolean );
    disabled?: boolean | ( (params?: ActionHandleParams) => boolean );
    click?: (params?: ActionHandleParams) => void;
    label: string;
    icon?: string;
    type?: "submit" | "reset" | "button";
    tooltip?: string;
    width?: string | number;
    color?: string | DefaultMantineColor
}
