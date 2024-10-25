import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import Notify from "./components/Notify";
import { useApolloClient } from "@apollo/client";
import Recommends from "./components/Recommends";
import { CREATE_BOOK, ALL_AUTHORS, FILTERED_BOOKS, ME } from "./components/queries";

const App = () => {
  const [page, setPage] = useState("authors")
  const [message, setMessage] = useState(null)

  const notify = (newMessage) => {
    setMessage(newMessage)
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage("login")
  }

  const filteredBooks = useQuery(FILTERED_BOOKS)
  const recommendBooks = useQuery(FILTERED_BOOKS)

  const user = useQuery(ME)
  const favoriteGenre = ((user.data && user.data.me) ? user.data.me.favoriteGenre : null)

  const loginRefetch = () => {
    user.refetch()
    recommendBooks.refetch({
      genre: favoriteGenre
    })
  }

  const [genre, setGenre] = useState('')

  const [ createBook ] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      notify(messages)
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        return {
          allAuthors: allAuthors.concat(response.data.addBook.author)
        }
      })
      filteredBooks.refetch({
        genre: genre
      })
      recommendBooks.refetch({
        genre: favoriteGenre
      })
    }
  })

  return (
    <div>
      <Notify message={message} />
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? 
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommends")}>recommends</button>
            <button onClick={() => logout()}>logout</button>
          </>
          :
          <button onClick={() => setPage("login")}>login</button>
        }
        
      </div>

      <Authors show={page === "authors"} notify={notify}/>

      <Books show={page === "books"} filteredBooks={filteredBooks} genre={genre} setGenre={setGenre}/>

      <NewBook show={page === "add"} notify={notify} createBook={createBook}/>

      <Login show={page === "login"} setToken={setToken} setPage={setPage} notify={notify} refetch={loginRefetch}/>

      <Recommends show={page === "recommends"} recommendBooks={recommendBooks} favoriteGenre={favoriteGenre}/>
    </div>
  );
};

export default App;
