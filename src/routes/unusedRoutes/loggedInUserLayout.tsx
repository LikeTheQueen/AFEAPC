// layouts/ProtectedLayout.tsx
import { Outlet, useNavigate } from "react-router"
import { useState, useEffect } from "react"
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import supabase from "provider/supabase"
import type { Session } from "@supabase/supabase-js"
//import { useSession } from "src/types/AuthContext"
import { type LoaderFunctionArgs, redirect, useLoaderData } from 'react-router'




export default function LoggedInUserLayout({ children }: { children: React.ReactNode }) {
  /*
  const session = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session === null) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [session, navigate]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
*/
  return( <>
  <div className="p-4 text-center">`Loading...`</div>
  <div className="border"><p className="text-black border font-semibold p-4 text-center"></p></div>
  <Outlet />
  </>
  );
}