'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AddBookmark({ userId }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.from('bookmarks').insert({
      title,
      url,
      user_id: userId,
    })

    if (!error) {
      setTitle('')
      setUrl('')
      router.refresh()
    } else {
      console.error(error)
      alert('Failed to add bookmark')
    }
    setLoading(false)
  }

  return (
    <div className="bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-700/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </div>
        <h2 className="text-xl font-bold text-white">Add New Bookmark</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Title</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <input 
                type="text" 
                placeholder="e.g. My Favorite Blog" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-600" 
                required 
                />
            </div>
        </div>

        <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">URL</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </div>
                <input 
                type="url" 
                placeholder="https://example.com" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-600" 
                required 
                />
            </div>
        </div>

        <button 
          type="submit" 
          className="mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3.5 rounded-lg font-bold transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 shadow-lg shadow-blue-500/20"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
            </span>
          ) : 'Save Bookmark'}
        </button>
      </form>
    </div>
  )
}
