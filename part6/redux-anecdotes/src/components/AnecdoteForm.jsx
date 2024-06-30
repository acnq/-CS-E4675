import { useDispatch } from "react-redux";
import { addAnecdote } from "../reducers/anecdoteReducer";
import { showNotification } from "../reducers/NotificationReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const submitAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(addAnecdote(content))
    console.log(`what happend with '${content}'`)
    dispatch(showNotification(`You create for '${content}`))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submitAnecdote}>
        <input name='anecdote' title='Anecdote' placeholder='Enter anecdote'/>
        <button type='submit'>add</button>
      </form>
    </div>
  )
}

export default AnecdoteForm