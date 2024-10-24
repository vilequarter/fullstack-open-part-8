const Notify = ({message}) => {
  if(!message) return null

  return (
    <div style={{fontWeight:'bold', fontSize:25}}>
      {message}
    </div>
  )
}

export default Notify