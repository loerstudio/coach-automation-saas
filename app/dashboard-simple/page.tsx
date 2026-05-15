'use client'

import { useState, useEffect } from 'react'
import { Upload, Send, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react'

export default function SimpleDashboard() {
  const [contacts, setContacts] = useState<any[]>([])
  const [sending, setSending] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    failed: 0
  })

  // Carica CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n')
      const headers = lines[0].split(',').map(h => h.trim())

      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim())
        const obj: any = {}
        headers.forEach((header, i) => {
          obj[header] = values[i]
        })
        return obj
      }).filter(row => row.name || row.Name)

      setContacts(data)
      setStats({ ...stats, total: data.length })
    }
    reader.readAsText(file)
  }

  // Invia messaggi
  const sendMessages = async () => {
    setSending(true)
    let sent = 0
    let failed = 0

    for (const contact of contacts) {
      try {
        const response = await fetch('/api/send-instant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: contact.name || contact.Name,
            email: contact.email || contact.Email,
            phone: contact.phone || contact.Phone || contact.WhatsApp,
            message: contact.message || contact.Message || `Ciao ${contact.name || contact.Name}! Ho un messaggio importante per te.`
          })
        })

        if (response.ok) {
          sent++
          setStats(prev => ({ ...prev, sent: sent }))
        } else {
          failed++
          setStats(prev => ({ ...prev, failed: failed }))
        }
      } catch (error) {
        failed++
        setStats(prev => ({ ...prev, failed: failed }))
      }
    }

    setSending(false)
    alert(`Invio completato! ✅ Inviati: ${sent}, ❌ Falliti: ${failed}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Plumeo - Dashboard</h1>
        <p className="text-gray-600 mb-8">Carica CSV e invia Email + WhatsApp istantaneamente</p>

        {/* Upload CSV */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-purple-600" />
            Carica Contatti (CSV)
          </h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Carica un file CSV con colonne: Name, Email, Phone, Message
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-purple-700 transition inline-block"
            >
              Seleziona CSV
            </label>
          </div>

          {contacts.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ {contacts.length} contatti caricati con successo!
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Totali</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Inviati</p>
            <p className="text-3xl font-bold text-green-600">{stats.sent}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Falliti</p>
            <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
          </div>
        </div>

        {/* Send Button */}
        {contacts.length > 0 && (
          <button
            onClick={sendMessages}
            disabled={sending}
            className={`
              w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2
              ${sending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg'
              } text-white transition
            `}
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Invio in corso... ({stats.sent}/{stats.total})
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Invia Email + WhatsApp a {contacts.length} contatti
              </>
            )}
          </button>
        )}

        {/* Info */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Come funziona:
          </h3>
          <ul className="text-yellow-800 space-y-1 text-sm">
            <li>• Email inviate con Resend (100/giorno gratis)</li>
            <li>• WhatsApp con Twilio ($0.005 per messaggio)</li>
            <li>• I contatti devono aver dato consenso per WhatsApp Twilio Sandbox</li>
            <li>• Formato CSV: Name,Email,Phone,Message</li>
          </ul>
        </div>
      </div>
    </div>
  )
}