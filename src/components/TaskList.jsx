import { useRef } from 'react'

function TaskList({ tasks, activeTaskId, onAdd, onSelect }) {
  // useRef on a DOM element: inputRef.current IS the <input> on the page
  const inputRef = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    const title = inputRef.current.value.trim()
    if (title === '') return
    onAdd(title)
    inputRef.current.value = '' // clear the box
    inputRef.current.focus() // keep the cursor in it
  }

  return (
    <section className="card">
      <form className="add-form" onSubmit={handleSubmit}>
        <input ref={inputRef} className="input" placeholder="New task..." />
        <button className="btn btn-primary" type="submit">Add</button>
      </form>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <button
              className={task.id === activeTaskId ? 'task active' : 'task'}
              onClick={() => onSelect(task.id)}
            >
              <span>{task.title}</span>
              <span className="dots">{'●'.repeat(task.sessions)}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default TaskList
