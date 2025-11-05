import { describe, it, expect, vi } from 'vitest'
import { schema } from '@poppinss/validator-lite'
import { z } from 'zod'
import { selectValidator } from '../src/validators'
import type { Schema } from '../src/type'

describe('validators', () => {
  describe('default validator', () => {
    it('should validate string values', async () => {
      const envSchema: Schema = {
        VITE_API_KEY: schema.string(),
      }
      const envConfig = {
        VITE_API_KEY: 'secret-key',
      }

      const validator = selectValidator('default')
      const result = await validator(envSchema, envConfig)

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        key: 'VITE_API_KEY',
        value: 'secret-key',
        message: 'success',
      })
      expect(result[0].isError).toBeUndefined()
    })

    it('should validate number values', async () => {
      const envSchema: Schema = {
        VITE_PORT: schema.number(),
      }
      const envConfig = {
        VITE_PORT: '3000',
      }

      const validator = selectValidator('default')
      const result = await validator(envSchema, envConfig)

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        key: 'VITE_PORT',
        value: 3000,
        message: 'success',
      })
    })

    it('should validate boolean values', async () => {
      const envSchema: Schema = {
        VITE_DEBUG: schema.boolean(),
      }
      const envConfig = {
        VITE_DEBUG: 'true',
      }

      const validator = selectValidator('default')
      const result = await validator(envSchema, envConfig)

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        key: 'VITE_DEBUG',
        value: true,
        message: 'success',
      })
    })

    it('should validate URL format', async () => {
      const envSchema: Schema = {
        VITE_API_URL: schema.string({ format: 'url' }),
      }
      const envConfig = {
        VITE_API_URL: 'https://api.example.com',
      }

      const validator = selectValidator('default')
      const result = await validator(envSchema, envConfig)

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        key: 'VITE_API_URL',
        value: 'https://api.example.com',
        message: 'success',
      })
    })

    it('should validate email format', async () => {
      const envSchema: Schema = {
        VITE_EMAIL: schema.string({ format: 'email' }),
      }
      const envConfig = {
        VITE_EMAIL: 'test@example.com',
      }

      const validator = selectValidator('default')
      const result = await validator(envSchema, envConfig)

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        key: 'VITE_EMAIL',
        value: 'test@example.com',
        message: 'success',
      })
    })

    it('should handle validation errors', async () => {
      const envSchema: Schema = {
        VITE_PORT: schema.number(),
      }
      const envConfig = {
        VITE_PORT: 'not-a-number',
      }

      const validator = selectValidator('default')
      const result = await validator(envSchema, envConfig)

      expect(result).toHaveLength(1)
      expect(result[0].isError).toBe(true)
      expect(result[0].message).toBeTruthy()
    })

    it('should handle missing values', async () => {
      const envSchema: Schema = {
        VITE_PORT: schema.number(),
      }
      const envConfig: Record<string, string> = {}

      const validator = selectValidator('default')
      const result = await validator(envSchema, envConfig)

      expect(result).toHaveLength(1)
      expect(result[0].isError).toBe(true)
    })

    it('should handle optional values', async () => {
      const envSchema: Schema = {
        VITE_OPTIONAL: schema.string.optional(),
      }
      const envConfig: Record<string, string> = {}

      const validator = selectValidator('default')
      const result = await validator(envSchema, envConfig)

      expect(result).toHaveLength(0)
    })

    it('should validate multiple variables', async () => {
      const envSchema: Schema = {
        VITE_API_URL: schema.string({ format: 'url' }),
        VITE_PORT: schema.number(),
        VITE_DEBUG: schema.boolean(),
      }
      const envConfig = {
        VITE_API_URL: 'https://api.example.com',
        VITE_PORT: '3000',
        VITE_DEBUG: 'true',
      }

      const validator = selectValidator('default')
      const result = await validator(envSchema, envConfig)

      expect(result).toHaveLength(3)
      expect(result.every((r) => r.message === 'success')).toBe(true)
    })
  })

  describe('zod validator', () => {
    it('should validate string values', async () => {
      const envSchema: Schema = {
        VITE_API_KEY: z.string(),
      }
      const envConfig = {
        VITE_API_KEY: 'secret-key',
      }

      const validator = selectValidator('zod')
      const result = await validator(envSchema, envConfig)

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        key: 'VITE_API_KEY',
        value: 'secret-key',
        message: 'success',
      })
    })

    it('should validate number values with coerce', async () => {
      const envSchema: Schema = {
        VITE_PORT: z.coerce.number(),
      }
      const envConfig = {
        VITE_PORT: '3000',
      }

      const validator = selectValidator('zod')
      const result = await validator(envSchema, envConfig)

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        key: 'VITE_PORT',
        value: 3000,
        message: 'success',
      })
    })

    it('should validate boolean values with coerce', async () => {
      const envSchema: Schema = {
        VITE_DEBUG: z.coerce.boolean(),
      }
      const envConfig = {
        VITE_DEBUG: 'true',
      }

      const validator = selectValidator('zod')
      const result = await validator(envSchema, envConfig)

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        key: 'VITE_DEBUG',
        value: true,
        message: 'success',
      })
    })

    it('should validate URL format', async () => {
      const envSchema: Schema = {
        VITE_API_URL: z.string().url(),
      }
      const envConfig = {
        VITE_API_URL: 'https://api.example.com',
      }

      const validator = selectValidator('zod')
      const result = await validator(envSchema, envConfig)

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        key: 'VITE_API_URL',
        value: 'https://api.example.com',
        message: 'success',
      })
    })

    it('should handle validation errors', async () => {
      const envSchema: Schema = {
        VITE_PORT: z.coerce.number(),
      }
      const envConfig = {
        VITE_PORT: 'not-a-number',
      }

      const validator = selectValidator('zod')
      const result = await validator(envSchema, envConfig)

      expect(result).toHaveLength(1)
      expect(result[0].isError).toBe(true)
      expect(result[0].message).toContain('VITE_PORT')
    })

    it('should handle missing values', async () => {
      const envSchema: Schema = {
        VITE_PORT: z.coerce.number(),
      }
      const envConfig: Record<string, string> = {}

      const validator = selectValidator('zod')
      const result = await validator(envSchema, envConfig)

      expect(result).toHaveLength(1)
      expect(result[0].isError).toBe(true)
    })

    it('should handle optional values', async () => {
      const envSchema: Schema = {
        VITE_OPTIONAL: z.string().optional(),
      }
      const envConfig: Record<string, string> = {}

      const validator = selectValidator('zod')
      const result = await validator(envSchema, envConfig)

      expect(result).toHaveLength(1)
      expect(result[0].message).toBe('success')
    })

    it('should validate multiple variables', async () => {
      const envSchema: Schema = {
        VITE_API_URL: z.string().url(),
        VITE_PORT: z.coerce.number(),
        VITE_DEBUG: z.coerce.boolean(),
      }
      const envConfig = {
        VITE_API_URL: 'https://api.example.com',
        VITE_PORT: '3000',
        VITE_DEBUG: 'true',
      }

      const validator = selectValidator('zod')
      const result = await validator(envSchema, envConfig)

      expect(result).toHaveLength(3)
      expect(result.every((r) => r.message === 'success')).toBe(true)
    })
  })

  describe('selectValidator', () => {
    it('should return default validator', () => {
      const validator = selectValidator('default')
      expect(typeof validator).toBe('function')
    })

    it('should return zod validator', () => {
      const validator = selectValidator('zod')
      expect(typeof validator).toBe('function')
    })

    it('should exit process on invalid validator', () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called')
      })

      expect(() => {
        selectValidator('invalid' as any)
      }).toThrow('process.exit called')

      exitSpy.mockRestore()
    })
  })
})

