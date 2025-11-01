import type { Plugin } from 'vite'
import { EnvValidatorSchema, SchemaVariant } from './types'
import { validators } from './validators'


type ValidatorFunction = (value: string) => { success: boolean; error?: string; value?: any }

export type { SchemaVariant, EnvValidatorSchema } from './types'

const validatorMap: Record<string, ValidatorFunction | ((params?: any) => ValidatorFunction)> = {
  [SchemaVariant.STRING]: validators.string,
  [SchemaVariant.URL]: validators.url,
  [SchemaVariant.EMAIL]: validators.email,
  [SchemaVariant.UUID]: validators.uuid,
  [SchemaVariant.IP]: validators.ip,
  [SchemaVariant.DATETIME]: validators.datetime,
  [SchemaVariant.NUMBER]: validators.number,
  [SchemaVariant.INTEGER]: validators.integer,
  [SchemaVariant.POSITIVE_NUMBER]: validators.positiveNumber,
  [SchemaVariant.NEGATIVE_NUMBER]: validators.negativeNumber,
  [SchemaVariant.BOOLEAN]: validators.boolean,
  [SchemaVariant.DATE]: validators.date,
  [SchemaVariant.MIN_LENGTH]: validators.minLength,
  [SchemaVariant.MAX_LENGTH]: validators.maxLength,
  [SchemaVariant.LENGTH]: validators.length,
  [SchemaVariant.REGEX]: validators.regex,
  [SchemaVariant.MIN_NUMBER]: validators.minNumber,
  [SchemaVariant.MAX_NUMBER]: validators.maxNumber,
  [SchemaVariant.ENUM]: validators.enum,
}

function validateEnv(
  schema: EnvValidatorSchema,
  env: Record<string, any>
): { success: true } | { success: false; errors: Array<{ path: string; message: string }> } {
  const errors: Array<{ path: string; message: string }> = []

  for (const [key, value] of Object.entries(schema)) {
    if (!(key in env) || env[key] === undefined || env[key] === null) {
      errors.push({
        path: key,
        message: 'Variable is required',
      })
      continue
    }
    
    const envValue = String(env[key])
    
    let validator: ValidatorFunction
    
    if (typeof value === 'string') {
      const validatorFn = validatorMap[value]
      if (!validatorFn) {
        throw new Error(`Unknown schema variant: ${value}`)
      }
      if (typeof validatorFn === 'function') {
        if (validatorFn.length === 1) {
          validator = validatorFn as ValidatorFunction
        } else {
          throw new Error(`Invalid validator for ${value}`)
        }
      } else {
        throw new Error(`Invalid validator for ${value}`)
      }
    } else if (typeof value === 'object' && value !== null && 'schema' in value) {
      const schemaVariant = value.schema as SchemaVariant
      const validatorFn = validatorMap[schemaVariant]
      if (!validatorFn) {
        throw new Error(`Unknown schema variant: ${schemaVariant}`)
      }
      validator = (validatorFn as (params?: any) => ValidatorFunction)(value.params)
    } else {
      throw new Error(`Invalid schema value for ${key}`)
    }

    const result = validator(envValue)
    
    if (!result.success) {
      errors.push({
        path: key,
        message: result.error || 'Validation failed',
      })
    }
  }

  return errors.length === 0 
    ? { success: true as const }
    : { success: false as const, errors }
}



export function envValidatorVite(options: EnvValidatorSchema): Plugin {
  return {
    name: 'env-validator',
    enforce: 'pre',

    configResolved(config) {
      const result = validateEnv(options, config.env)
      
      if (!result.success) {
        console.error('Environment variables validation error:')

        result.errors.forEach((err) => {
          console.error(`  - ${err.path}: ${err.message}`)
        })

        console.error('\nFound environment variables:')
        const foundKeys = Object.keys(config.env)
        if (foundKeys.length > 0) {
          foundKeys.forEach((key) => {
            console.error(`  - ${key}`)
          })
        } else {
          console.error('  (no variables found)')
        }

        console.error('\nPlease check your .env file')
        throw new Error('Invalid environment variables')
      }

      if (config.command === 'serve') {
        console.log('✓ All environment variables are valid\n')
      }
    },
  }
}
