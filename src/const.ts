export const messages = {
    validatorNotFound: (validator: string) => `Validator ${validator} not found, using default validator`,
    renderNotFound: (render: string) => `Render ${render} not found, using default render`,
    invalidValue: (key: string, expected: string) => `${key} is invalid, must be ${expected}`,
}

export const constants = {
    noValue: 'n/a',
}