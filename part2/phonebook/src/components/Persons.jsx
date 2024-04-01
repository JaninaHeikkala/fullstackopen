import Person from "./Person"

const Persons = (props) => {
  return (
    <>
      {props.personsToShow.map(person => (
        <Person key={person.id} name={person.name} number={person.number} btn={person.btn}></Person>
      ))}
    </>
  )
}

export default Persons