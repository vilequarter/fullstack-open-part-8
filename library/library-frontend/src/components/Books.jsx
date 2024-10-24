import { useQuery } from "@apollo/client"
import { ALL_BOOKS, FILTERED_BOOKS, GENRES } from "./queries"
import { useState } from "react"

const Books = (props) => {
  const [genre, setGenre] = useState('all')

  const { data, loading, refetch } = useQuery((genre === 'all' ? ALL_BOOKS : FILTERED_BOOKS))

  const genresResult = useQuery(GENRES)

  if (!props.show) {
    return null
  }

  if (loading) {
    return (<div>loading...</div>)
  }

  const books = (data.allBooks ? data.allBooks : [])
  const genres = (genresResult.data.allGenres ? genresResult.data.allGenres : [])

  return (
    <div>
      <h2>books</h2>
      <div>
        genre
        <select 
          onChange={({target}) => {
            setGenre(target.value)
            refetch({
              genre: target.value
            })
          }}>
          <option selected value='all'>all genres</option>
          {genres.map((g) => (
            <option value={g} key={g}>{g}</option>
          ))}
        </select>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
