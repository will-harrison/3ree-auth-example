import * as actions from './ShuffleActions'

const initialState = {
  skus: [ '123' ],
  count: 100
}


export default function shuffle(state = initialState, action) {
  switch (action.type) {
    case action.SHUFFLE_REQUEST:
      return { ...state,
        count: action.count }
    case action.SHUFFLE_COMPLETE:
      return { ...state,
        skus: action.skus }
    default:
      return { ...state }
  }
}
