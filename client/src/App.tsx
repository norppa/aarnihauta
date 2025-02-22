import { useEffect, useState } from 'react'
import './App.css'

type Value = {
  id: number
  value: string
}

function App() {
  const [value, setValue] = useState('')
  const [values, setValues] = useState<Array<Value>>([])

  useEffect(() => {
    const fetchValues = async () => {
      const response = await fetch('/api/values')
      if (!response.ok) {
        console.error('Failed to fetch values')
        return
      }
      const data = await response.json()
      console.log(data)
      setValues(data)
    }
    fetchValues()
  }, [])

  const submit = async () => {
    const response = await fetch('/api/values', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ value })
    })
    if (!response.ok) {
      console.error('Failed to submit value')
      return
    }
    const data = await response.json()
    console.log('data', data)
    setValues(values.concat(data))
    setValue('')
  }

  const deleteValues = async () => {
    const response = await fetch('/api/values', {
      method: 'DELETE'
    })
    if (!response.ok) {
      console.error('Failed to delete values')
      return
    }
    setValues([])
  }

  return (
    <>
      <h1>Aarnihauta</h1>
      <div>
        <input type="text" value={value} onChange={e => setValue(e.target.value)} />
        <button onClick={submit}>Submit</button>
        <button onClick={deleteValues}>Delete</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {values.map((value, index) => (
            <tr key={index}>
              <td>{value.id}</td>
              <td>{value.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default App
