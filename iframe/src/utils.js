import { default as axiosBase } from "axios";
import conf from "conf";
const debug = require("debug")("app:utils");

export let inDev = process.env.NODE_ENV !== "production";
// inDev = true;

const axiosProd = axiosBase.create({
  baseURL: conf.get("SERVER_URL"),
  // withCredentials: true
  /* other custom settings */
});

//use react proxy defined in package.json in development
//use the baseurl defined above in prod
export const axios = axiosProd;

export async function hitAPI(zClient, route, method, payload) {
  const d = new Date();
  // const secsSinceEpoch = Math.round(d.getTime() / 1000);
  const url = `${conf.get("SERVER_URL")}${route}`;
  const access_token = localStorage.getItem("access_token");
  debug("HITAPI has access_token?", !!access_token);

  const options = {
    url,
    type: method,
    dataType: "json",
    data: JSON.stringify(payload),
    headers: {
      "X-Slingshow-Zendesk-Auth": access_token,
    },
    contentType: "application/json",
    cors: true,
    // secure: true,
    // jwt: {
    //   algorithm: "HS256",
    //   secret_key: "the_experimental_prototype_community_of_tomorrow",
    //   expiry: 3600,
    //   claims: {
    //     iat: secsSinceEpoch,
    //     jti: "8883362531196.326",
    //     iss: "some_subdomain",
    //   },
    // },
  };

  const resp = await zClient.request(options);
  return resp;
}
