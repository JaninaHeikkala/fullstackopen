import Person from "./Person"

const Persons = (props) => {
  return (
    <>
      {props.personsToShow.map(person => (
        <Person key={person.id} name={person.name} phoneNumber={person.phoneNumber} btn={person.btn}></Person>
      ))}
    </>
  )
}

export default Persons