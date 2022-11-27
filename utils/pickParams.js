import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'

const pickParams = (params) => {
  return pickBy(
    pickBy(params, identity),
    (val) => val !== 'undefined' && typeof val !== 'undefined'
  )
}
export default pickParams
