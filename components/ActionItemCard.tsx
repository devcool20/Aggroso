'use client'

import { CheckCircle2, Circle, Trash2, Edit2, Calendar, User, Tag } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { motion } from 'framer-motion'

interface ActionItem {
  id: string
  task: string
  owner: string | null
  dueDate: string | null
  tags: string | null
  isCompleted: boolean
}

export function ActionItemCard({ 
  item, 
  onToggle, 
  onDelete, 
  onEdit 
}: { 
  item: ActionItem
  onToggle: (id: string, current: boolean) => void
  onDelete: (id: string) => void
  onEdit: (id: string, task: string) => void
}) {
  const tagsList = item.tags ? item.tags.split(',') : []

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "group flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300",
        item.isCompleted 
          ? "bg-slate-50 border-slate-100 opacity-70" 
          : "bg-white border-gray-100 hover:border-primary-100 hover:shadow-lg hover:shadow-primary-50/50"
      )}
    >
      <button 
        onClick={() => onToggle(item.id, item.isCompleted)}
        className={cn(
          "mt-1 transition-colors",
          item.isCompleted ? "text-emerald-500" : "text-gray-300 hover:text-primary-500"
        )}
      >
        {item.isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
      </button>

      <div className="flex-1">
        <h4 className={cn(
          "text-lg font-bold transition-all",
          item.isCompleted ? "text-gray-400 line-through" : "text-gray-900"
        )}>
          {item.task}
        </h4>
        
        <div className="flex flex-wrap gap-4 mt-3">
          {item.owner && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
              <User className="w-3 h-3" />
              {item.owner}
            </div>
          )}
          {item.dueDate && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold">
              <Calendar className="w-3 h-3" />
              {formatDate(item.dueDate)}
            </div>
          )}
          {tagsList.map((tag, i) => (
            <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wider">
              <Tag className="w-2.5 h-2.5" />
              {tag.trim()}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(item.id, item.task)}
          className="p-2 hover:bg-slate-100 rounded-xl text-gray-400 hover:text-primary-600 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDelete(item.id)}
          className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
