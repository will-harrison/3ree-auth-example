import { take, put, call, fork } from 'redux-saga'
import * as actions from './ShuffleActions'
// import * as queries from './ShuffleQueries'

// import IO from 'socket.io-client'
// export const socket = IO()

export function* reporter(val) {
  console.log('SAGA IS ', val) //eslint-disable-line no-console
}

export function* watchShuffleRequest(getState) {
  while (true) {              //eslint-disable-line no-constant-condition
    yield take(actions.SHUFFLE_REQUEST)
    yield call( reporter, 'ShuffleSaga.SHUFFLE_REQUEST' )
    // const skus = yield call( queries.shuffleSkus, getState().ShuffleReducer.count )
    // yield call( reporter, skus )
    // yield put({ type: actions.SHUFFLE_COMPLETE, skus })
  }
}

export default function* rootSaga(getState) {
  yield [
    fork(watchShuffleRequest, getState)
    // fork(watchShuffleComplete, getState)
  ]
}
