import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import * as Sentry from "@sentry/browser";

import ZClientContext from "../ZClientContext.js";
import { hitAPI } from "utils.js";
import Logo from "components/Logo";
const debug = require("debug")("app:pages:Landing");

export default function Landing() {
  const { zClient } = useContext(ZClientContext);
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (!zClient) {
      return;
    }
    zClient.get("currentUser").then((zResp) => {
      const currentUser = zResp.currentUser;
      setUser(currentUser);
    });

    zClient.on("pane.activated", () => debug("PANE ACTIVATED"));
  }, [history, zClient]);

  useEffect(() => {
    async function f() {
      if (user) {
        let returnedUser;
        try {
          returnedUser = await hitAPI(zClient, "/api/user/me/zendesk", "POST", {
            email: user.email,
          });
        } catch (err) {
          Sentry.captureException(err);
          console.error(err);
        } finally {
          if (!returnedUser) {
            debug("No zendesk user found");
            history.push("/login");
            return;
          }
        }

        debug("Me Zendesk", returnedUser);
      }
    }

    f();
  }, [user]);

  async function insertFolder(snippetIndex) {
    if (!zClient) {
      return;
    }

    const zResp2 = await zClient.get("ticket");
    const ticket = zResp2.ticket;
    const payload = { currentUser: user, zendesk_ticket_id: ticket.id };

    debug("Getting new slingshow link with", payload);
    const folder = await hitAPI(
      zClient,
      `/api/folder/zendesk`,
      "POST",
      payload
    );
    debug("Recieved folder", folder);

    let snippet;
    if (snippetIndex === 0) {
      snippet = `Could you take a quick screen recording and walk me through the issue? Just click this link to record & submit: ${folder.url} (There's nothing to download)`;
    } else if (snippetIndex === 1) {
      snippet = `${folder.url}`;
    }

    zClient.invoke("ticket.editor.insert", snippet);
    zClient.invoke("app.close");
  }

  return (
    <>
      <div className="mb-5 self-start">
        <Logo />
      </div>
      <div className="w-full h-full flex flex-col  items-center">
        <p className="self-start font-medium text-lg mt-1 mb-2">
          Se<span onClick={() => history.push("/login")}>l</span>ect a macro to
          request a screen recording:
        </p>
        <p
          className="mt-2 px-3 cursor-pointer py-2 bg-gray-200 border border-gray-250 hover:bg-gray-300 hover:border-gray-300 text-black w-full rounded focus:outline-none overflow-text"
          onClick={() => {
            insertFolder(0);
          }}
        >
          <span className="font-medium">Snippet w/ Link </span> - Could you take
          a quick screen recording and walk me through the issue? Just click
          this link to record & submit: www.slingshow.com/xxxxxx. (There's
          nothing to download)
        </p>
        <p
          className="mt-2 px-3 cursor-pointer py-2 bg-gray-200 border border-gray-250 hover:bg-gray-300 hover:border-gray-300 text-black w-full rounded focus:outline-none overflow-text"
          onClick={() => {
            insertFolder(1);
          }}
        >
          <span className="font-medium">Just Link </span> -
          www.slingshow.com/xxxxxx
        </p>
      </div>
    </>
  );
}
