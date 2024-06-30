import { createSlice } from "@reduxjs/toolkit"
import anecdotesService from "../services/anecdotes"
// const anecdotesAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ]

// const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0
//   }
// }

const anecdoteSlice = createSlice({
  name: 'notes',
  initialState : [],
  reducers: {
    // addAnecdote(state, action) {
    //   // const content = action.payload
    //   // state.push({
    //   //   content,
    //   //   votes: 0,
    //   //   id: getId(),
    //   // })
    //   state.push(action.payload)
    // },

    // voteAnecdote(state, action) {
    //   const id = action.payload
    //   const anecdoteToChange = state.find(a => a.id == id)
    //   const changedAnecdote = {
    //     ...anecdoteToChange,
    //     votes: anecdoteToChange.votes + 1
    //   }
    //   return state.map(anecdote =>
    //     anecdote.id !== id ? anecdote: changedAnecdote
    //   )
    // },
    updateAnecdote(state, action) {
      const id = action.payload.id
      return state.map( anecdote =>
        anecdote.id !== id ? anecdote: action.payload
      )
    },
    appendAnecdote (state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  },
})


export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}
export const addAnecdote = content => {
  return async dispatch => {
    const anecdote = await anecdotesService.createNew(content)
    dispatch(appendAnecdote(anecdote))
  }
}
export const voteAnecdote = id => {
  return async (dispatch, getState) => {
    const { anecdotes } = getState()
    const anecdoteToChange = anecdotes.find(a => a.id == id)
    const changedAnecdote = {
      ...anecdoteToChange,
      votes: anecdoteToChange.votes + 1
    }
    const updatedAnecdote = await anecdotesService.updateAnecdote(id, changedAnecdote)
    dispatch(updateAnecdote(updatedAnecdote))
  }
}
export const { 
  // addAnecdote, 
  // voteAnecdote,
  updateAnecdote, 
  appendAnecdote, setAnecdotes 
} = anecdoteSlice.actions
export default anecdoteSlice.reducer

// export const voteAnecdote = (id) => {
//   return {
//     type: 'VOTE',
//     payload: { id }
//   }
// }
// export const addAnecdote = (content) => {
//   return {
//     type: 'ADD',
//     payload: {
//       content: content,
//       votes: 0,
//       id: getId()
//     }
//   }
// }

// const anecdoteReducer = (state = initialState, action) => {
//   console.log('state now: ', state)
//   console.log('action', action)

//   switch(action.type) {
//     case 'ADD' :
//       return [...state, action.payload]
//     case 'VOTE': {
//       const id = action.payload.id
//       const AncdtToChange = state.find(n => n.id === id)
//       const changedAncdt = {
//         ...AncdtToChange,
//         votes: AncdtToChange.votes + 1
//       }
//       return state.map(ancdt => 
//         ancdt.id !== id ? ancdt : changedAncdt
//       )
//     }
//     default:
//       return state
//   }
// }