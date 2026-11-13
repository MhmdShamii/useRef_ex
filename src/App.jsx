import { useState } from 'react'
import Timer from './components/Timer'
import TaskList from './components/TaskList'

function App() {
  const [tasks, setTasks] = useState([])
  const [activeTaskId, setActiveTaskId] = useState(null)

  const activeTask = tasks.find((t) => t.id === activeTaskId)

  function addTask(title) {
    setTasks([...tasks, { id: crypto.randomUUID(), title, sessions: 0 }])
  }

  // called by Timer when the countdown reaches 0
  function finishSession(taskId) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, sessions: t.sessions + 1 } : t))
    )
  }

  return (
    <main className="app">
      <h1 className="title">Focus Timer</h1>
      <Timer task={activeTask} onFinish={finishSession} />
      <TaskList
        tasks={tasks}
        activeTaskId={activeTaskId}
        onAdd={addTask}
        onSelect={setActiveTaskId}
      />
    </main>
  )
}

export default App
