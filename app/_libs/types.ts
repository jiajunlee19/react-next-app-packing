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