import { useEffect, useState } from "react";
import { useToken } from "../store/token";
import { StatusOK } from "./api";

export interface Response<T> {
  data?: T;
  error?: string;
  loading: boolean;
}

export const unknownError = (e: unknown): Error => {
  if (e instanceof Error) {
    return e;
  } else {
    return new Error(String(e));
  }
};

export const makeFetch = <RET, ARG>(
  baseURL: string,
  path: (arg: ARG) => string,
): ((token: string, arg: ARG) => Promise<RET>) => {
  return async (token: string, arg: ARG): Promise<RET> => {
    return new Promise((res, rej) => {
      fetch(baseURL + path(arg), {
        headers: { Authorization: "Bearer " + token },
      })
        .then((resp) => {
          resp
            .json()
            .then((body: RET) => {
              res(body);
            })
            .catch((e: unknown) => rej(unknownError(e)));
        })
        .catch((e: unknown) => rej(unknownError(e)));
    });
  };
};

export const makeQuery = <R, T>(baseURL: string, path: (t: T) => string) => {
  return (t: T): Response<R> => {
    const [resp, setResp] = useState<Response<R>>({ loading: true });
    const token = useToken();
    useEffect(() => {
      if (!token) return;
      fetch(baseURL + path(t), {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((apiResp) => {
          if (apiResp.status === StatusOK)
            apiResp
              .json()
              .then((body: R) => {
                setResp({ data: body, loading: false });
              })
              .catch((e: unknown) =>
                setResp({ loading: false, error: JSON.stringify(e) }),
              );
          else
            apiResp
              .json()
              .then((body) => {
                setResp({ loading: false, error: JSON.stringify(body) });
              })
              .catch((e: unknown) =>
                setResp({ loading: false, error: JSON.stringify(e) }),
              );
        })
        .catch((e: unknown) => {
          setResp({ loading: false, error: String(e) });
        });
    }, [t, token]);

    return resp;
  };
};
