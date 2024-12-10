// This is the file you need to update

import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useState } from "react";

export type UseFetchOptions = {
  immediate: boolean;
};

export type UseFetchReturn<T> = {
  loading: boolean;
  error: string | null;
  data: T | null;
  url: string;
  load: () => Promise<void>;
  updateUrl: Dispatch<SetStateAction<string>>;
  updateOptions: Dispatch<SetStateAction<UseFetchOptions>>;
  updateRequestOptions: Dispatch<SetStateAction<RequestInit | undefined>>;
};

export default function useFetch<T>(
  initialUrl: string,
  initialRequestOptions?: RequestInit,
  initialOptions?: UseFetchOptions,
): UseFetchReturn<T> {
  // second test
  const [loading, setloading] = useState(false);
  const [data, setData] = useState<T | null>(null);// means this generic data can be of type T or null

  const load = useCallback (async () => {
    setloading(true);
    const response = await fetch(initialUrl);
    const json = await response.json();
    setData(json);
    setloading(false);
  }, [initialUrl]);

  // first test
  useEffect(() => {
    load();
  }, [load]);

  return {
    url: "",
    loading,
    error: null,
    data,
    load,
    updateUrl: () => {},
    updateOptions: () => {},
    updateRequestOptions: () => {},
  };
}
