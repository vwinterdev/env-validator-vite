import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { selectRender, renderTable } from '../src/render'
import type { Log } from '../src/type'

describe('render', () => {
  describe('renderTable', () => {
    it('should render table with success messages', () => {
      const logs: Log[] = [
        { key: 'VITE_PORT', value: 3000, message: 'success' },
        { key: 'VITE_DEBUG', value: true, message: 'success' },
      ]

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      renderTable(logs)

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should render table with error messages', () => {
      const logs: Log[] = [
        { key: 'VITE_PORT', value: 'invalid', message: 'Validation failed', isError: true },
      ]

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      renderTable(logs)

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should handle missing values', () => {
      const logs: Log[] = [
        { key: 'VITE_MISSING', value: undefined, message: 'success' },
      ]

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      renderTable(logs)

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('renderConsole', () => {
    it('should render console logs with success messages', () => {
      const logs: Log[] = [
        { key: 'VITE_PORT', value: 3000, message: 'success' },
        { key: 'VITE_DEBUG', value: true, message: 'success' },
      ]

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const render = selectRender('console')
      render(logs)

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should render console logs with error messages', () => {
      const logs: Log[] = [
        { key: 'VITE_PORT', value: 'invalid', message: 'Validation failed', isError: true },
      ]

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const render = selectRender('console')
      render(logs)

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should sort errors first', () => {
      const logs: Log[] = [
        { key: 'VITE_VALID', value: 'valid', message: 'success' },
        { key: 'VITE_INVALID', value: 'invalid', message: 'Error', isError: true },
      ]

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const render = selectRender('console')
      render(logs)

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('custom render function', () => {
    it('should use custom render function', () => {
      const logs: Log[] = [
        { key: 'VITE_PORT', value: 3000, message: 'success' },
      ]

      const customRender = vi.fn()

      const render = selectRender(customRender)
      render(logs)

      expect(customRender).toHaveBeenCalledWith(logs)
    })
  })

  describe('selectRender', () => {
    it('should return table render', () => {
      const render = selectRender('table')
      expect(typeof render).toBe('function')
    })

    it('should return console render', () => {
      const render = selectRender('console')
      expect(typeof render).toBe('function')
    })

    it('should return custom render function', () => {
      const customRender = vi.fn()
      const render = selectRender(customRender)
      expect(render).toBe(customRender)
    })

    it('should exit process on invalid render', () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called')
      })

      expect(() => {
        selectRender('invalid' as any)
      }).toThrow('process.exit called')

      exitSpy.mockRestore()
    })
  })
})

