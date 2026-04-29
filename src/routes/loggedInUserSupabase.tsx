import  supabase  from '../../provider/supabase'
import { Outlet, useNavigate } from "react-router"
import { type LoaderFunctionArgs, redirect, useLoaderData } from 'react-router'
import type { Route } from "./+types/loggedInUserSupabase";
import { useSupabaseData } from "../types/SupabaseContext";

//const { session } = useSupabaseData();
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    const url = new URL(request.url)
    throw redirect(`/login?redirectTo=${encodeURIComponent(url.pathname)}`)
  }

  return data
}

export default function ProtectedPage() {
  let data = useLoaderData<typeof clientLoader>()
  //const { session } = useSupabaseData();
  //const trial = JSON.stringify(session)

  return (
    <div>
      <Outlet />
    </div>
  )
}