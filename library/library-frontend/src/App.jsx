import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import Notify from "./components/Notify";
import { useApolloClient } from "@apollo/client";

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
  }

  return (
    <div>
      <Notify message={message} />
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? 
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => logout()}>logout</button>
          </>
          :
          <button onClick={() => setPage("login")}>login</button>
        }
        
      </div>

      <Authors show={page === "authors"} notify={notify}/>

      <Books show={page === "books"} />

      <NewBook show={page === "add"} notify={notify}/>

      <Login show={page === "login"} setToken={setToken} setPage={setPage} notify={notify}/>
    </div>
  );
};

export default App;
