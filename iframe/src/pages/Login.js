import React, { useState, useEffect, useContext } from "react";
import Logo from "components/Logo";
import queryString from "query-string";

import ZClientContext from "../ZClientContext.js";
import conf from "conf";
const debug = require("debug")("app:pages:Login");

const loginSize = { width: "600px", height: "700px" };

export default function Login() {
  const { zClient } = useContext(ZClientContext);

  async function login() {
    // const state = user ? `${user.email}:${user.id}` : null;
    zClient.invoke("resize", loginSize);
    const payload = {
      response_type: "token",
      redirect_uri: `${conf.get("CLIENT_URL")}/oauth`,
      client_id: conf.get("OAUTH_CLIENT"),
      scope: "tickets:read tickets:write users:read",
      // state,
    };
    const url = `${
      zClient._origin
    }/oauth/authorizations/new?${queryString.stringify(payload)}`;
    debug("Attempting login at", url);
    window.location.href = url;
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Logo />
      <button
        className="mt-5 bg-black hover:bg-black-2 text-white font-semibold px-8 py-2 rounded focus:outline-none"
        type="button"
        onClick={login}
      >
        Sign in with Zendesk
      </button>
    </div>
  );
}
