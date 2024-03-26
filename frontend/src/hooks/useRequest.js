import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "../store/loader-slice";
export const useRequest = () => {
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const [isError, setisError] = useState();
  const [exists, setExists] = useState(false);
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      dispatch(startLoading());
      setisLoading(true);
      try {
        let response;
        if (method === "GET") {
          response = await fetch(url, { method, headers });
         }
        else {
          response=await fetch(url, { method, body, headers });
        }
        const responseData = await response.json();
        if (!response.ok) {
          setExists(true);
          throw new Error(responseData.message);
        }
        setisLoading(false);
        dispatch(stopLoading());
        return responseData;
      } catch (err) {
        setExists(true);
        console.log(err.message);
        setisError(err.message);
        setisLoading(false);
        dispatch(stopLoading());
      }
    },
    [dispatch]
  );

  const clearError = () => {
    setExists(false);
    setisError(null);
  };

  return { isLoading, isError, sendRequest, clearError, exists };
};
