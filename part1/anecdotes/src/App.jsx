import { useState } from 'react'

const App = () => {
  const [selected, setSelected] = useState(0);
  const p = new Uint8Array(8);
  const copy = [...p];
  const [points, setPoints] = useState(copy);
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]; 

  const handleAnecdoteButtonPress = async () => {
    setSelected(Math.floor(Math.random() * anecdotes.length));
  };

  const handleVoteButtonPress = async () => {
    const copy = [...points];
    copy[selected] += 1;
    setPoints(copy);
  };

  return (
    <div>
      <h1>anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <button onClick={handleVoteButtonPress}>vote</button>
      <button onClick={handleAnecdoteButtonPress}>next anecdote</button>
      <h1>anecdote with the most votes</h1>
      <p>{anecdotes[points.indexOf(Math.max(...points))]}</p>
      <p>has {points[points.indexOf(Math.max(...points))]} votes</p>
    </div>
  )
}

export default App