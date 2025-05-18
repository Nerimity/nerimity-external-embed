/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";

const Server = lazy(() => import("./Server.tsx"));

const root = document.getElementById("root");

render(
  () => (
    <Router>
      <Route path="/server" component={Server} />
    </Router>
  ),
  root!
);
