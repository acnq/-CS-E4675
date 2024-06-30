import { filterChange } from '../reducers/filterReducer'
import { useDispatch } from "react-redux" 

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    // input field value is in var event.target.value
    return dispatch(filterChange(event.target.value))
  }

  const style = {
    marginBottom: 10
  }
  
  return (
    <div style={style}>
      filter <input onChange={handleChange} title="Filter" />
    </div>
  )
}

export default Filter