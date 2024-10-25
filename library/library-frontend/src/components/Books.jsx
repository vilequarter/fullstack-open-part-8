import { useQuery } from "@apollo/client"
import { GENRES } from "./queries"

const Books = (props) => {
  const genresResult = useQuery(GENRES)

  if (!props.show) {
    return null
  }

  if (props.filteredBooks.loading) {
    return (<div>loading...</div>)
  }

  const books = (props.filteredBooks.data.allBooks ? props.filteredBooks.data.allBooks : [])
  const genres = (genresResult.data.allGenres ? genresResult.data.allGenres : [])

  return (
    <div>
      <h2>books</h2>
      <div>
        genre
        <select 
          onChange={({target}) => {
            props.setGenre(target.value)
            props.filteredBooks.refetch({
              genre: target.value
            })
          }}>
          <option selected value=''>all genres</option>
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
