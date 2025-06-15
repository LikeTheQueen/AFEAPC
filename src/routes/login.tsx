

import { useState, useEffect } from 'react'
import supabase from "provider/supabase";
import type { Session } from "@supabase/supabase-js";
import { useSupabaseData } from "../types/SupabaseContext";

//const { session } = useSupabaseData();
//const { loading } = useSupabaseData();

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  //const supabase = createClient()
  const [session, setSession] = useState<Session | null>()
  

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])
if(session) {
  location.href = '/mainscreen/afe'
}
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      // Update this route to redirect to an authenticated route. The user already has an active session.
      location.href = '/mainscreen'
    } catch (error: unknown) {
      setError(error instanceof Error ? error.name : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
    <div className="h-full bg-[var(--darkest-teal)] flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        alt="AFE Partner Connections"
        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
        className="mx-auto h-10 w-auto"
      />

    </div>
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form onSubmit={handleLogin} action="#" method="POST" className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm/6 font-medium text-white custom-style">
            Email
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm/6 font-medium text-white custom-style">
              Password
            </label>
            
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--bright-pink)] sm:text-sm/6"
            />
          </div>
          
        </div>
        
        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-[var(--bright-pink)] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)]" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        <div className="text-sm flex justify-end items-center mt-4">
              <a href="#" className="font-normal text-white hover:font-semibold hover:text-[var(--bright-pink)] custom-style-long-text">
                Forgot password?
              </a>
            </div>
      </form>
    </div>
  </div>
  </>
  )
}
