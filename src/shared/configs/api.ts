import ky from "ky";

export const api = ky.create({
  prefixUrl: `http://localhost:8080/api/v1/`,
  headers: {
    "Content-Type": "application/json",
  },
});
