import { useDispatch, useSelector } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { showNotification } from "../reducers/NotificationReducer";

const Anecdote = ({ anecdote, handleClick }) => {
  return(
    <li>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button  onClick={handleClick} >vote</button>
      </div>
    </li>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ filter, anecdotes}) => {
    if (filter === 'ALL') {
      return anecdotes
    }
    return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
  })
  console.log('anecdotes: ', anecdotes)
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)
  return(
    <ul>
      {sortedAnecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() =>
            {
              dispatch(voteAnecdote(anecdote.id))
              dispatch(showNotification(`You voted for '${anecdote.content}`))
            }
          }
        />
      )}
    </ul>
  )
}

export default AnecdoteList