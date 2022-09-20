
import { ASSET_TYPES } from '../shared/constants'

export function initAssetRegisters (Vue) {

  ASSET_TYPES.forEach(type => {
    Vue[type] = function (id, definition) {
      if (type === 'component') {
        definition.name = definition.name || id
        definition = this.options._base.extend(definition)
      }

      if (type === 'directive' && typeof definition === 'function') {
        // todo
      }

      if (type === 'filter') {
        // todo
      }

      this.options[type + 's'][id] = definition
      // return definition
    }
  })
}
