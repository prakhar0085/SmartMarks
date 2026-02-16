'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Header({ userEmail }) {
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md">
      <div className="container mx-auto px-4 max-w-6xl py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 transform group-hover:rotate-12 transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          </div> 
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">SmartMarks</span>
        </div>
        <div className="flex items-center gap-6">
          {userEmail && (
              <div className="hidden sm:flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700/50">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  <span className="text-xs text-gray-300 font-medium">{userEmail}</span>
              </div>
          )}
          <button 
            onClick={handleSignOut}
            className="text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition-all border border-transparent hover:border-gray-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}
