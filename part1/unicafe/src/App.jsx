import { useState } from 'react'

const Button =  ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatistcLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td> 
      <td>{value}</td>
    </tr>
  )
}

const Statistcs = ({ good, neutral, bad }) => {
  if (good || neutral || bad ) {
    return (
      <div>
        <table>
          <tbody>
            <StatistcLine text="good" value={good} />
            <StatistcLine text="neutral" value={neutral} />
            <StatistcLine text="bad" value={bad} />
            <StatistcLine text="all" value={good + neutral + bad} />
            <StatistcLine text="average" value={(good - bad) / (good + neutral + bad)} />
            <StatistcLine text="postive" value={ good / (good + neutral + bad) * 100 + "%"} />
          </tbody>
        </table>
      </div>
    )
  }
  return (<p>No feedback given</p>)
}
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <h1>statistics</h1>
      <Statistcs good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App