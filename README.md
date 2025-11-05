# @vwinterdev/env-validator-vite

Vite plugin for validating environment variables with support for multiple validators and customizable rendering.

## Installation

```bash
npm install @vwinterdev/env-validator-vite
# or
pnpm add @vwinterdev/env-validator-vite
# or
yarn add @vwinterdev/env-validator-vite
```

**Note:** If you want to use the `zod` validator, you also need to install `zod`:

```bash
npm install zod
# or
pnpm add zod
# or
yarn add zod
```

## Features

- ✅ Support for multiple validators: `@poppinss/validator-lite` (default) and `zod`
- ✅ Customizable rendering: table view, console logs, or custom render function
- ✅ Automatic type conversion from strings (numbers, booleans, etc.)
- ✅ Beautiful error messages with detailed validation feedback

## Basic Usage

### Using Default Validator (Recommended)

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import ValidateEnv, { Schema } from '@vwinterdev/env-validator-vite'

export default defineConfig({
  plugins: [
    ValidateEnv({
      schema: {
        VITE_API_URL: Schema.string({ format: 'url' }),
        VITE_PORT: Schema.number(),
        VITE_DEBUG: Schema.boolean(),
        VITE_API_KEY: Schema.string(),
      },
    }),
  ],
})
```

### Using Zod Validator

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import ValidateEnv from '@vwinterdev/env-validator-vite'
import { z } from 'zod'

export default defineConfig({
  plugins: [
    ValidateEnv({
      validator: 'zod',
      schema: {
        VITE_API_URL: z.string().url(),
        VITE_PORT: z.coerce.number(),
        VITE_DEBUG: z.coerce.boolean(),
        VITE_API_KEY: z.string().min(10),
      },
    }),
  ],
})
```

## API Reference

### `ValidateEnv(options)`

Main plugin function that validates environment variables.

#### Options

```ts
interface ValidatorOptions {
  validator?: 'default' | 'zod'  // Default: 'default'
  schema: Schema                  // Required: validation schema
  render?: 'table' | 'console' | ((logs: Log[]) => void)  // Default: 'table'
}
```

#### Parameters

- **`validator`** (optional): Type of validator to use
  - `'default'`: Uses `@poppinss/validator-lite` (recommended, no dependencies)
  - `'zod'`: Uses Zod library (requires `zod` to be installed)

- **`schema`** (required): Validation schema object
  - For `'default'` validator: Use `Schema` from the package
  - For `'zod'` validator: Use Zod schemas

- **`render`** (optional): How to display validation results
  - `'table'`: Beautiful table view (default)
  - `'console'`: Console logs with colors
  - Custom function: `(logs: Log[]) => void`

## Schema Examples

### Default Validator (`@poppinss/validator-lite`)

```ts
import { Schema } from '@vwinterdev/env-validator-vite'

const schema = {
  // String validators
  VITE_API_URL: Schema.string({ format: 'url' }),
  VITE_EMAIL: Schema.string({ format: 'email' }),
  VITE_UUID: Schema.string({ format: 'uuid' }),
  VITE_HOST: Schema.string({ format: 'host' }),
  VITE_API_KEY: Schema.string(),
  
  // Optional string
  VITE_OPTIONAL_KEY: Schema.string.optional(),
  
  // Number validators (automatically converts strings to numbers)
  VITE_PORT: Schema.number(),
  VITE_TIMEOUT: Schema.number(),
  VITE_OPTIONAL_PORT: Schema.number.optional(),
  
  // Boolean validators (automatically converts 'true'/'1' → true, 'false'/'0' → false)
  VITE_DEBUG: Schema.boolean(),
  VITE_CACHE: Schema.boolean(),
  VITE_OPTIONAL_FLAG: Schema.boolean.optional(),
  
  // Enum validators
  VITE_ENV: Schema.enum(['development', 'production', 'staging'] as const),
  VITE_LOG_LEVEL: Schema.enum(['debug', 'info', 'warn', 'error'] as const),
}
```

### Zod Validator

```ts
import { z } from 'zod'

const schema = {
  // Use z.coerce.* for automatic type conversion from strings
  VITE_PORT: z.coerce.number(),
  VITE_DEBUG: z.coerce.boolean(),
  VITE_TIMEOUT: z.coerce.number().min(0).max(10000),
  
  // String validators
  VITE_API_URL: z.string().url(),
  VITE_EMAIL: z.string().email(),
  VITE_API_KEY: z.string().min(10),
  
  // Optional values
  VITE_OPTIONAL: z.string().optional(),
  
  // Enum
  VITE_ENV: z.enum(['development', 'production', 'staging']),
  
  // Custom validation
  VITE_CUSTOM: z.string().refine((val) => val.startsWith('prefix_'), {
    message: 'Must start with prefix_',
  }),
}
```

## Rendering Options

### Table Render (Default)

Displays a beautiful table with validation results:

```
Key              Value                    Message
─────────────────────────────────────────────────────
VITE_API_URL     https://api.example.com ✓ success
VITE_PORT        3000                    ✓ success
VITE_DEBUG       true                     ✓ success
```

### Console Render

Shows colored console logs:

```ts
ValidateEnv({
  schema: { /* ... */ },
  render: 'console',
})
```

### Custom Render Function

```ts
ValidateEnv({
  schema: { /* ... */ },
  render: (logs) => {
    // Custom rendering logic
    logs.forEach((log) => {
      if (log.isError) {
        console.error(`❌ ${log.key}: ${log.message}`)
      } else {
        console.log(`✅ ${log.key}: ${log.value}`)
      }
    })
  },
})
```

## Complete Example

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import ValidateEnv, { Schema } from '@vwinterdev/env-validator-vite'

export default defineConfig({
  plugins: [
    ValidateEnv({
      validator: 'default',
      schema: {
        VITE_API_URL: Schema.string({ format: 'url' }),
        VITE_PORT: Schema.number(),
        VITE_DEBUG: Schema.boolean(),
        VITE_ENV: Schema.enum(['development', 'production'] as const),
        VITE_API_KEY: Schema.string(),
      },
      render: 'table',
    }),
  ],
})
```

```env
# .env
VITE_API_URL=https://api.example.com
VITE_PORT=3000
VITE_DEBUG=true
VITE_ENV=development
VITE_API_KEY=secret-key-123
```

## Error Handling

When validation fails, the plugin will:

1. Display all validation errors in a clear format
2. Show which environment variables were found
3. Stop the build process with an error

Example error output:

```
Environment variables validation error:
  - VITE_PORT: Missing environment variable "VITE_PORT"
  - VITE_API_URL: Invalid URL format

Found environment variables:
  - VITE_DEBUG
  - VITE_API_KEY

Please check your .env file
```

## Type Safety

The plugin automatically converts string values from `.env` files to appropriate types:

- `Schema.number()` → converts `"123"` → `123`
- `Schema.boolean()` → converts `"true"` → `true`, `"false"` → `false`
- `z.coerce.number()` → converts `"123"` → `123`
- `z.coerce.boolean()` → converts `"true"` → `true`

## License

MIT

