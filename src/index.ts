import { Plugin } from "vite"

import { ValidatorOptions } from "./type"

import { selectValidator } from "./validators"
import { selectRender } from "./render"

export default (options: ValidatorOptions): Plugin => {
  return {
    name: 'env-validator',
    enforce: 'pre',
    async configResolved(config) {
      const { validator = 'default', schema, render = 'table' } = options
      const result = await selectValidator(validator)(schema, config.env)
      selectRender(render)(result)
    },
  }
}

export { schema as Schema } from "@poppinss/validator-lite"
