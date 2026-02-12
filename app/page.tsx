'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ClipboardList, 
  Sparkles, 
  Clock, 
  ArrowRight,
  History,
  FileText,
  AlertCircle,
  Loader2,
  Plus,
  Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ActionItemCard } from '@/components/ActionItemCard'

interface ActionItem {
  id: string
  task: string
  owner: string | null
  dueDate: string | null
  tags: string | null
  isCompleted: boolean
}

interface Transcript {
  id: string
  content: string
  createdAt: string
  actionItems: ActionItem[]
}

export default function Home() {
  const [transcriptText, setTranscriptText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTranscript, setCurrentTranscript] = useState<Transcript | null>(null)
  const [history, setHistory] = useState<Transcript[]>([])
  const [filter, setFilter] = useState<'all' | 'open' | 'done'>('all')

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/transcripts')
      const data = await res.json()
      if (Array.isArray(data)) {
        setHistory(data)
      }
    } catch (err) {
      console.error('Failed to fetch history', err)
    }
  }

  const handleProcess = async () => {
    if (!transcriptText.trim()) return

    setIsLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/transcripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: transcriptText })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to process transcript')
      }

      const data = await res.json()
      setCurrentTranscript(data)
      setTranscriptText('')
      fetchHistory()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleItem = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/action-items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !current })
      })
      if (res.ok) {
        // Optimistic update
        const updateList = (list: Transcript[]) => list.map(t => ({
          ...t,
          actionItems: t.actionItems.map(item => 
            item.id === id ? { ...item, isCompleted: !current } : item
          )
        }))

        if (currentTranscript) {
          setCurrentTranscript({
            ...currentTranscript,
            actionItems: currentTranscript.actionItems.map(item => 
              item.id === id ? { ...item, isCompleted: !current } : item
            )
          })
        }
        setHistory(updateList(history))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    try {
      const res = await fetch(`/api/action-items/${id}`, { method: 'DELETE' })
      if (res.ok) {
        const filterList = (list: Transcript[]) => list.map(t => ({
          ...t,
          actionItems: t.actionItems.filter(item => item.id !== id)
        }))

        if (currentTranscript) {
          setCurrentTranscript({
            ...currentTranscript,
            actionItems: currentTranscript.actionItems.filter(item => item.id !== id)
          })
        }
        setHistory(filterList(history))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const editItem = async (id: string, currentTask: string) => {
    const newTask = prompt('Edit task:', currentTask)
    if (!newTask || newTask === currentTask) return

    try {
      const res = await fetch(`/api/action-items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newTask })
      })
      if (res.ok) {
        const updateList = (list: Transcript[]) => list.map(t => ({
          ...t,
          actionItems: t.actionItems.map(item => 
            item.id === id ? { ...item, task: newTask } : item
          )
        }))

        if (currentTranscript) {
          setCurrentTranscript({
            ...currentTranscript,
            actionItems: currentTranscript.actionItems.map(item => 
              item.id === id ? { ...item, task: newTask } : item
            )
          })
        }
        setHistory(updateList(history))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddTask = async () => {
    if (!currentTranscript) return
    const task = prompt('Enter new task:')
    if (!task) return
    const owner = prompt('Enter owner (optional):') || null
    const tags = prompt('Enter tags (comma-separated, optional):') || null

    try {
      const res = await fetch(`/api/transcripts/${currentTranscript.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, owner, tags })
      })
      if (res.ok) {
        const newItem = await res.json()
        if (currentTranscript) {
          setCurrentTranscript({
            ...currentTranscript,
            actionItems: [...currentTranscript.actionItems, newItem]
          })
        }
        fetchHistory()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filteredItems = currentTranscript?.actionItems.filter(item => {
    if (filter === 'open') return !item.isCompleted
    if (filter === 'done') return item.isCompleted
    return true
  }) || []

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-16 px-4 bg-white border-b overflow-hidden relative">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-primary-50 text-primary-700 mb-6 border border-primary-100">
              <Sparkles className="w-4 h-4 mr-2" />
              Intelligence Layer Active
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 font-outfit">
              Meeting Notes to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
                Actionable Tasks
              </span>
            </h1>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 translate-x-1/2" />
      </section>

      {/* Main Content */}
      <section className="w-full py-12 px-4 bg-slate-50/50 min-h-[600px]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-600" />
                    New Transcript
                  </h3>
                  <div className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Real-time AI Processing
                  </div>
                </div>

                <div className="relative group">
                  <textarea
                    value={transcriptText}
                    onChange={(e) => setTranscriptText(e.target.value)}
                    disabled={isLoading}
                    className="w-full h-80 p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 focus:bg-white transition-all duration-300 resize-none font-mono text-sm leading-relaxed"
                    placeholder="Paste your meeting notes here. AI will extract tasks, owners, and due dates automatically..."
                  />
                  {isLoading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                        <p className="font-bold text-primary-900">AI is thinking...</p>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 text-sm font-medium">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div className="mt-8">
                  <button 
                    onClick={handleProcess}
                    disabled={!transcriptText.trim() || isLoading}
                    className="w-full group relative overflow-hidden bg-primary-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                       {isLoading ? 'Processing...' : 'Generate Action Items'}
                       {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Current Result */}
            <AnimatePresence>
              {currentTranscript && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[2rem] shadow-xl shadow-primary-100/30 border-2 border-primary-50 overflow-hidden"
                >
                  <div className="bg-primary-600 p-6 text-white flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Extraction Result</h3>
                      <p className="text-primary-100 text-sm font-medium">Found {currentTranscript.actionItems.length} items</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handleAddTask}
                        className="p-2 hover:bg-white/10 rounded-lg text-white"
                        title="Add Task Manually"
                      >
                         <Plus className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="px-8 pt-6 pb-2 border-b border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Filter Items</span>
                     </div>
                     <div className="flex bg-slate-100 p-1 rounded-xl">
                        {['all', 'open', 'done'].map((f) => (
                          <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={cn(
                              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                              filter === f ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                          >
                            {f.toUpperCase()}
                          </button>
                        ))}
                     </div>
                  </div>

                  <div className="p-8 space-y-4">
                    {filteredItems.length > 0 ? (
                      filteredItems.map(item => (
                        <ActionItemCard 
                          key={item.id} 
                          item={item} 
                          onToggle={toggleItem}
                          onDelete={deleteItem}
                          onEdit={editItem}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12 text-slate-400">
                        <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-bold">No {filter !== 'all' ? filter : ''} action items found.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: History */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-indigo-600" />
                    Recent Activity
                  </h3>
               </div>

               <div className="space-y-4">
                 {history.length > 0 ? (
                   history.map((item, i) => (
                     <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={cn(
                          "p-6 rounded-3xl border transition-all cursor-pointer group shadow-sm hover:shadow-md",
                          currentTranscript?.id === item.id 
                            ? "bg-indigo-50 border-indigo-200" 
                            : "bg-white border-slate-100 hover:border-indigo-100"
                        )}
                        onClick={() => setCurrentTranscript(item)}
                     >
                        <div className="flex justify-between items-start mb-3">
                           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                              <Clock className="w-3 h-3" />
                              {new Date(item.createdAt).toLocaleDateString()}
                           </div>
                           <div className="px-2 py-0.5 bg-slate-50 rounded text-[10px] font-bold text-slate-500">
                             {item.actionItems.length} ITEMS
                           </div>
                        </div>
                        <p className="text-gray-900 font-bold line-clamp-2 mb-2 leading-relaxed">
                          {item.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:gap-2 transition-all">
                           Review Items <ArrowRight className="w-3 h-3" />
                        </div>
                     </motion.div>
                   ))
                 ) : (
                   <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <History className="w-8 h-8" />
                      </div>
                      <p className="text-slate-500 font-bold">No history yet</p>
                   </div>
                 )}
               </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
