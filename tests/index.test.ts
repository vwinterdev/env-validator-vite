import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { ResolvedConfig } from 'vite'
import { envValidatorVite } from '../src/index'
import { SchemaVariant } from '../src/types'

describe('envValidatorVite', () => {
  const originalConsoleError = console.error
  const originalConsoleLog = console.log

  beforeEach(() => {
    // Мокаем console методы для тестов
    console.error = vi.fn()
    console.log = vi.fn()
  })

  afterEach(() => {
    // Восстанавливаем оригинальные методы
    console.error = originalConsoleError
    console.log = originalConsoleLog
  })

  describe('успешная валидация', () => {
    it('должен валидировать STRING переменные', () => {
      const plugin = envValidatorVite({
        VITE_API_KEY: SchemaVariant.STRING,
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_API_KEY: 'secret-key',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).not.toThrow()

      expect(console.log).toHaveBeenCalledWith('✓ All environment variables are valid\n')
    })

    it('должен валидировать URL переменные', () => {
      const plugin = envValidatorVite({
        VITE_API_URL: SchemaVariant.URL,
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_API_URL: 'https://api.example.com',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).not.toThrow()
    })

    it('должен валидировать NUMBER переменные', () => {
      const plugin = envValidatorVite({
        VITE_TIMEOUT: SchemaVariant.NUMBER,
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_TIMEOUT: '5000',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).not.toThrow()
    })

    it('должен валидировать BOOLEAN переменные', () => {
      const plugin = envValidatorVite({
        VITE_DEBUG: SchemaVariant.BOOLEAN,
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_DEBUG: 'true',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).not.toThrow()
    })

    it('должен валидировать ENUM переменные', () => {
      const plugin = envValidatorVite({
        VITE_ENV: {
          schema: SchemaVariant.ENUM,
          params: ['development', 'production', 'staging'],
        },
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_ENV: 'development',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).not.toThrow()
    })

    it('должен валидировать несколько переменных одновременно', () => {
      const plugin = envValidatorVite({
        VITE_API_URL: SchemaVariant.URL,
        VITE_API_KEY: SchemaVariant.STRING,
        VITE_TIMEOUT: SchemaVariant.NUMBER,
        VITE_DEBUG: SchemaVariant.BOOLEAN,
        VITE_ENV: {
          schema: SchemaVariant.ENUM,
          params: ['development', 'production'],
        },
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_API_URL: 'https://api.example.com',
          VITE_API_KEY: 'secret-key',
          VITE_TIMEOUT: '5000',
          VITE_DEBUG: 'true',
          VITE_ENV: 'production',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).not.toThrow()
    })

    it('не должен логировать при команде build', () => {
      const plugin = envValidatorVite({
        VITE_API_KEY: SchemaVariant.STRING,
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'build',
        env: {
          VITE_API_KEY: 'secret-key',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).not.toThrow()

      expect(console.log).not.toHaveBeenCalled()
    })

    it('должен валидировать EMAIL переменные', () => {
      const plugin = envValidatorVite({
        VITE_EMAIL: SchemaVariant.EMAIL,
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_EMAIL: 'user@example.com',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).not.toThrow()
    })

    it('должен валидировать UUID переменные', () => {
      const plugin = envValidatorVite({
        VITE_USER_ID: SchemaVariant.UUID,
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_USER_ID: '550e8400-e29b-41d4-a716-446655440000',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).not.toThrow()
    })

    it('должен валидировать IP переменные', () => {
      const plugin = envValidatorVite({
        VITE_SERVER_IP: SchemaVariant.IP,
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_SERVER_IP: '192.168.1.1',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).not.toThrow()
    })

    it('должен валидировать INTEGER переменные', () => {
      const plugin = envValidatorVite({
        VITE_PORT: SchemaVariant.INTEGER,
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_PORT: '3000',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).not.toThrow()
    })

    it('должен валидировать POSITIVE_NUMBER переменные', () => {
      const plugin = envValidatorVite({
        VITE_TIMEOUT: SchemaVariant.POSITIVE_NUMBER,
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_TIMEOUT: '5000',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).not.toThrow()
    })

    it('должен валидировать DATE переменные', () => {
      const plugin = envValidatorVite({
        VITE_BUILD_DATE: SchemaVariant.DATE,
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_BUILD_DATE: '2023-12-25',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).not.toThrow()
    })

    it('должен валидировать MIN_LENGTH переменные', () => {
      const plugin = envValidatorVite({
        VITE_PASSWORD: {
          schema: SchemaVariant.MIN_LENGTH,
          params: 8,
        },
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_PASSWORD: 'password123',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).not.toThrow()
    })

    it('должен валидировать REGEX переменные', () => {
      const plugin = envValidatorVite({
        VITE_VERSION: {
          schema: SchemaVariant.REGEX,
          params: /^v\d+\.\d+\.\d+$/,
        },
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_VERSION: 'v1.2.3',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).not.toThrow()
    })

    it('должен валидировать MIN_NUMBER переменные', () => {
      const plugin = envValidatorVite({
        VITE_PORT: {
          schema: SchemaVariant.MIN_NUMBER,
          params: 1024,
        },
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_PORT: '3000',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).not.toThrow()
    })

    it('должен валидировать MAX_NUMBER переменные', () => {
      const plugin = envValidatorVite({
        VITE_PORT: {
          schema: SchemaVariant.MAX_NUMBER,
          params: 65535,
        },
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_PORT: '3000',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).not.toThrow()
    })
  })

  describe('ошибки валидации', () => {
    it('должен выбрасывать ошибку при отсутствии обязательной переменной', () => {
      const plugin = envValidatorVite({
        VITE_API_KEY: SchemaVariant.STRING,
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {},
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).toThrow('Invalid environment variables')

      expect(console.error).toHaveBeenCalled()
    })

    it('должен выбрасывать ошибку при невалидном URL', () => {
      const plugin = envValidatorVite({
        VITE_API_URL: SchemaVariant.URL,
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_API_URL: 'not-a-url',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).toThrow('Invalid environment variables')

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Environment variables validation error:'),
      )
    })

    it('должен выбрасывать ошибку при невалидном NUMBER', () => {
      const plugin = envValidatorVite({
        VITE_TIMEOUT: SchemaVariant.NUMBER,
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_TIMEOUT: 'not-a-number',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).toThrow('Invalid environment variables')
    })

    it('должен выбрасывать ошибку при невалидном ENUM значении', () => {
      const plugin = envValidatorVite({
        VITE_ENV: {
          schema: SchemaVariant.ENUM,
          params: ['development', 'production'],
        },
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_ENV: 'invalid-value',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).toThrow('Invalid environment variables')
    })

    it('должен показывать найденные переменные окружения при ошибке', () => {
      const plugin = envValidatorVite({
        VITE_API_KEY: SchemaVariant.STRING,
        VITE_API_URL: SchemaVariant.URL,
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {
          VITE_API_KEY: 'secret',
          VITE_API_URL: 'invalid-url',
        },
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).toThrow('Invalid environment variables')

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Found environment variables:'),
      )
    })

    it('должен показывать сообщение об отсутствии переменных', () => {
      const plugin = envValidatorVite({
        VITE_API_KEY: SchemaVariant.STRING,
      })

      const mockConfig: Partial<ResolvedConfig> = {
        command: 'serve',
        env: {},
      }

      expect(() => {
        const hook = plugin.configResolved
        if (typeof hook === 'function') {
          hook(mockConfig as ResolvedConfig)
        } else if (hook?.handler) {
          hook.handler(mockConfig as ResolvedConfig)
        }
      }).toThrow('Invalid environment variables')

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('(no variables found)'),
      )
    })
  })

  describe('метаданные плагина', () => {
    it('должен иметь правильное имя', () => {
      const plugin = envValidatorVite({
        VITE_API_KEY: SchemaVariant.STRING,
      })

      expect(plugin.name).toBe('env-validator')
    })

    it('должен иметь enforce: pre', () => {
      const plugin = envValidatorVite({
        VITE_API_KEY: SchemaVariant.STRING,
      })

      expect(plugin.enforce).toBe('pre')
    })
  })
})

