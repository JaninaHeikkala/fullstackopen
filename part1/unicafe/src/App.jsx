import { useState, useEffect } from 'react'

const Title = (props) => {
  return (
    <>
      <h1>{props.title}</h1>
    </>
  )
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Statistics = (props) => {
  return (
    <>
      <table>
        <tbody>
          <StatisticsLine text={"good"} number={props.good}></StatisticsLine>
          <StatisticsLine text={"neutral"} number={props.neutral}></StatisticsLine>
          <StatisticsLine text={"bad"} number={props.bad}></StatisticsLine>
          <StatisticsLine text={"all"} number={props.total}></StatisticsLine>
          <StatisticsLine text={"average"} number={props.total !== 0 ? props.average/props.total : 0}></StatisticsLine>
          <StatisticsLine text={"positive"} number={props.total !== 0 ? props.good/props.total : 0} secondText={"%"}></StatisticsLine>
        </tbody>
      </table>
    </>
  )
}

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>{props.text} </td>
      <td>{props.number} {props.secondText}</td>
    </tr>
  )
}

const History = (props) => {
  return (
    <>
      <p>{props.text} {props.total}</p>
    </>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0)


  const handleGoodClick = () => {
    setGood(good + 1);
    setAverage(average + 1)
  };

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  };

  const handleBadClick = () => {
    setBad(bad + 1);
    setAverage(average - 1);
  };

  useEffect(() => {
    const handleCountTotal = () => {
      setTotal(good+neutral+bad);
    };
    handleCountTotal();
  }, [bad, neutral, good]);
  
  return (
    <div>
      <Title title={"give feedback"}></Title>
      <Button text={"good"} handleClick={handleGoodClick}></Button>
      <Button text={"neutral"} handleClick={handleNeutralClick}></Button>
      <Button text={"bad"} handleClick={handleBadClick}></Button>
      <Title title={"statistics"}></Title>
      { total !== 0 ? (
        <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average}></Statistics>
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  )
}

export default App