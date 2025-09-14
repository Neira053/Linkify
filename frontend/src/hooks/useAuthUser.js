"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getAuthUser } from "../lib/api" // Ensure this path is correct

const useAuthUser = () => {
  const queryClient = useQueryClient()

  const authUserQuery = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, // auth check
    onError: (error) => {
      // If a 401 error occurs, invalidate the query to ensure state is cleared
      if (error.response?.status === 401) {
        console.log("[useAuthUser] 401 received, invalidating authUser query.")
        queryClient.setQueryData(["authUser"], null) // Explicitly set to null
      }
      // The axiosInstance interceptor in lib/axios.js will handle clearing localStorage/cookies and redirect
    },
    staleTime: 5 * 60 * 1000, // Optional: keep data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Optional: cache data for 10 minutes
  })

  return { 
    isLoading: authUserQuery.isLoading, 
    authUser: authUserQuery.data?.user, 
    error: authUserQuery.error 
  }
}
export default useAuthUser
