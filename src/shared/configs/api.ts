import ky from "ky";
import { parseCookies } from "nookies";

export const api = ky.create({
  prefixUrl: `https://production.imoobile.com.br/api/v1/`,
  hooks: {
    beforeRequest: [
      (request) => {
        const cookies = parseCookies();
        const token = cookies.token;

        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
        return request;
      },
    ],
  },
});
