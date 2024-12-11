// // This is the file you need to update

// import type { Dispatch, SetStateAction } from "react";
// import { useCallback, useEffect, useRef, useState } from "react";

// export type UseFetchOptions = {
//   immediate: boolean;
// };

// export type UseFetchReturn<T> = {
//   loading: boolean;
//   error: string | null;
//   data: T | null;
//   url: string;
//   load: () => Promise<void>;
//   updateUrl: Dispatch<SetStateAction<string>>;
//   updateOptions: Dispatch<SetStateAction<UseFetchOptions>>;
//   updateRequestOptions: Dispatch<SetStateAction<RequestInit | undefined>>;
// };

// export default function useFetch<T>(
//   initialUrl: string,
//   initialRequestOptions?: RequestInit,
//   initialOptions?: UseFetchOptions,
// ): UseFetchReturn<T> {
//   // second test
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setloading] = useState(false);
//   const [data, setData] = useState<T | null>(null);// means this generic data can be of type T or null
//   const [Options, updateOptions] = useState(initialOptions || { immediate: true });// id dont pass any option then immediate will be the default option
//   const [requestOptions, updateRequestOptions] = useState(initialRequestOptions);
//   const [url, updateUrl] = useState(initialUrl);
//   // const [abortController, setAbortController] = useState(new AbortController());// paiing new instance of abort conroller anf making our own abort controller

//   // instead of above abort controller state use ref
//   const abortController = useRef(new AbortController());

//   const load = useCallback (async () => {
//     // to cancle previous request if it is not completed
//     abortController.current.abort();
//     abortController.current = new AbortController();

//     // and set new abortcontroller
//     // setAbortController(new AbortController());
//     // setData(null);

//     // for  Cleanup on Unmount

//     setData(null); // Clear data state

//     if (!url) {
//       setError("Empty URL");
//       setloading(false);
//       return;
//     }
//     else {
//       setError(null);
//     }
//     setloading(true);
//     try {
//       const requestInit = (requestOptions || {});
//       requestInit.signal = abortController.current.signal;
//       const currentAbortController = abortController.current;

//       const response = await fetch(url, requestOptions);

//       // HTTP Error Handling
//       if (!response.ok) {
//         // If the response is not successful, throw an error
//         throw new Error(response.statusText);
//       }

//       const json = await response.json();

//       if (currentAbortController.signal.aborted) {
//         return;
//       }
//       setData(json);
//     }
//     catch (e) {
//       const error = e as Error;
//       if (error.name === "AbortError") {
//         setData(null);
//         setError(null); // Signal that the request was aborted
//         // return;
//       }
//       else {
//         setError(error.message);
//       }
//     }

//     setloading(false);
//   }, [url, requestOptions]);

//   // first test
//   useEffect(() => {
//     if (Options.immediate) {
//       load();
//     }

//     // to abort a req in progress if unmounted
//     return () => {
//       abortController.current.abort(); // Abort ongoing requests
//     };
//   }, [load, Options]);

//   return {
//     url,
//     loading,
//     error,
//     data,
//     load,
//     updateUrl,
//     updateOptions,
//     updateRequestOptions,
//   };
// }

import { useCallback, useEffect, useRef, useState } from "react";

export type UseFetchOptions = {
  immediate?: boolean;
};

export type UseFetchReturn<T> = {
  loading: boolean;
  error: string | null;
  data: T | null;
  url: string;
  load: () => Promise<void>;
  updateUrl: React.Dispatch<React.SetStateAction<string>>;
  updateOptions: React.Dispatch<React.SetStateAction<UseFetchOptions>>;
  updateRequestOptions: React.Dispatch<React.SetStateAction<RequestInit | undefined>>;
};

export default function useFetch<T>(
  initialUrl: string,
  initialRequestOptions?: RequestInit,
  initialOptions?: UseFetchOptions,
): UseFetchReturn<T> {
  const [url, updateUrl] = useState(initialUrl);
  const [options, updateOptions] = useState(initialOptions || { immediate: true });
  const [requestOptions, updateRequestOptions] = useState<RequestInit | undefined>(initialRequestOptions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const abortController = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    if (!url.trim()) {
      setError("Empty URL");
      setLoading(false);
      return;
    }

    if (abortController.current) {
      abortController.current.abort();
    }

    abortController.current = new AbortController();
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(url, {
        ...requestOptions,
        signal: abortController.current.signal,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const json = await response.json();
      setData(json);
    }
    catch (e: unknown) {
      const error = e as Error;
      if (error.name !== "AbortError") {
        setError(error.message);
      }
    }
    finally {
      setLoading(false);
    }
  }, [url, requestOptions]);

  useEffect(() => {
    if (options.immediate) {
      load();
    }

    return () => {
      abortController.current?.abort();
    };
  }, [load, options]);

  return {
    url,
    loading,
    error,
    data,
    load,
    updateUrl,
    updateOptions,
    updateRequestOptions,
  };
}
