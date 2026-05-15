'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  Users
} from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
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
    // Mock OAuth - in produzione usa Google OAuth
    setTimeout(() => {
      setConnections(prev => ({ ...prev, googleSheets: true }))
    }, 1000)
  }

  const connectGmail = () => {
    // Mock OAuth
    setTimeout(() => {
      setConnections(prev => ({ ...prev, gmail: true }))
    }, 1000)
  }

  const connectWhatsApp = () => {
    // Mock WhatsApp Business API connection
    setTimeout(() => {
      setConnections(prev => ({ ...prev, whatsapp: true }))
    }, 1000)
  }

  const toggleAutomation = () => {
    if (connections.googleSheets && (connections.gmail || connections.whatsapp)) {
      setAutomationActive(!automationActive)
      if (!automationActive) {
        // Start mock automation
        setStats(prev => ({ ...prev, lastRun: new Date() }))
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  const allConnected = connections.googleSheets && connections.gmail && connections.whatsapp

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-purple-600">Plumeo</div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${automationActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {automationActive ? 'Automazione Attiva' : 'Automazione Pausata'}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-5 h-5" />
            Esci
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.emailsSent}</span>
            </div>
            <p className="text-gray-600">Email Inviate Oggi</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <MessageCircle className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.whatsappSent}</span>
            </div>
            <p className="text-gray-600">WhatsApp Inviati Oggi</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">
                {stats.lastRun ? new Date(stats.lastRun).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </span>
            </div>
            <p className="text-gray-600">Ultimo Controllo</p>
          </div>
        </div>

        {/* Connection Cards */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Connetti i tuoi Servizi</h2>

          <div className="space-y-6">
            {/* Google Sheets */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${connections.googleSheets ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <FileSpreadsheet className={`w-6 h-6 ${connections.googleSheets ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Google Sheets</h3>
                  <p className="text-sm text-gray-600">
                    {connections.googleSheets ? 'Connesso - Sheet: Marketing Automation' : 'Connetti il tuo foglio Google'}
                  </p>
                </div>
              </div>
              {connections.googleSheets ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Connesso</span>
                </div>
              ) : (
                <button
                  onClick={connectGoogleSheets}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Connetti
                </button>
              )}
            </div>

            {/* Gmail */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${connections.gmail ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Mail className={`w-6 h-6 ${connections.gmail ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Gmail</h3>
                  <p className="text-sm text-gray-600">
                    {connections.gmail ? 'Connesso - coach@gmail.com' : 'Connetti la tua email business'}
                  </p>
                </div>
              </div>
              {connections.gmail ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Connesso</span>
                </div>
              ) : (
                <button
                  onClick={connectGmail}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Connetti
                </button>
              )}
            </div>

            {/* WhatsApp */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${connections.whatsapp ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <MessageCircle className={`w-6 h-6 ${connections.whatsapp ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">WhatsApp Business</h3>
                  <p className="text-sm text-gray-600">
                    {connections.whatsapp ? 'Connesso - +39 333 1234567' : 'Connetti WhatsApp Business'}
                  </p>
                </div>
              </div>
              {connections.whatsapp ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Connesso</span>
                </div>
              ) : (
                <button
                  onClick={connectWhatsApp}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Connetti
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Automation Control */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Controllo Automazione</h2>
              <p className="text-gray-600 mt-1">L'automazione controlla il tuo Sheet ogni 15 minuti</p>
            </div>
            <button
              onClick={toggleAutomation}
              disabled={!connections.googleSheets || (!connections.gmail && !connections.whatsapp)}
              className={`
                flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition
                ${automationActive
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : allConnected
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {automationActive ? (
                <>
                  <Pause className="w-5 h-5" />
                  Ferma Automazione
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Avvia Automazione
                </>
              )}
            </button>
          </div>

          {!allConnected && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>Attenzione:</strong> Connetti almeno Google Sheets e uno tra Gmail o WhatsApp per avviare l'automazione.
              </p>
            </div>
          )}

          {automationActive && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                <strong>Automazione Attiva!</strong> Il sistema sta controllando il tuo Sheet ogni 15 minuti e inviando messaggi automaticamente.
              </p>
            </div>
          )}
        </div>

        {/* Quick Setup Guide */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Come Funziona?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="bg-white/20 rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
                <span className="font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Prepara il tuo Sheet</h4>
                <p className="text-sm text-white/80">Crea colonne: Nome, Email, Telefono, Stato, Messaggio</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-white/20 rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
                <span className="font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Aggiungi Contatti</h4>
                <p className="text-sm text-white/80">Inserisci i tuoi clienti con stato "Da Contattare"</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-white/20 rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
                <span className="font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Rilassati</h4>
                <p className="text-sm text-white/80">CoachFlow invia automaticamente email e WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}