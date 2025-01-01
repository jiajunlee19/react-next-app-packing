import { links, projects, skills, experiences } from "@/app/_libs/data";

export type TSectionName = (typeof links)[number]["name"];
export type TProject = (typeof projects)[number];
export type TSkill = (typeof skills)[number];
export type TExperience = (typeof experiences)[number];


export type TFormMode = "create" | "update" | null;

export type TRole = "user" | "admin" | "boss";

export type TRowData = {
    [key: string]: string | number | Date,
};

export type TInputType = {
    [key: string]: "number" | "select" | "text" | "password" | "dynamic" | "hidden" | "readonly"
}

export type State = {
    error?: {
        [key: string]: string[]
    } |  null,
    message: string | null,
};

export type StatePromise = Promise<State>;