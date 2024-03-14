const PersonForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        <div>name: <input value={props.newName} onChange={props.handleNameChange}/></div>
        <div>number: <input value={props.newPhoneNumber} onChange={props.handlePhoneNumberChange}/></div>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm