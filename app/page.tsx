'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  ArrowRight,
  Check,
  Zap,
  Mail,
  MessageSquare,
  Users,
  Clock,
  Star,
  Shield,
  Sparkles
} from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-xl dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Plumeo
              </span>
              <Badge variant="secondary" className="ml-2">
                Beta
              </Badge>
            </div>

            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-6">
                <a href="#features" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors">
                  Pricing
                </a>
              </div>
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={() => router.push('/login')}
              >
                Accedi
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 animate-fade-in">
              <Zap className="w-4 h-4 mr-2" />
              Automazione AI per Coach
            </Badge>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight animate-slide-in-up">
              Automatizza il tuo{' '}
              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                Coaching
              </span>{' '}
              in 30 secondi
            </h1>

            <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              Connetti Google Sheets → Email → WhatsApp. Automazione intelligente ogni 15 minuti.{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-100">Zero competenze tecniche.</span>
            </p>

            {/* CTA Form */}
            <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="La tua email business"
                className="flex-1 h-12 text-lg transition-all duration-200 hover:shadow-lg"
                required
              />
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 h-12 px-8 transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                {loading ? 'Iniziando...' : (
                  <>
                    Inizia Gratis <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-600" />
                14 giorni gratuiti
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-600" />
                Nessuna carta richiesta
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-green-600" />
                Setup istantaneo
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full blur-xl opacity-40 animate-float"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-violet-200 dark:bg-violet-800 rounded-full blur-xl opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-16 h-16 bg-indigo-200 dark:bg-indigo-800 rounded-full blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Tutto quello che serve per{' '}
              <span className="text-blue-600">scalare</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Un sistema completo per automatizzare follow-up, lead nurturing e client management.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden border-0 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50"></div>
              <CardHeader className="relative">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Setup in 1 Click</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Connetti Google Sheets, Gmail e WhatsApp Business con OAuth sicuro. Nessuna API key, nessuna configurazione complessa.
                </p>
                <div className="space-y-2">
                  {['Google Sheets integrato', 'Gmail OAuth sicuro', 'WhatsApp Business API'].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50"></div>
              <CardHeader className="relative">
                <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Automazione Smart</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  AI che monitora i tuoi Sheet ogni 15 minuti e invia automaticamente email + WhatsApp personalizzati.
                </p>
                <div className="space-y-2">
                  {['Check ogni 15 minuti', 'Messaggi personalizzati', 'Follow-up intelligente'].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50"></div>
              <CardHeader className="relative">
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Per Coach Vincenti</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Progettato per coach e consultant che fatturano 10k+/mese e vogliono scalare senza burnout.
                </p>
                <div className="space-y-2">
                  {['Multi-client', 'Analytics avanzate', 'Support prioritario'].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            Fidato da coach e mentor di successo
          </p>
          <div className="flex items-center justify-center gap-12 opacity-60">
            {[
              { name: 'ICF Certified', icon: Star },
              { name: 'NLP Trainers', icon: Users },
              { name: 'Business Coach', icon: Zap },
              { name: 'Life Coach', icon: Sparkles }
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <item.icon className="w-5 h-5" />
                <span className="font-semibold">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Prezzo semplice, risultati <span className="text-blue-600">potenti</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-12">
            Un piano che scala con te. Nessun limite nascosto.
          </p>

          <Card className="max-w-md mx-auto border-0 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl">Pro Coach</CardTitle>
              <div className="space-y-2">
                <div className="text-5xl font-bold">€197</div>
                <div className="text-slate-500 dark:text-slate-400">/mese</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  'Google Sheets illimitati',
                  'Email automation illimitata',
                  'WhatsApp Business integrato',
                  'Check ogni 15 minuti',
                  'Analytics avanzate',
                  'Support prioritario',
                  'Template personalizzabili',
                  'Multi-workspace'
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-left">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                onClick={() => router.push('/register')}
                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
              >
                Inizia Prova Gratuita
              </Button>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                14 giorni gratis · Cancella quando vuoi
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">Plumeo</span>
          </div>
          <p className="text-slate-400 mb-6">
            La piattaforma di automazione per coach che vogliono scalare.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}