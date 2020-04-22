import React, { useState, useEffect, useContext } from "react";
import queryString from "query-string";
import { useHistory } from "react-router-dom";

import ZClientContext from "../ZClientContext.js";
import Loading from "components/Loading";
import conf from "conf";
import { axios, hitAPI } from "utils.js";
const debug = require("debug")("app:pages:Oauth");

export default function Oauth() {
  const [error, setError] = useState(null);
  const { zClient } = useContext(ZClientContext);
  const history = useHistory();

  useEffect(() => {
    async function f() {
      debug("Oauth f");
      if (!zClient) return;

      const zResp = await zClient.get("currentUser");
      const user = zResp.currentUser;
      const domain = zClient._origin;

      const oauthRaw = window.location.hash;
      const oauth = queryString.parse(oauthRaw);
      const payload = {
        ...oauth,
        user_id: user.id,
        domain,
      };
      debug("OAUTH Payload", payload);
      localStorage.setItem("access_token", oauth.access_token);

      try {
        const resp = await hitAPI(
          //TODO: Properly handle this error
          zClient,
          "/api/user/login/zendesk",
          "POST",
          payload
        );
        debug("POST ZENDESK resp", resp);
      } catch (err) {
        debug("Catch err and set err");
        setError(err);
        console.error(err);
        return;
      }

      history.push("/");
    }

    f();
  }, [zClient, history]);

  if (error)
    return (
      <div className="w-screen h-screen flex justify-center items-center flex-col">
        Problem logging in, please contact Slingshow Support or{" "}
        <span
          className="font-semibold cursor-pointer"
          onClick={() => history.push("/login")}
        >
          Try Again
        </span>
      </div>
    );

  return <Loading />;
}
