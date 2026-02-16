import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AddBookmark from '@/components/AddBookmark'
import BookmarkList from '@/components/BookmarkList'
import Header from '@/components/Header'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching bookmarks:", error)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-blue-500 selection:text-white">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>
      <div className="relative z-10">
      <Header userEmail={user.email} />
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-[350px_1fr] gap-12">
            <div className="lg:sticky lg:top-32 h-fit">
                <AddBookmark userId={user.id} />
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6 rounded-2xl mt-6 text-sm text-gray-400 border border-yellow-500/20 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-yellow-500/20 rounded-full blur-2xl"></div>
                    <p className="mb-2 font-bold text-yellow-500 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Pro Tip
                    </p>
                    <p className="leading-relaxed">Enter any URL and give it a memorable title. Your bookmarks sync in real-time across all your devices.</p>
                </div>
            </div>
            
            <div>
                <h2 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
                    Your Collection 
                    <span className="text-sm font-normal text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">{bookmarks?.length || 0}</span>
                </h2>
                <BookmarkList initialBookmarks={bookmarks || []} userId={user.id} />
            </div>
        </div>
      </main>
      </div>
    </div>
  )
}
