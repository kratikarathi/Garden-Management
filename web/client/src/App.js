
import React from "react";
import "./App.css";
import * as PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./Dashboard"
import ResetButton from "./ResetButton";
import PlantButton from "./PlantButton";
import Selection from "./Selection";
import FarmMap from "./FarmMap";
<<<<<<< HEAD
import Projection from "./Projection";
=======
import InsertButton from "./InsertButton";

>>>>>>> 7e2cf4820b05d68e05a472d4c1b8b00328860f79

//port that our backend uses
const PORT = process.env.REACT_APP_API_PORT;
const URL = "http://localhost:" + PORT + "/api"; //URL of our backend

console.log("API URL is: " + URL);

Button.propTypes = {
  onPress: PropTypes.any,
  color: PropTypes.string,
  title: PropTypes.string,
  accessibilityLabel: PropTypes.string
};


function App() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    fetch(URL + "/check-db-connection")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);


  return (
    <div className="App">
      <header className = "App-toolbar">
      <ResetButton />
      </header>

      <header className="App-header">
        <h1> Community Garden </h1>
          <ResetButton />
          <PlantButton />
          <InsertButton />
        <p>{data ? (data.connected ? 'Connected' : 'Not Connected') : 'Loading...'}</p>
      </header>
      <body className="App-body">
                <FarmMap />
      </body>
      

    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}


export default App;
