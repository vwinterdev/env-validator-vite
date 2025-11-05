export interface Schema {
    [key: string]: any
}

export type ValidatorType = 'default' | 'zod' | 'valibot' | 'arktype'

export type RenderType = 'table' | ((logs: Log[]) => void)

export interface ValidatorOptions {
    validator?: ValidatorType
    schema: Schema
    render?: RenderType
}

export interface Log {
    key: string
    value: string | undefined
    message: string
    isError?: boolean
}