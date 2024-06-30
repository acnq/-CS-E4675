import ReactDOM from 'react-dom/client'
import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import { addAnecdote } from './reducers/anecdoteReducer'
import { filterChange } from './reducers/filterReducer'

import App from './App'
import anecdoteReducer from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer'

const reducer = combineReducers({
  anecdotes: anecdoteReducer,
  filter: filterReducer
})

const store = createStore(reducer)
console.log(store.getState())
store.subscribe(() => console.log(store.getState()))
store.dispatch(filterChange('SET_FILTER'))
store.dispatch(addAnecdote('random anecdote'))
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)