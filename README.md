# Focus Timer: a `useRef` example

A 25-minute study timer with a task list. When the countdown finishes, the selected task gets a ●.

```bash
npm install
npm run dev
```

## Files

```
src/App.jsx                 holds the tasks, puts Timer + TaskList on the page
src/components/Timer.jsx    the countdown (2 refs)
src/components/TaskList.jsx the input + list of tasks (1 ref)
```

## useState vs useRef in one sentence

**If the screen shows it, use `useState`. If only the code needs to remember it, use `useRef`.**

Changing state re-renders the component. Changing `ref.current` does not.

## The 3 refs in this app

| Ref | What it holds | Why not useState? |
|---|---|---|
| `intervalRef` | the `setInterval` id | Never shown on screen. We only need it so Pause can call `clearInterval`. |
| `endTimeRef` | the moment the countdown ends | Never shown. Each second the code calculates `end - now`. |
| `inputRef` | the `<input>` element itself | Lets us read the text, clear the box and focus it, without storing every keystroke in state. |

The state (what the user sees) is `secondsLeft`, `running`, `tasks` and `activeTaskId`.

## Demo tip

Pick the **1 min** button when presenting, so a full session finishes quickly.
