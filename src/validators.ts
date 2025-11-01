export interface ValidationResult {
  success: boolean
  error?: string
  value?: any
}

export type Validator = (value: string) => ValidationResult

const URL_REGEX = /^https?:\/\/.+/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const IPV4_REGEX = /^(\d{1,3}\.){3}\d{1,3}$/
const DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/
export const validators = {
  string: (value: string): ValidationResult => {
    const isValid = typeof value === 'string' && value.trim() !== ''
    return {
      success: isValid,
      error: isValid ? undefined : 'Must be a non-empty string',
      value,
    }
  },

  url: (value: string): ValidationResult => {
    try {
      new URL(value)
      return { success: true, value }
    } catch {
      return { success: false, error: 'Invalid URL' }
    }
  },

  email: (value: string): ValidationResult => {
    const isValid = EMAIL_REGEX.test(value)
    return {
      success: isValid,
      error: isValid ? undefined : 'Invalid email',
      value,
    }
  },

  uuid: (value: string): ValidationResult => {
    const isValid = UUID_REGEX.test(value)
    return {
      success: isValid,
      error: isValid ? undefined : 'Invalid UUID',
      value,
    }
  },

  ip: (value: string): ValidationResult => {
    if (IPV4_REGEX.test(value)) {
      const parts = value.split('.')
      if (parts.length === 4) {
        const isValid = parts.every(part => {
          const num = parseInt(part, 10)
          return !isNaN(num) && num >= 0 && num <= 255 && String(num) === part.trim()
        })
        return {
          success: isValid,
          error: isValid ? undefined : 'Invalid IPv4 address',
          value,
        }
      }
    }
    
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/
    const isValid = ipv6Regex.test(value)
    return {
      success: isValid,
      error: isValid ? undefined : 'Invalid IP address',
      value,
    }
  },

  datetime: (value: string): ValidationResult => {
    const isValid = DATETIME_REGEX.test(value) && !isNaN(Date.parse(value))
    return {
      success: isValid,
      error: isValid ? undefined : 'Invalid datetime (ISO 8601)',
      value,
    }
  },

  number: (value: string): ValidationResult => {
    const num = Number(value)
    const isValid = !isNaN(num) && isFinite(num) && value.trim() !== ''
    return {
      success: isValid,
      error: isValid ? undefined : 'Invalid number',
      value: isValid ? num : undefined,
    }
  },

  integer: (value: string): ValidationResult => {
    const num = Number(value)
    const isValid = !isNaN(num) && isFinite(num) && Number.isInteger(num) && value.trim() !== ''
    return {
      success: isValid,
      error: isValid ? undefined : 'Invalid integer',
      value: isValid ? num : undefined,
    }
  },

  positiveNumber: (value: string): ValidationResult => {
    const num = Number(value)
    const isValid = !isNaN(num) && isFinite(num) && num > 0
    return {
      success: isValid,
      error: isValid ? undefined : 'Must be a positive number',
      value: isValid ? num : undefined,
    }
  },

  negativeNumber: (value: string): ValidationResult => {
    const num = Number(value)
    const isValid = !isNaN(num) && isFinite(num) && num < 0
    return {
      success: isValid,
      error: isValid ? undefined : 'Must be a negative number',
      value: isValid ? num : undefined,
    }
  },

  boolean: (value: string): ValidationResult => {
    const lower = value.toLowerCase().trim()
    if (lower === 'true' || lower === '1') {
      return { success: true, value: true }
    }
    if (lower === 'false' || lower === '0' || value === '') {
      return { success: true, value: false }
    }
    return {
      success: false,
      error: 'Invalid boolean (use "true", "false", "1", or "0")',
    }
  },

  date: (value: string): ValidationResult => {
    const date = new Date(value)
    const isValid = !isNaN(date.getTime())
    return {
      success: isValid,
      error: isValid ? undefined : 'Invalid date',
      value: isValid ? date : undefined,
    }
  },

  minLength: (min: number) => (value: string): ValidationResult => ({
    success: value.length >= min,
    error: value.length < min ? `Must be at least ${min} characters` : undefined,
    value,
  }),

  maxLength: (max: number) => (value: string): ValidationResult => ({
    success: value.length <= max,
    error: value.length > max ? `Must be at most ${max} characters` : undefined,
    value,
  }),

  length: (len: number) => (value: string): ValidationResult => ({
    success: value.length === len,
    error: value.length !== len ? `Must be exactly ${len} characters` : undefined,
    value,
  }),

  regex: (pattern: RegExp | string) => (value: string): ValidationResult => {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern
    const isValid = regex.test(value)
    return {
      success: isValid,
      error: isValid ? undefined : 'Value does not match pattern',
      value,
    }
  },

  minNumber: (min: number) => (value: string): ValidationResult => {
    const num = Number(value)
    const isValid = !isNaN(num) && isFinite(num) && num >= min
    return {
      success: isValid,
      error: isValid ? undefined : `Must be at least ${min}`,
      value: isValid ? num : undefined,
    }
  },

  maxNumber: (max: number) => (value: string): ValidationResult => {
    const num = Number(value)
    const isValid = !isNaN(num) && isFinite(num) && num <= max
    return {
      success: isValid,
      error: isValid ? undefined : `Must be at most ${max}`,
      value: isValid ? num : undefined,
    }
  },

  enum: (options: string[]) => (value: string): ValidationResult => {
    const isValid = options.includes(value)
    return {
      success: isValid,
      error: isValid ? undefined : `Must be one of: ${options.join(', ')}`,
      value,
    }
  },
}

