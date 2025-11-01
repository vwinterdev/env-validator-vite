import { defineConfig } from 'vite'
import { envValidatorVite } from '../src/index'
import { SchemaVariant } from '../src/types'

export default defineConfig({
  plugins: [
    envValidatorVite({
      // Простые валидаторы
      VITE_API_URL: SchemaVariant.URL,
      VITE_EMAIL: SchemaVariant.EMAIL,
      VITE_USER_ID: SchemaVariant.UUID,
      VITE_SERVER_IP: SchemaVariant.IP,
      VITE_API_KEY: SchemaVariant.STRING,
      VITE_TIMEOUT: SchemaVariant.INTEGER,
      VITE_PORT: SchemaVariant.POSITIVE_NUMBER,
      VITE_DEBUG: SchemaVariant.BOOLEAN,
      VITE_BUILD_DATE: SchemaVariant.DATE,
      
      // Валидаторы с параметрами
      VITE_ENV: {
        schema: SchemaVariant.ENUM,
        params: ['development', 'production', 'staging'],
      },
      VITE_PASSWORD: {
        schema: SchemaVariant.MIN_LENGTH,
        params: 8,
      },
      VITE_API_TOKEN: {
        schema: SchemaVariant.MAX_LENGTH,
        params: 100,
      },
      VITE_VERSION: {
        schema: SchemaVariant.REGEX,
        params: /^v\d+\.\d+\.\d+$/,
      },
      VITE_PORT_RANGE: {
        schema: SchemaVariant.MIN_NUMBER,
        params: 1024,
      },
    }),
  ],
})
