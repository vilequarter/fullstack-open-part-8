import { useMutation, useQuery } from "@apollo/client"
import { ALL_AUTHORS, SET_BIRTH_YEAR } from "./queries"
import { useState } from "react"

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const result = useQuery(ALL_AUTHORS)
  const [ setBirthYear ] = useMutation(SET_BIRTH_YEAR, {
    refetchQueries: [ { query: ALL_AUTHORS }]
  })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return (<div>loading...</div>)
  }

  const authors = (result.data.allAuthors ? result.data.allAuthors : [])

  const submit = async (event) => {
    event.preventDefault()

    console.log('update author...')

    setBirthYear({ variables: { name, born }})

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>set birth year</h3>
      <form onSubmit={submit}>
        <div>
          name
          <select onChange={({ target }) => setName(target.value)}>
            <option disabled selected value> choose author </option>
            {authors.map((a) => (
              <option value={a.name} key={a.name}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          born
          <input 
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
