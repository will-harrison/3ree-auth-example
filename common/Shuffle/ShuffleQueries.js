import xss from 'xss'
import r from 'rethinkdb'

import { SOFT_DURABILITY } from './util'

export function shuffleSkus(conn, count=100) {
  return r
  .table('item')
  .sample(100)
  ('sku')
  .run(conn)
  .error(err => err)
}
