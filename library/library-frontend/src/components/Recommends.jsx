import { useQuery } from '@apollo/client'
import { FILTERED_BOOKS, ME } from './queries'
import { useEffect } from 'react'

const Recommends = (props) => {
  const user = useQuery(ME)
  const genre = (user.data ? user.data.me.favoriteGenre : null)
  const booksResult = useQuery(FILTERED_BOOKS)

  useEffect(() => {
    booksResult.refetch({
      genre: genre
    })
  }, [genre])

  if(!props.show) {
    return null
  }

  const books = (booksResult.data ? booksResult.data.allBooks : [])

  return (
    <div>
      <h2>recommendations</h2>
      <div>based on your favorite genre: <b>{genre}</b></div>

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

export default Recommends