import Person from "./Person";

const Persons = ({ persons, setPersons, filter }) => {
  const filtered = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  if (!persons || persons.length === 0) {
    return (<p>...</p>)
  }
  return (
    <div>
      {
        filtered.map(person => 
          <Person key={person.id} person={person} />
        )
      }
    </div>
  )
} 

export default Persons