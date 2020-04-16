import React, { useState, useEffect, useContext } from "react";
import queryString from "query-string";
import { useHistory } from "react-router-dom";

import ZClientContext from "../ZClientContext.js";
import Loading from "components/Loading";
import conf from "conf";
import { axios, hitAPI } from "utils.js";
const debug = require("debug")("app:pages:Oauth");

export default function Oauth() {
  const { zClient } = useContext(ZClientContext);
  const history = useHistory();
  debug("Oauth");

  useEffect(() => {
    async function f() {
      debug("OAUTH RUNNING");
      if (!zClient) return;
      debug("THERE IS A CLIENT IN OAUTH");

      const zResp = await zClient.get("currentUser");
      const user = zResp.currentUser;
      const domain = zClient._origin;

      const oauthRaw = window.location.hash;
      debug("OAUTH RAW", { oauthRaw });
      const oauth = queryString.parse(oauthRaw);
      const payload = {
        ...oauth,
        user_id: user.id,
        domain,
      };
      debug("OAUTH Payload", { payload });
      const resp = await hitAPI(
        zClient,
        "/api/user/login/zendesk",
        "POST",
        payload
      );
      debug("POST ZENDESK resp", resp);
      history.push("/");
    }

    f();
  }, [zClient, history]);

  return <Loading />;
}
