import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import App from "./app";
import { store } from "./state";
import CellList from "./components/cell-list/cell-list";
import "bulmaswatch/superhero/bulmaswatch.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

ReactDOM.render(
  <Provider store={store}>
    <CellList />
  </Provider>,
  document.getElementById("root")
);
