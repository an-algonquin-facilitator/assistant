import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export interface Response<T> {
  data?: T;
  error?: string;
  loading: boolean;
}

export const makeFetch = <RET, ARG>(
  baseURL: string,
  path: (arg: ARG) => string
): ((token: string, arg: ARG) => Promise<RET>) => {
  return (token: string, arg: ARG): Promise<RET> => {
    return new Promise((res, rej) => {
      fetch(baseURL + path(arg), {
        headers: { Authorization: "Bearer " + token },
      }).then((resp) => {
        resp
          .json()
          .then((body) => {
            res(body);
          })
          .catch((e) => rej(JSON.stringify(e)));
      });
    });
  };
};

export const makeQuery = <R, T>(baseURL: string, path: (t: T) => string) => {
  return (t: T) => {
    const [resp, setResp] = useState<Response<R>>({ loading: true });
    const token = useSelector((state: RootState) => state.token.value);
    useEffect(() => {
      if (!token) return;
      fetch(baseURL + path(t), {
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then((resp) => {
        if (resp.status === 200)
          resp
            .json()
            .then((body) => {
              setResp({ data: body, loading: false });
            })
            .catch((e) =>
              setResp({ loading: false, error: JSON.stringify(e) })
            );
        else
          resp.json().then((body) => {
            setResp({ loading: false, error: JSON.stringify(body) });
          });
      });
    }, [t, token]);

    return resp;
  };
};
