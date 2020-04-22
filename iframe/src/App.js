/* global ZAFClient */
import React, { useState, useEffect } from "react";
import queryString from "query-string";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";

import ErrorBoundary from "components/ErrorBoundary";
import Oauth from "pages/Oauth";
import Landing from "pages/Landing";
import Login from "pages/Login";
import ZClientContext from "./ZClientContext.js";
const debug = require("debug")("app:App");

const size = { width: "450px", height: "240px" };

export default function App() {
  const [zClient, setZClient] = useState(null);
  const history = useHistory();
  const location = useLocation();

  debug("App Location", location);
  useEffect(() => {
    async function f() {
      debug("Outer F", location.search, ZAFClient);
      //ZAFClient inits with query paramaeters that are only available on the initial load so store them and then use them for future redirects
      if (location.search === "") {
        const app_guid = localStorage.getItem("app_guid");
        const origin = localStorage.getItem("origin");
        const newUrl =
          location.pathname +
          "?" +
          queryString.stringify({ app_guid, origin }) +
          location.hash;
        debug("Retrieved", app_guid, origin, "navigating to", newUrl);

        history.push(newUrl);
      } else {
        const client = ZAFClient.init();
        client.invoke("resize", size);
        setZClient(client);
        localStorage.setItem("app_guid", client._appGuid);
        localStorage.setItem("origin", client._origin);
        debug("Parameters found, storing in local storage");
      }
    }

    f();
  }, [location.search]);

  //index.js has BrowserRouter
  return (
    <ZClientContext.Provider value={{ zClient, setZClient }}>
      <ErrorBoundary>
        <div
          className="p-4.5 bg-white flex flex-col justify-center items-center"
          style={size}
        >
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/oauth" component={Oauth} />
          </Switch>
        </div>
      </ErrorBoundary>
    </ZClientContext.Provider>
  );
}
