import { useState, useRef, useEffect } from 'react'

function formatTime(ms) {
  return `${(ms / 1000).toFixed(1)}s`
}

function formatClock(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  const tenths = Math.floor((ms % 1000) / 100)
  return { main: `${minutes}:${seconds}`, tenths: `.${tenths}` }
}

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0) 
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])

  const intervalRef = useRef(null)  
  const startTimeRef = useRef(0)    
  const noteRef = useRef(null)      
  
  function start() {
    if (intervalRef.current) return 
    startTimeRef.current = Date.now() - elapsed
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current)
    }, 100)
    setRunning(true)
  }

  function stop() {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setRunning(false)
    noteRef.current.focus()
  }

  function reset() {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setRunning(false)
    setElapsed(0)
    setLaps([])
    noteRef.current.value = ''
  }

  function addLap(e) {
    e.preventDefault()
    const note = noteRef.current.value.trim()
    if (note === '') return
    setLaps((prev) => [...prev, { id: crypto.randomUUID(), time: elapsed, note }])
    noteRef.current.value = ''
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  const clock = formatClock(elapsed)

  return (
    <section className="app">
      <header className="app-header">
        <h1 className="app-title">Stopwatch</h1>
        <span className={`status ${running ? 'is-running' : ''}`}>
          {running ? 'Running' : elapsed > 0 ? 'Paused' : 'Ready'}
        </span>
      </header>

      <p className="app-count" aria-live="off">
        {clock.main}
        <span className="tenths">{clock.tenths}</span>
      </p>

      <div className="controls">
        <button type="button" className="btn btn-primary" onClick={start} disabled={running}>
          {elapsed > 0 && !running ? 'Resume' : 'Start'}
        </button>
        <button type="button" className="btn" onClick={stop} disabled={!running}>
          Stop
        </button>
        <button type="button" className="btn" onClick={reset} disabled={elapsed === 0}>
          Reset
        </button>
      </div>

      <form className="lap-form" onSubmit={addLap}>
        <input
          ref={noteRef}
          className="lap-input"
          type="text"
          placeholder="Lap note..."
          aria-label="Lap note"
        />
        <button className="btn btn-primary" type="submit">Add lap</button>
      </form>

      {laps.length === 0 ? (
        <p className="empty">No laps yet.</p>
      ) : (
        <ol className="lap-list">
          {laps.map((lap, i) => (
            <li key={lap.id} className="lap-item">
              <span className="lap-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="lap-note">{lap.note}</span>
              <span className="lap-time">{formatTime(lap.time)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default Stopwatch
