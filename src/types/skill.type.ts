import { JSX } from "react";

export type Skill = {
    icon: JSX.Element | string;
    title: string;
    description: string;
    details: string[];
    stack: string;
    className: string;
}