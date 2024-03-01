import { useState, useCallback } from "react";
export const useRequest = () => {
  const [isLoading, setisLoading] = useState(false);
  const [isError, setisError] = useState();
  const [exists, setExists] = useState(false);
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setisLoading(true);
      try {
        const response = await fetch(url, { method, body, headers });
        const responseData = await response.json();
        if (!response.ok) {
          console.log(responseData);
          setisError(responseData);
          setExists(true);
          throw new Error(responseData.message);
        }

        setisLoading(false);
        return responseData;
      } catch (err) {
        setExists(true);
        setisError(err.message);
        setisLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setExists(false);
    setisError(null);
  };

  return { isLoading, isError, sendRequest, clearError, exists };
};
