
import React from "react";
import logo from "./logo.svg";
import "./App.css";
import * as PropTypes from "prop-types";

//port that our backend uses
const PORT = process.env.REACT_APP_API_PORT;
const URL = "http://localhost:" + PORT + "/api"; //URL of our backend

console.log("API URL is: " + URL);
/*

function Button(props) {
  return null;
}
*/

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
          <h1> Community Garden Login Page </h1>
          <Toolbar
              onLogin={() => alert('Loging in!')}
          />
        <img src={logo} className="App-logo" alt="logo" />
        <p>{data ? (data.connected ? 'Connected' : 'Not Connected') : 'Loading...'}</p>
      </header>
    </div>
  );
}

function Toolbar({ onLogin}) {
  return (
      <div>
          <h3> Enter email </h3>
          <input name="myInput" />
        <Button onClick={onLogin}>
          LOGIN!
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
