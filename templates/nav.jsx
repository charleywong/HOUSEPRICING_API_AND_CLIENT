import React from "react";
import ReactDOM from "react-dom";

export default class Nav extends React.Component {
  render() {
    return (
      <div>Navbar!!!</div>
    );
  }
}

ReactDOM.render(<Nav />, document.getElementById("nav"));
