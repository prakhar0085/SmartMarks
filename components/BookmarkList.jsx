'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function BookmarkList({ initialBookmarks, userId }) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks)
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    setBookmarks(initialBookmarks)
  }, [initialBookmarks])

  useEffect(() => {
    const channel = supabase
      .channel('realtime-bookmarks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((curr) => [payload.new, ...curr])
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((curr) => curr.filter((bm) => bm.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setBookmarks((curr) => curr.map((bm) => (bm.id === payload.new.id ? payload.new : bm)))
          }
          router.refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId, router])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this bookmark?')) return
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredBookmarks = bookmarks.filter(bm => 
    bm.title.toLowerCase().includes(search.toLowerCase()) || 
    bm.url.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search your bookmarks..."
          className="w-full bg-gray-900/50 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {filteredBookmarks.map((bm) => {
          const domain = new URL(bm.url).hostname
          return (
            <div key={bm.id} className="bg-gray-800/40 backdrop-blur-md p-5 rounded-xl border border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-800/60 transition-all group relative flex flex-col h-full">
              
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-gray-700/50 p-1 flex-shrink-0 flex items-center justify-center">
                        <img 
                            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} 
                            alt="favicon" 
                            className="w-5 h-5"
                            onError={(e) => { e.target.style.display = 'none' }} 
                        />
                    </div>
                    <h3 className="font-semibold text-white truncate" title={bm.title}>{bm.title}</h3>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => handleCopy(bm.url, bm.id)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        title="Copy URL"
                    >
                        {copiedId === bm.id ? (
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        )}
                    </button>
                    <button 
                        onClick={() => handleDelete(bm.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
              </div>

              <a 
                href={bm.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-gray-400 hover:text-blue-400 break-all line-clamp-2 pl-[44px] mb-4 flex-grow transition-colors"
              >
                {domain}
              </a>

              <div className="pl-[44px] text-xs text-gray-600 font-medium">
                 {new Date(bm.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          )
        })}
      </div>

      {bookmarks.length === 0 && (
        <div className="col-span-full text-center text-gray-500 py-12 flex flex-col items-center justify-center p-8 bg-gray-900/30 rounded-2xl border border-gray-800 border-dashed">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No bookmarks yet</h3>
            <p className="text-sm text-gray-400 max-w-xs">Paste a URL on the left to get started with your collection.</p>
        </div>
      )}
      
      {bookmarks.length > 0 && filteredBookmarks.length === 0 && (
          <div className="text-center py-12 text-gray-400">
              No results found for "{search}"
          </div>
      )}
    </div>
  )
}
