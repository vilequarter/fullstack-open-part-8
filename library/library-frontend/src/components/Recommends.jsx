const Recommends = (props) => {
  if(!props.show) {
    return null
  }

  const books = (props.recommendBooks.data ? props.recommendBooks.data.allBooks : [])

  return (
    <div>
      <h2>recommendations</h2>
      <div>based on your favorite genre: <b>{props.favoriteGenre}</b></div>

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