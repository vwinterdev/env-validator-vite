# env-validator-vite

Vite plugin for validating environment variables using a simple schema definition.

## Installation

```bash
npm install @vwinterdev/env-validator-vite
# or
pnpm add @vwinterdev/env-validator-vite
# or
yarn add @vwinterdev/env-validator-vite
```

**Note:** This plugin uses lightweight built-in validators with zero external dependencies (except Vite).

## Usage

### Basic Example

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { envValidatorVite, SchemaVariant } from '@vwinterdev/env-validator-vite'

export default defineConfig({
  plugins: [
    envValidatorVite({
      VITE_API_URL: SchemaVariant.URL,
      VITE_API_KEY: SchemaVariant.STRING,
      VITE_TIMEOUT: SchemaVariant.NUMBER,
      VITE_DEBUG: SchemaVariant.BOOLEAN,
    }),
  ],
})
```

### Advanced Example

```ts
import { defineConfig } from 'vite'
import { envValidatorVite, SchemaVariant } from '@vwinterdev/env-validator-vite'

export default defineConfig({
  plugins: [
    envValidatorVite({
      // String validators
      VITE_API_URL: SchemaVariant.URL,
      VITE_EMAIL: SchemaVariant.EMAIL,
      VITE_USER_ID: SchemaVariant.UUID,
      VITE_SERVER_IP: SchemaVariant.IP,
      VITE_API_KEY: SchemaVariant.STRING,
      VITE_BUILD_TIME: SchemaVariant.DATETIME,
      
      // Number validators
      VITE_TIMEOUT: SchemaVariant.INTEGER,
      VITE_PORT: SchemaVariant.POSITIVE_NUMBER,
      
      // Other validators
      VITE_DEBUG: SchemaVariant.BOOLEAN,
      VITE_BUILD_DATE: SchemaVariant.DATE,
      
      // Validators with parameters
      VITE_ENV: {
        schema: SchemaVariant.ENUM,
        params: ['development', 'production', 'staging'],
      },
      VITE_PASSWORD: {
        schema: SchemaVariant.MIN_LENGTH,
        params: 8,
      },
      VITE_VERSION: {
        schema: SchemaVariant.REGEX,
        params: /^v\d+\.\d+\.\d+$/,
      },
      VITE_PORT: {
        schema: SchemaVariant.MIN_NUMBER,
        params: 1024,
      },
    }),
  ],
})
```

## API

### `envValidatorVite(schema)`

#### Schema Types

##### String Validators (no params)
- **`SchemaVariant.STRING`** - Validates that the value is a string
- **`SchemaVariant.URL`** - Validates that the value is a valid URL
- **`SchemaVariant.EMAIL`** - Validates that the value is a valid email address
- **`SchemaVariant.UUID`** - Validates that the value is a valid UUID
- **`SchemaVariant.IP`** - Validates that the value is a valid IP address (IPv4 or IPv6)
- **`SchemaVariant.DATETIME`** - Validates that the value is a valid ISO 8601 datetime string

##### String Validators (with params)
- **`SchemaVariant.MIN_LENGTH`** - Validates minimum string length
  ```ts
  { schema: SchemaVariant.MIN_LENGTH, params: 8 }
  ```
- **`SchemaVariant.MAX_LENGTH`** - Validates maximum string length
  ```ts
  { schema: SchemaVariant.MAX_LENGTH, params: 100 }
  ```
- **`SchemaVariant.LENGTH`** - Validates exact string length
  ```ts
  { schema: SchemaVariant.LENGTH, params: 16 }
  ```
- **`SchemaVariant.REGEX`** - Validates against a regular expression
  ```ts
  { schema: SchemaVariant.REGEX, params: /^[A-Z]+$/ }
  // or
  { schema: SchemaVariant.REGEX, params: '^[A-Z]+$' }
  ```

##### Number Validators (no params)
- **`SchemaVariant.NUMBER`** - Validates and coerces the value to a number
- **`SchemaVariant.INTEGER`** - Validates and coerces to an integer
- **`SchemaVariant.POSITIVE_NUMBER`** - Validates a positive number
- **`SchemaVariant.NEGATIVE_NUMBER`** - Validates a negative number

##### Number Validators (with params)
- **`SchemaVariant.MIN_NUMBER`** - Validates minimum number value
  ```ts
  { schema: SchemaVariant.MIN_NUMBER, params: 0 }
  ```
- **`SchemaVariant.MAX_NUMBER`** - Validates maximum number value
  ```ts
  { schema: SchemaVariant.MAX_NUMBER, params: 65535 }
  ```

##### Other Validators
- **`SchemaVariant.BOOLEAN`** - Validates and coerces the value to a boolean
- **`SchemaVariant.DATE`** - Validates and coerces to a Date object
- **`SchemaVariant.ENUM`** - Validates that the value is one of the provided options
  ```ts
  { schema: SchemaVariant.ENUM, params: ['option1', 'option2'] }
  ```

## How It Works

The plugin validates all environment variables that start with `VITE_` prefix (which is the standard for Vite). The validation happens during the `configResolved` hook, before the build process continues.

If validation fails, the plugin will:
- Print detailed error messages showing which variables failed and why
- List all found environment variables
- Throw an error to stop the build (unless configured otherwise)

## License

MIT
