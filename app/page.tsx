'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Zap, Users, ArrowRight, CheckCircle, DollarSign } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGetStarted = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    router.push('/register')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
      <div className="absolute inset-0 bg-black/20" />

      {/* Hero Section */}
      <div className="relative z-10">
        <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
          <div className="text-2xl font-bold text-white">CoachFlow</div>
          <button
            onClick={() => router.push('/login')}
            className="bg-white/10 backdrop-blur border border-white/20 text-white px-6 py-2 rounded-lg hover:bg-white/20 transition"
          >
            Accedi
          </button>
        </nav>

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold text-white mb-6">
              Automatizza il tuo Coaching in <span className="text-yellow-300">30 Secondi</span>
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Connetti Google Sheets → Email → WhatsApp. <br/>
              Automazione che gira ogni 15 minuti. Zero competenze tecniche.
            </p>

            {/* CTA Form */}
            <form onSubmit={handleGetStarted} className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="La tua email"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 bg-white shadow-xl"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold hover:bg-yellow-300 transition shadow-xl flex items-center gap-2"
              >
                Inizia Gratis <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <p className="text-white/70 text-sm mt-4">Prova gratuita 14 giorni. Nessuna carta richiesta.</p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8">
              <div className="bg-yellow-400 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Setup in 1 Click</h3>
              <p className="text-white/80">
                Connetti Google Sheets, Gmail e WhatsApp Business con un singolo click. Nessuna API key, nessun codice.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8">
              <div className="bg-yellow-400 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-7 h-7 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Automazione Smart</h3>
              <p className="text-white/80">
                Ogni 15 minuti controlla il tuo Sheet e invia email/WhatsApp automaticamente. Perfetto per follow-up clienti.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8">
              <div className="bg-yellow-400 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Per Coach Seri</h3>
              <p className="text-white/80">
                Pensato per coach e consultant che vogliono scalare senza perdere tempo in task ripetitivi.
              </p>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mt-32 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Prezzo Semplice, Risultati Potenti</h2>
            <p className="text-xl text-white/80 mb-12">Scelto da 500+ coach che fatturano 10k+/mese</p>

            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
              <div className="flex items-baseline justify-center mb-6">
                <span className="text-5xl font-bold text-gray-900">€197</span>
                <span className="text-gray-600 ml-2">/mese</span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Connessioni illimitate Google Sheets',
                  'Email illimitate via Gmail',
                  'WhatsApp Business integrato',
                  'Automazioni ogni 15 minuti',
                  'Dashboard analytics',
                  'Support prioritario',
                ].map((feature) => (
                  <li key={feature} className="flex items-center text-left">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => router.push('/register')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-bold hover:shadow-lg transition"
              >
                Inizia Prova Gratuita
              </button>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-24 text-center">
            <p className="text-white/60 mb-8">Trusted by coaches from</p>
            <div className="flex justify-center items-center gap-12 opacity-60">
              {['Tony Robbins Academy', 'ICF', 'Grant Cardone', 'Tai Lopez'].map((name) => (
                <div key={name} className="text-white font-semibold text-lg">{name}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
