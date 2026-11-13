import { useState, useRef, useEffect } from 'react'

const LENGTHS = [1, 5, 15, 25] // minutes the user can pick

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

function Timer({ task, onFinish }) {
  // useState: the screen shows these, so changing them must re-render
  const [minutes, setMinutes] = useState(25)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [running, setRunning] = useState(false)

  // useRef: the code needs these, but the screen never shows them
  const intervalRef = useRef(null) // the timer id, so Pause can stop it
  const endTimeRef = useRef(0) // the exact moment the countdown ends

  // When this Timer is removed (e.g. you picked another task), stop its interval
  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  function chooseLength(m) {
    setMinutes(m)
    setSecondsLeft(m * 60)
  }

  function start() {
    endTimeRef.current = Date.now() + secondsLeft * 1000

    intervalRef.current = setInterval(() => {
      const left = Math.ceil((endTimeRef.current - Date.now()) / 1000)

      if (left > 0) {
        setSecondsLeft(left)
      } else {
        clearInterval(intervalRef.current)
        setRunning(false)
        setSecondsLeft(minutes * 60)
        onFinish(task.id) // give this task a ●
      }
    }, 1000)

    setRunning(true)
  }

  function pause() {
    clearInterval(intervalRef.current)
    setRunning(false)
  }

  function reset() {
    clearInterval(intervalRef.current)
    setRunning(false)
    setSecondsLeft(minutes * 60)
  }

  return (
    <section className="card">
      <p className="label">{task ? `Focusing on: ${task.title}` : 'Pick a task below'}</p>

      <div className="lengths">
        {LENGTHS.map((m) => (
          <button
            key={m}
            className={m === minutes ? 'length active' : 'length'}
            onClick={() => chooseLength(m)}
            disabled={running}
          >
            {m} min
          </button>
        ))}
      </div>

      <p className="time">{formatTime(secondsLeft)}</p>

      <div className="controls">
        {running ? (
          <button className="btn btn-primary" onClick={pause}>Pause</button>
        ) : (
          <button className="btn btn-primary" onClick={start} disabled={!task}>Start</button>
        )}
        <button className="btn" onClick={reset}>Reset</button>
      </div>
    </section>
  )
}

export default Timer
