import { useState, useRef } from 'react'

const FOCUS_SECONDS = 25 * 60 // tip: change to 10 when presenting, so you don't wait 25 minutes

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

function Timer({ task, onFinish }) {
  // useState: the screen shows these, so changing them must re-render
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS)
  const [running, setRunning] = useState(false)

  // useRef: the code needs these, but the screen never shows them
  const intervalRef = useRef(null) // the timer id, so Pause can stop it
  const endTimeRef = useRef(0) // the exact moment the countdown ends

  function start() {
    endTimeRef.current = Date.now() + secondsLeft * 1000

    intervalRef.current = setInterval(() => {
      const left = Math.ceil((endTimeRef.current - Date.now()) / 1000)

      if (left > 0) {
        setSecondsLeft(left)
      } else {
        clearInterval(intervalRef.current)
        setRunning(false)
        setSecondsLeft(FOCUS_SECONDS)
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
    setSecondsLeft(FOCUS_SECONDS)
  }

  return (
    <section className="card">
      <p className="label">{task ? `Focusing on: ${task.title}` : 'Pick a task below'}</p>
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
