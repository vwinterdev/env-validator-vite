export enum SchemaVariant {
  STRING = 'string',
  URL = 'url',
  EMAIL = 'email',
  UUID = 'uuid',
  IP = 'ip',
  DATETIME = 'datetime',
  MIN_LENGTH = 'minLength',
  MAX_LENGTH = 'maxLength',
  LENGTH = 'length',
  REGEX = 'regex',
  NUMBER = 'number',
  INTEGER = 'integer',
  POSITIVE_NUMBER = 'positiveNumber',
  NEGATIVE_NUMBER = 'negativeNumber',
  MIN_NUMBER = 'minNumber',
  MAX_NUMBER = 'maxNumber',
  BOOLEAN = 'boolean',
  DATE = 'date',
  ENUM = 'enum',
}

export interface EnvValidatorSchemaValue {
  schema: SchemaVariant
  params?: string[] | number | boolean | string | RegExp
}

export interface EnvValidatorSchema extends Record<string, SchemaVariant | EnvValidatorSchemaValue> {}

