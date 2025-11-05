import { cliui } from "@poppinss/cliui";

export const createUI = (): ReturnType<typeof cliui> => {
    return cliui()
}

