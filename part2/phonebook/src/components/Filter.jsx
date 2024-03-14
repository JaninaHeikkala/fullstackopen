const Filter = (props) => {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <div>filter: <input value={props.filter} onChange={props.onChange}/></div>
    </form>
  )
}

export default Filter