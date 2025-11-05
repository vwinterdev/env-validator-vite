import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Plugin } from 'vite'
import ValidateEnv, { Schema } from '../src/index'
import { schema } from '@poppinss/validator-lite'
import { z } from 'zod'

describe('ValidateEnv plugin', () => {
  const mockConfig = {
    env: {
      VITE_PORT: '3000',
      VITE_DEBUG: 'true',
      VITE_API_URL: 'https://api.example.com',
    },
    root: process.cwd(),
    envDir: '.',
    envPrefix: 'VITE_',
    mode: 'development',
    command: 'serve',
  }

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should create a Vite plugin', () => {
    const plugin = ValidateEnv({
      schema: {
        VITE_PORT: Schema.number(),
      },
    })

    expect(plugin).toBeDefined()
    expect(plugin.name).toBe('env-validator')
    expect(plugin.enforce).toBe('pre')
  })

  it('should validate with default validator', async () => {
    const plugin = ValidateEnv({
      schema: {
        VITE_PORT: Schema.number(),
        VITE_DEBUG: Schema.boolean(),
      },
    })

    expect(plugin.configResolved).toBeDefined()
    await expect(plugin.configResolved!(mockConfig as any)).resolves.not.toThrow()
  })

  it('should validate with zod validator', async () => {
    const plugin = ValidateEnv({
      validator: 'zod',
      schema: {
        VITE_PORT: z.coerce.number(),
        VITE_DEBUG: z.coerce.boolean(),
      },
    })

    expect(plugin.configResolved).toBeDefined()
    await expect(plugin.configResolved!(mockConfig as any)).resolves.not.toThrow()
  })

  it('should use table render by default', async () => {
    const plugin = ValidateEnv({
      schema: {
        VITE_PORT: Schema.number(),
      },
    })

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    await plugin.configResolved!(mockConfig as any)

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should use console render when specified', async () => {
    const plugin = ValidateEnv({
      schema: {
        VITE_PORT: Schema.number(),
      },
      render: 'console',
    })

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    await plugin.configResolved!(mockConfig as any)

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should use custom render function', async () => {
    const customRender = vi.fn()

    const plugin = ValidateEnv({
      schema: {
        VITE_PORT: Schema.number(),
      },
      render: customRender,
    })

    await plugin.configResolved!(mockConfig as any)

    expect(customRender).toHaveBeenCalled()
    expect(Array.isArray(customRender.mock.calls[0][0])).toBe(true)
  })

  it('should handle validation errors gracefully', async () => {
    const plugin = ValidateEnv({
      schema: {
        VITE_INVALID: Schema.number(),
      },
    })

    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    await plugin.configResolved!({
      ...mockConfig,
      env: {
        VITE_PORT: '3000',
      },
    } as any)

    expect(consoleLogSpy).toHaveBeenCalled()
    consoleLogSpy.mockRestore()
  })

  it('should export Schema from @poppinss/validator-lite', () => {
    expect(Schema).toBeDefined()
    expect(Schema.string).toBeDefined()
    expect(Schema.number).toBeDefined()
    expect(Schema.boolean).toBeDefined()
  })

  it('should validate multiple environment variables', async () => {
    const plugin = ValidateEnv({
      schema: {
        VITE_PORT: Schema.number(),
        VITE_DEBUG: Schema.boolean(),
        VITE_API_URL: Schema.string({ format: 'url' }),
      },
    })

    await expect(plugin.configResolved!(mockConfig as any)).resolves.not.toThrow()
  })

  it('should handle optional values', async () => {
    const plugin = ValidateEnv({
      schema: {
        VITE_PORT: Schema.number(),
        VITE_OPTIONAL: Schema.string.optional(),
      },
    })

    await expect(plugin.configResolved!({
      ...mockConfig,
      env: {
        VITE_PORT: '3000',
      },
    } as any)).resolves.not.toThrow()
  })
})

