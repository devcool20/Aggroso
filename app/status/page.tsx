'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  Database, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface HealthStatus {
  backend: 'healthy' | 'unhealthy' | 'checking'
  database: 'healthy' | 'unhealthy' | 'checking'
  llm: 'healthy' | 'unhealthy' | 'checking'
}

export default function StatusPage() {
  const [status, setStatus] = useState<HealthStatus>({
    backend: 'checking',
    database: 'checking',
    llm: 'checking',
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    checkHealth()
  }, [])

  const checkHealth = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({
        backend: 'unhealthy',
        database: 'unhealthy',
        llm: 'unhealthy',
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const services = [
    {
      id: 'backend',
      name: 'Backend API',
      desc: 'Next.js Edge Runtime & API Routes',
      icon: Cpu,
      value: status.backend,
    },
    {
      id: 'database',
      name: 'Storage Layer',
      desc: 'SQLite Database with Prisma ORM',
      icon: Database,
      value: status.database,
    },
    {
      id: 'llm',
      name: 'AI Engine',
      desc: 'Google Gemini 2.0 Flash',
      icon: Activity,
      value: status.llm,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 font-outfit mb-2">System Health</h1>
          <p className="text-gray-600 text-lg">
            Real-time monitoring of our core infrastructure and AI connections.
          </p>
        </div>
        <button
          onClick={checkHealth}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={cn("w-5 h-5", isRefreshing && "animate-spin")} />
          {isRefreshing ? 'Checking...' : 'Refresh Status'}
        </button>
      </div>

      <div className="grid gap-6">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "relative overflow-hidden group p-8 rounded-[2rem] border-2 transition-all duration-300",
              service.value === 'healthy' 
                ? "bg-emerald-50/30 border-emerald-100 hover:border-emerald-200"
                : service.value === 'unhealthy'
                  ? "bg-red-50/30 border-red-100 hover:border-red-200"
                  : "bg-slate-50/30 border-slate-100 animate-pulse"
            )}
          >
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className={cn(
                  "p-4 rounded-2xl shadow-lg",
                  service.value === 'healthy' ? "bg-emerald-500 text-white" :
                  service.value === 'unhealthy' ? "bg-red-500 text-white" : "bg-slate-300 text-white"
                )}>
                  <service.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                  <p className="text-gray-600 font-medium">{service.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-5 py-2 rounded-full border border-current/10">
                {service.value === 'healthy' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-emerald-700 uppercase tracking-wider text-sm">Operational</span>
                  </>
                ) : service.value === 'unhealthy' ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-red-700 uppercase tracking-wider text-sm">Degraded</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-sm">Checking</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Background Accent */}
             <div className={cn(
               "absolute -right-8 -bottom-8 w-32 h-32 blur-3xl opacity-10 transition-opacity group-hover:opacity-20",
               service.value === 'healthy' ? "bg-emerald-500" : "bg-red-500"
             )} />
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-slate-900 rounded-[2rem] text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-xl font-bold mb-2">Automated Maintenance</h3>
            <p className="text-slate-400">
              Our systems perform self-healing checks every 60 seconds to ensure 99.9% uptime for your meeting operations.
            </p>
          </div>
          <div className="flex -space-x-3">
             {[1,2,3,4].map(i => (
               <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs font-bold">
                 {String.fromCharCode(64 + i)}
               </div>
             ))}
             <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-primary-600 flex items-center justify-center text-xs font-bold text-white">
               +12
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
