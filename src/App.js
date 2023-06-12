import React,{ useState, useEffect } from "react";
import axios from "axios";

const App = () =>{

  const [posts, setposts] = useState('');

  useEffect(()=>{
    axios.get('/api/hello')
    .then(response => setposts(response.data))
    .catch(error => console.log(error))
  })
  return (
    <div> {posts} </div>
    )
}

export default App;