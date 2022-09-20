
import { ASSET_TYPES } from '../shared/constants'
import { mergeOptions } from '../utils/index'


export function initExtend (Vue) {
  Vue.cid = 0
  let cid = 1

  Vue.extend = function (extendOptions) {
    // console.log('extendOptions', extendOptions)
    const Super = this

    const Sub = function VueComponent (options) {
      this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )

    // 返回子类
    return Sub
    
  }
}


function initProps (Comp) {
  const props = Comp.options.props
  for (const key in props) {
    proxy(Comp.prototype, `_props`, key)
  }
}

function initComputed (Comp) {
  const computed = Comp.options.computed
  for (const key in computed) {
    defineComputed(Comp.prototype, key, computed[key])
  }
}
