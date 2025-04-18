import { createContext, useContext, useEffect, useState } from "react";
import supabase from "provider/supabase";
import LoadingPage from "../routes/loadingPage";
import type { Session } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";


const SessionContext = createContext<Session | null>(null)

export function useAuth() {
  return useContext(SessionContext)
}

export function userStatus({ children }: {children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const {data: {subscription}} = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setSession(null)
        } else if (session) {
          setSession(session)
          
        }
      }
    )
    return () => {
      subscription?.unsubscribe()
    }
  }, [])
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  )

}

