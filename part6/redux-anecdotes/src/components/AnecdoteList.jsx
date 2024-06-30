import { useDispatch, useSelector } from "react-redux";
import { initializeAnecdotes, voteAnecdote } from "../reducers/anecdoteReducer";
import { showNotification } from "../reducers/NotificationReducer";
import { useEffect } from "react";

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
  
  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])

  const anecdotes = useSelector(({ filter, anecdotes }) => {
    console.log('anecdotes: ', anecdotes)
    console.log('filter', filter)
    if (filter === 'ALL') {
      return anecdotes
    }
    return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
  })

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
              dispatch(showNotification(`You voted for '${anecdote.content}`, 5))
            }
          }
        />
      )}
    </ul>
  )
}

export default AnecdoteList