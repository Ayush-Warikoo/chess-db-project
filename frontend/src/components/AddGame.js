import React, { useState, useRef } from "react";
import axios from 'axios';

function AddGame() {

  const [files, setFiles] = useState()

  function handleChange(event) {
    setFiles(event.target.files)
  }
  
  function handleSubmit(event) {
    for (var file of files) {
      event.preventDefault()
      const url = 'http://localhost:5000/addGame';
      var reader = new FileReader();
  
      reader.onload = function(event) {
          axios.post(url, {"str": event.target.result}).then(function (response) {
              console.log(response);
            })
      };
  
      reader.readAsText(file);
    }
  }

  return (
    <div className="AddGame">
        <form onSubmit={handleSubmit}>
          <h1>Add Game</h1>
          <input type="file" onChange={handleChange} multiple/>
          <button type="submit">Upload</button>
        </form>
    </div>
  );
}

export default AddGame;