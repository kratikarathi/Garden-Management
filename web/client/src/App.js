
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
import FarmMap from "./FarmMap";

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
      <header className="App-header">
          <h1> Community Garden </h1>
          <ResetButton />
          <PlantButton />
        <p>{data ? (data.connected ? 'Connected' : 'Not Connected') : 'Loading...'}</p>
      </header>
    </div>
  );
}

function toDash() {
    return (
        <Router>
            <Route
                path="/dashboard"
                element={<Dashboard />}
            />
        </Router>
    );
}

function Toolbar({ onLogin}) {
  return (
      <div>
          <h3> Enter email </h3>
          <input name="myInput" />
        <Button onClick={onLogin}>
          LOGIN
        </Button>
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
