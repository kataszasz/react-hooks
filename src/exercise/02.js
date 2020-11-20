// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(
  variableName, 
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {}) {
  const [key, setKey] = React.useState(() => {
    const valueFromLocalStorage = window.localStorage.getItem(variableName)

    if (valueFromLocalStorage) {
      return deserialize(valueFromLocalStorage)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const previousKeyRef = React.useRef(key)

  React.useEffect(() => {
    const pervKey = previousKeyRef.current
    if (pervKey !== key) {
      window.localStorage.removeItem(pervKey)
    }
    previousKeyRef.current = key

    window.localStorage.setItem(variableName, serialize(key))
  }, [key, serialize])

  return [key, setKey]
}

function Greeting({initialName = ''}) {
  
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" value={name}/>
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
