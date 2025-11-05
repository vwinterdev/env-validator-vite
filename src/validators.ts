import { Schema, Log, ValidatorType } from "./type";
import { createUI } from "./utils";
import { messages } from "./const";

const validateDefault = async (envSchema: Schema, envConfig: Record<string, string>) => {
    const logs: Log[] = []
     for (const [key, rule] of Object.entries(envSchema)) {
      try {
        const res = rule(key, envConfig[key])
        if (typeof res === 'undefined') continue
        logs.push({ key, value: res, message: 'success' })
      } catch (err) {
        logs.push({ key, message: String(err), value: envConfig[key], isError: true })
      }
    }
    return logs
}

const validateZod = async (envSchema: Schema, envConfig: Record<string, string>) => {
    const logs: Log[] = []
    for (const [key, rule] of Object.entries(envSchema)) {
        const result = await rule['~standard'].validate(envConfig[key])
        if (result.issues) {
            const issue = result.issues[0]
            logs.push({ key, message: messages.invalidValue(key, issue.expected), value: envConfig[key], isError: true })
        } else {
            logs.push({ key, value: result.value, message: 'success' })
        }
      }
    return logs
}

const validators = {
    default: validateDefault,
    zod: validateZod,
    valibot: validateZod,
    arktype: validateZod
}

export const selectValidator = (validator: ValidatorType) => {
    const validatorFn = validators[validator]
    if(!validatorFn){
        const UI = createUI()
        UI.logger.fatal(messages.validatorNotFound(validator))
        process.exit(1)
    }
    return  validatorFn
}
