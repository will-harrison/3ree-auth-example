import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import * as actions from '../../state/actions/actions'
import * as $ from '../components/components'

class App extends Component {

  render() {

    const { dispatch, todos, lists } = this.props
    return (
      <div>
        <$.AddList
          onAddListSubmit={ text => dispatch( actions.addList( text ) ) }
        />
        <$.ListContainer
          //todos={ todos }
          lists={ lists }
          onAddSubmit={ (text, index) => dispatch( actions.addTodo( text, index ) ) }
          onTodoClick={ (listIndex, index) => dispatch( actions.completeTodo( listIndex, index ) ) }
        />

      </div>
    )

  }

}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  // todos: PropTypes.arrayOf(PropTypes.shape({
  //   text: PropTypes.string.isRequired,
  //   completed: PropTypes.bool.isRequired
  // })),

}

function select(state) {
  return {
    lists: state.lists
  }
}

export default connect(select)(App)