import { Navigate, Outlet, useLocation } from "react-router-dom"

import { Loader } from "@/components/ui/Loader"
import { useAsyncData } from "@/hooks/useAsyncData"
import { fetchUserProfile } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"

export function AdminRoute() {
  const location = useLocation()
  const authed = isAuthenticated()
  const { data, loading, error } = useAsyncData(
    () => (authed ? fetchUserProfile() : Promise.resolve(null)),
    [authed],
  )

  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (error || data?.role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
