import http from "k6/http";
import { baseurl } from "./root.js";
import { check, group } from "k6";
import auth from "./auth.js";

export let options = {
  vus: 100,
  duration: "30s",
  thresholds: {
    http_req_duration: ["p(95)<200"],
    http_req_failed: ["rate<0.1"],
  },
};

const logout = () => {
  const accessToken = auth();
  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const logout=http.get(`${baseurl}/logout`, params)
  check(logout, {
    "Status is 204": (r) => r.status === 204,
  });
};

export default logout;
