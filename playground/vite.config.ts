
import { defineConfig } from 'vite'

import ValidateEnv from '../src/index.ts'
import { Schema } from '../src/index.ts'


const schema = {
  VITE_BOOLEAN: Schema.number(),
  VITE_NUMBER: Schema.number(),
  VITE_NUMBER2: Schema.number(),
}

export default defineConfig({
  root: import.meta.dirname,
  plugins: [
    ValidateEnv({
        schema: schema,
    }), 
  ],
})