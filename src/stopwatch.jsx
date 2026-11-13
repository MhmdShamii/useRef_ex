import { useState, useRef, useEffect } from 'react'

function formatTime(ms) {
  return `${(ms / 1000).toFixed(1)}s`
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

  return (
    <section className="app">
      <h1 className="app-title">Stopwatch</h1>
      <p className="app-count">{formatTime(elapsed)}</p>

      <div className="filters">
        <button type="button" className="btn btn-primary" onClick={start} disabled={running}>
          {elapsed > 0 && !running ? 'Resume' : 'Start'}
        </button>
        <button type="button" className="filter-btn" onClick={stop} disabled={!running}>
          Stop
        </button>
        <button type="button" className="btn btn-clear" onClick={reset} disabled={elapsed === 0}>
          Reset
        </button>
      </div>

      <form className="task-form" onSubmit={addLap}>
        <input
          ref={noteRef}
          className="task-input"
          type="text"
          placeholder="Lap note..."
          aria-label="Lap note"
        />
        <button className="btn btn-primary" type="submit">Add lap</button>
      </form>

      {laps.length === 0 ? (
        <p className="empty">No laps yet.</p>
      ) : (
        <ul className="task-list">
          {laps.map((lap) => (
            <li key={lap.id} className="task-item">
              <span className="task-text">{formatTime(lap.time)} – {lap.note}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Stopwatch
