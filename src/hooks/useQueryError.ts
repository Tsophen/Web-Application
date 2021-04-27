import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react"

/**
 * A React hook to retrieve an error message from the Query Variables
 * Example: https://domain.com/page?error=MY_ERROR
 * For the above example, this hook will parse the error to MY_ERROR
 * 
 * @returns error object with the error value & #setError function to set the error 
 */
const useQueryError = (): { error: string | undefined, setError: Dispatch<SetStateAction<string | undefined>> } => {
  const location = useRouter();

  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if(location.query.error)
      setError(location.query.error.toString());
  });

  return { error, setError }
}

export default useQueryError;