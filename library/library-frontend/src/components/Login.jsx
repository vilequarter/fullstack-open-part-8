import { useMutation } from "@apollo/client"
import { LOGIN } from "./queries"
import { useEffect, useState } from "react"

const Login = ({show, setToken, setPage, notify, refetch}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      notify(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if(result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      refetch()
    }
  }, [result.data])

  if(!show) return null

  const submit = async (event) => {
    event.preventDefault()

    const result = await login({ variables: { username, password } })
    setUsername('')
    setPassword('')
    if(result.data) {
      setPage('authors')
      notify('login successful')
    }
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input value={username} onChange={({target}) => setUsername(target.value)} />
        </div>
        <div>
          password <input type='password' value={password} onChange={({target}) => setPassword(target.value)} />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default Login