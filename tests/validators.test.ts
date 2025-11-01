import { describe, it, expect } from 'vitest'
import { validators } from '../src/validators'

describe('validators', () => {
  describe('URL валидация', () => {
    it('должен валидировать валидный URL', () => {
      const result = validators.url('https://api.example.com')
      expect(result.success).toBe(true)
    })

    it('должен отклонять невалидный URL', () => {
      const result = validators.url('not-a-url')
      expect(result.success).toBe(false)
    })
  })

  describe('STRING валидация', () => {
    it('должен валидировать любую строку', () => {
      const result = validators.string('any-string')
      expect(result.success).toBe(true)
    })

    it('должен отклонять не-строку', () => {
      const result = validators.string(123 as any)
      expect(result.success).toBe(false)
    })
  })

  describe('NUMBER валидация', () => {
    it('должен преобразовывать строку в число', () => {
      const result = validators.number('123')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.value).toBe(123)
        expect(typeof result.value).toBe('number')
      }
    })

    it('должен отклонять невалидное число', () => {
      const result = validators.number('not-a-number')
      expect(result.success).toBe(false)
    })
  })

  describe('BOOLEAN валидация', () => {
    it('должен преобразовывать строку "true" в boolean', () => {
      const result = validators.boolean('true')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.value).toBe(true)
        expect(typeof result.value).toBe('boolean')
      }
    })

    it('должен преобразовывать строку "false" в boolean', () => {
      const result = validators.boolean('false')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.value).toBe(false)
        expect(typeof result.value).toBe('boolean')
      }
    })

    it('должен преобразовывать "1" в true', () => {
      const result = validators.boolean('1')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.value).toBe(true)
      }
    })

    it('должен преобразовывать "0" в false', () => {
      const result = validators.boolean('0')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.value).toBe(false)
      }
    })

    it('должен отклонять невалидное boolean значение', () => {
      const result = validators.boolean('maybe')
      expect(result.success).toBe(false)
    })
  })

  describe('ENUM валидация', () => {
    it('должен валидировать значение из списка', () => {
      const validator = validators.enum(['dev', 'prod', 'test'])
      const result = validator('dev')
      expect(result.success).toBe(true)
    })

    it('должен отклонять значение не из списка', () => {
      const validator = validators.enum(['dev', 'prod', 'test'])
      const result = validator('invalid')
      expect(result.success).toBe(false)
    })
  })

  describe('EMAIL валидация', () => {
    it('должен валидировать валидный email', () => {
      const result = validators.email('user@example.com')
      expect(result.success).toBe(true)
    })

    it('должен отклонять невалидный email', () => {
      const result = validators.email('not-an-email')
      expect(result.success).toBe(false)
    })
  })

  describe('UUID валидация', () => {
    it('должен валидировать валидный UUID', () => {
      const result = validators.uuid('550e8400-e29b-41d4-a716-446655440000')
      expect(result.success).toBe(true)
    })

    it('должен отклонять невалидный UUID', () => {
      const result = validators.uuid('not-a-uuid')
      expect(result.success).toBe(false)
    })
  })

  describe('IP валидация', () => {
    it('должен валидировать IPv4 адрес', () => {
      const result = validators.ip('192.168.1.1')
      expect(result.success).toBe(true)
    })

    it('должен валидировать IPv6 адрес', () => {
      const result = validators.ip('2001:0db8:85a3:0000:0000:8a2e:0370:7334')
      expect(result.success).toBe(true)
    })

    it('должен отклонять невалидный IP', () => {
      const result = validators.ip('999.999.999.999')
      expect(result.success).toBe(false)
    })
  })

  describe('DATETIME валидация', () => {
    it('должен валидировать ISO 8601 datetime', () => {
      const result = validators.datetime('2023-12-25T10:30:00Z')
      expect(result.success).toBe(true)
    })

    it('должен отклонять невалидный datetime', () => {
      const result = validators.datetime('2023-12-25')
      expect(result.success).toBe(false)
    })
  })

  describe('MIN_LENGTH валидация', () => {
    it('должен валидировать строку с достаточной длиной', () => {
      const validator = validators.minLength(5)
      const result = validator('hello')
      expect(result.success).toBe(true)
    })

    it('должен отклонять строку недостаточной длины', () => {
      const validator = validators.minLength(5)
      const result = validator('hi')
      expect(result.success).toBe(false)
    })
  })

  describe('MAX_LENGTH валидация', () => {
    it('должен валидировать строку с допустимой длиной', () => {
      const validator = validators.maxLength(5)
      const result = validator('hello')
      expect(result.success).toBe(true)
    })

    it('должен отклонять строку превышающую максимальную длину', () => {
      const validator = validators.maxLength(5)
      const result = validator('hello world')
      expect(result.success).toBe(false)
    })
  })

  describe('LENGTH валидация', () => {
    it('должен валидировать строку с точной длиной', () => {
      const validator = validators.length(5)
      const result = validator('hello')
      expect(result.success).toBe(true)
    })

    it('должен отклонять строку с другой длиной', () => {
      const validator = validators.length(5)
      const result = validator('hi')
      expect(result.success).toBe(false)
    })
  })

  describe('REGEX валидация', () => {
    it('должен валидировать строку по регулярному выражению (RegExp)', () => {
      const validator = validators.regex(/^[A-Z]+$/)
      const result = validator('HELLO')
      expect(result.success).toBe(true)
    })

    it('должен валидировать строку по регулярному выражению (string)', () => {
      const validator = validators.regex('^[0-9]+$')
      const result = validator('123')
      expect(result.success).toBe(true)
    })

    it('должен отклонять строку не соответствующую regex', () => {
      const validator = validators.regex(/^[A-Z]+$/)
      const result = validator('hello123')
      expect(result.success).toBe(false)
    })
  })

  describe('INTEGER валидация', () => {
    it('должен преобразовывать строку в целое число', () => {
      const result = validators.integer('123')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.value).toBe(123)
        expect(Number.isInteger(result.value)).toBe(true)
      }
    })

    it('должен отклонять дробное число', () => {
      const result = validators.integer('123.45')
      expect(result.success).toBe(false)
    })
  })

  describe('POSITIVE_NUMBER валидация', () => {
    it('должен валидировать положительное число', () => {
      const result = validators.positiveNumber('123')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.value).toBeGreaterThan(0)
      }
    })

    it('должен отклонять отрицательное число', () => {
      const result = validators.positiveNumber('-123')
      expect(result.success).toBe(false)
    })

    it('должен отклонять ноль', () => {
      const result = validators.positiveNumber('0')
      expect(result.success).toBe(false)
    })
  })

  describe('NEGATIVE_NUMBER валидация', () => {
    it('должен валидировать отрицательное число', () => {
      const result = validators.negativeNumber('-123')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.value).toBeLessThan(0)
      }
    })

    it('должен отклонять положительное число', () => {
      const result = validators.negativeNumber('123')
      expect(result.success).toBe(false)
    })

    it('должен отклонять ноль', () => {
      const result = validators.negativeNumber('0')
      expect(result.success).toBe(false)
    })
  })

  describe('MIN_NUMBER валидация', () => {
    it('должен валидировать число больше минимума', () => {
      const validator = validators.minNumber(10)
      const result = validator('15')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.value).toBeGreaterThanOrEqual(10)
      }
    })

    it('должен валидировать число равное минимуму', () => {
      const validator = validators.minNumber(10)
      const result = validator('10')
      expect(result.success).toBe(true)
    })

    it('должен отклонять число меньше минимума', () => {
      const validator = validators.minNumber(10)
      const result = validator('5')
      expect(result.success).toBe(false)
    })
  })

  describe('MAX_NUMBER валидация', () => {
    it('должен валидировать число меньше максимума', () => {
      const validator = validators.maxNumber(100)
      const result = validator('50')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.value).toBeLessThanOrEqual(100)
      }
    })

    it('должен валидировать число равное максимуму', () => {
      const validator = validators.maxNumber(100)
      const result = validator('100')
      expect(result.success).toBe(true)
    })

    it('должен отклонять число больше максимума', () => {
      const validator = validators.maxNumber(100)
      const result = validator('150')
      expect(result.success).toBe(false)
    })
  })

  describe('DATE валидация', () => {
    it('должен преобразовывать строку в Date', () => {
      const result = validators.date('2023-12-25')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.value).toBeInstanceOf(Date)
      }
    })

    it('должен преобразовывать ISO строку в Date', () => {
      const result = validators.date('2023-12-25T10:30:00Z')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.value).toBeInstanceOf(Date)
      }
    })

    it('должен отклонять невалидную дату', () => {
      const result = validators.date('invalid-date')
      expect(result.success).toBe(false)
    })
  })
})

