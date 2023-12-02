
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
import AggregatedReports from "./AggregatedReports";
import Selection from "./Selection";
import FarmMap from "./FarmMap";
import Projection from "./Projection";
import InsertButton from "./InsertButton";


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
  const [screen, setScreen] = React.useState('FarmMap');
  React.useEffect(() => {
    fetch(URL + "/check-db-connection")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const screens = ['Farm Map','Aggregated Reports','Selection','Projection']
  const handleButtonClick = (screen) => {
    setScreen(screen);
  };

  return (
    <div className="App">
      <header className = "App-toolbar">
      <ResetButton />
      {screens.map(screen => {
        return <button onClick={() => handleButtonClick(screen)}>{screen}</button>
      })}
      </header>

      <header className="App-header">
        <h1> Community Garden </h1>
         
        <p>{data ? (data.connected ? 'Connected' : 'Not Connected') : 'Loading...'}</p>
      </header>
      <body className="App-body">
          {screen == 'Farm Map' ? <FarmMap /> : ""}
          {screen == 'Aggregated Reports' ? <AggregatedReports /> : ""}
          {screen == 'Projection' ? <Projection /> : ""}
          {screen == 'Selection' ? <Selection /> : ""}
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
