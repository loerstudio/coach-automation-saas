'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  FileSpreadsheet,
  Mail,
  MessageCircle,
  Check,
  X,
  Settings,
  Play,
  Pause,
  LogOut,
  Zap,
  Clock,
  Users,
  BarChart3,
  Home,
  Database,
  Sparkles,
  Bell,
  Search,
  UserCircle,
  Menu,
  ChevronDown
} from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [connections, setConnections] = useState({
    googleSheets: false,
    gmail: false,
    whatsapp: false
  })
  const [automationActive, setAutomationActive] = useState(false)
  const [stats, setStats] = useState({
    emailsSent: 0,
    whatsappSent: 0,
    lastRun: null as Date | null
  })

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/login')
    }
  }, [router])

  const connectGoogleSheets = () => {
    setTimeout(() => {
      setConnections(prev => ({ ...prev, googleSheets: true }))
    }, 1000)
  }

  const connectGmail = () => {
    setTimeout(() => {
      setConnections(prev => ({ ...prev, gmail: true }))
    }, 1000)
  }

  const connectWhatsApp = () => {
    setTimeout(() => {
      setConnections(prev => ({ ...prev, whatsapp: true }))
    }, 1000)
  }

  const toggleAutomation = () => {
    if (connections.googleSheets && (connections.gmail || connections.whatsapp)) {
      setAutomationActive(!automationActive)
      if (!automationActive) {
        setStats(prev => ({ ...prev, lastRun: new Date() }))
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  const allConnected = connections.googleSheets && connections.gmail && connections.whatsapp

  const navigation = [
    { name: 'Dashboard', icon: Home, current: true },
    { name: 'Automazioni', icon: Zap, current: false },
    { name: 'Contatti', icon: Users, current: false },
    { name: 'Analytics', icon: BarChart3, current: false },
    { name: 'Integrazioni', icon: Database, current: false },
    { name: 'Impostazioni', icon: Settings, current: false },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-slate-200 dark:border-slate-800 animate-slide-in-left">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg flex items-center justify-center animate-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Plumeo
            </span>
            <Badge variant="secondary" className="ml-auto transition-colors duration-200 hover:bg-green-100 hover:text-green-800 dark:hover:bg-green-950 dark:hover:text-green-200">Pro</Badge>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item, index) => (
              <a
                key={item.name}
                href="#"
                className={`
                  flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 animate-slide-in-left
                  ${item.current
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800'
                  }
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                {item.name}
              </a>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 p-2">
              <UserCircle className="w-8 h-8 text-slate-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  Coach Pro
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  coach@plumeo.com
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="p-1 h-auto"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden"
                >
                  <Menu className="w-5 h-5" />
                </Button>

                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Monitora le tue automazioni e performance
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge
                  variant={automationActive ? "default" : "secondary"}
                  className={automationActive ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {automationActive ? 'Attiva' : 'Pausata'}
                </Badge>

                <ThemeToggle />

                <Button variant="ghost" size="sm">
                  <Bell className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-in-up">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Email Inviate</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.emailsSent}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-center justify-center transition-transform hover:scale-110">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">WhatsApp Inviati</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.whatsappSent}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 dark:bg-green-950 rounded-lg flex items-center justify-center transition-transform hover:scale-110">
                    <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Ultimo Controllo</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.lastRun ? new Date(stats.lastRun).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-violet-50 dark:bg-violet-950 rounded-lg flex items-center justify-center transition-transform hover:scale-110">
                    <Clock className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Integrations */}
          <Card>
            <CardHeader>
              <CardTitle>Integrazioni</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Connetti i tuoi servizi per iniziare l'automazione
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Google Sheets */}
              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    connections.googleSheets ? 'bg-green-50 dark:bg-green-950' : 'bg-slate-50 dark:bg-slate-900'
                  }`}>
                    <FileSpreadsheet className={`w-6 h-6 ${
                      connections.googleSheets ? 'text-green-600 dark:text-green-400' : 'text-slate-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Google Sheets</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {connections.googleSheets ? 'Connesso - Marketing Automation' : 'Connetti il tuo foglio Google'}
                    </p>
                  </div>
                </div>
                {connections.googleSheets ? (
                  <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 dark:text-green-300 dark:border-green-800 dark:bg-green-950">
                    <Check className="w-4 h-4 mr-1" />
                    Connesso
                  </Badge>
                ) : (
                  <Button onClick={connectGoogleSheets}>
                    Connetti
                  </Button>
                )}
              </div>

              {/* Gmail */}
              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    connections.gmail ? 'bg-green-50 dark:bg-green-950' : 'bg-slate-50 dark:bg-slate-900'
                  }`}>
                    <Mail className={`w-6 h-6 ${
                      connections.gmail ? 'text-green-600 dark:text-green-400' : 'text-slate-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Gmail</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {connections.gmail ? 'Connesso - coach@gmail.com' : 'Connetti la tua email business'}
                    </p>
                  </div>
                </div>
                {connections.gmail ? (
                  <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 dark:text-green-300 dark:border-green-800 dark:bg-green-950">
                    <Check className="w-4 h-4 mr-1" />
                    Connesso
                  </Badge>
                ) : (
                  <Button onClick={connectGmail}>
                    Connetti
                  </Button>
                )}
              </div>

              {/* WhatsApp */}
              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    connections.whatsapp ? 'bg-green-50 dark:bg-green-950' : 'bg-slate-50 dark:bg-slate-900'
                  }`}>
                    <MessageCircle className={`w-6 h-6 ${
                      connections.whatsapp ? 'text-green-600 dark:text-green-400' : 'text-slate-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">WhatsApp Business</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {connections.whatsapp ? 'Connesso - +39 333 1234567' : 'Connetti WhatsApp Business'}
                    </p>
                  </div>
                </div>
                {connections.whatsapp ? (
                  <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 dark:text-green-300 dark:border-green-800 dark:bg-green-950">
                    <Check className="w-4 h-4 mr-1" />
                    Connesso
                  </Badge>
                ) : (
                  <Button onClick={connectWhatsApp}>
                    Connetti
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Automation Control */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Controllo Automazione</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    L'automazione controlla il tuo Sheet ogni 15 minuti
                  </p>
                </div>
                <Button
                  onClick={toggleAutomation}
                  disabled={!connections.googleSheets || (!connections.gmail && !connections.whatsapp)}
                  variant={automationActive ? "destructive" : "default"}
                  className={!allConnected && !automationActive ? "opacity-50 cursor-not-allowed" : ""}
                >
                  {automationActive ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Ferma
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Avvia
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!allConnected && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-amber-800 dark:text-amber-200 text-sm">
                    <strong>Attenzione:</strong> Connetti almeno Google Sheets e uno tra Gmail o WhatsApp per avviare l'automazione.
                  </p>
                </div>
              )}

              {automationActive && (
                <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    <strong>Automazione Attiva!</strong> Il sistema sta controllando il tuo Sheet ogni 15 minuti e inviando messaggi automaticamente.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Setup Guide */}
          <Card className="bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-white">Come Funziona?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex gap-3">
                  <div className="bg-white/20 rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-white">Prepara il tuo Sheet</h4>
                    <p className="text-sm text-white/80">Crea colonne: Nome, Email, Telefono, Stato, Messaggio</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-white/20 rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-white">Aggiungi Contatti</h4>
                    <p className="text-sm text-white/80">Inserisci i tuoi clienti con stato "Da Contattare"</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-white/20 rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-white">Rilassati</h4>
                    <p className="text-sm text-white/80">Plumeo invia automaticamente email e WhatsApp</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}