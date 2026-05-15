import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db, users, automations } from '@/lib/db'
import { eq } from 'drizzle-orm'

// SETUP ISTANTANEO IN 6 SECONDI!
export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { email, name } = await request.json()

    // 1. Crea/aggiorna user in Neon
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1)

    let dbUserId: number

    if (existingUser.length === 0) {
      // Nuovo user - crea tutto!
      const [newUser] = await db.insert(users).values({
        clerkId: userId,
        email,
        name,
        twilioConfigured: true, // Usiamo le nostre credenziali Twilio
        resendConfigured: true, // Usiamo le nostre credenziali Resend
        plan: 'trial',
        subscriptionEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 giorni trial
      }).returning()

      dbUserId = newUser.id

      // 2. Crea automazione di default ATTIVA
      await db.insert(automations).values({
        userId: dbUserId,
        name: 'Automazione Principale',
        active: true, // SEMPRE ATTIVA!
        sourceType: 'manual', // Inizia con upload manuale
        checkInterval: 15,
        emailTemplate: `
          <h2>Ciao {name}!</h2>
          <p>{message}</p>
          <p>---<br>
          Il tuo coach</p>
        `,
        whatsappTemplate: 'Ciao {name}! {message}',
        nextRunAt: new Date(Date.now() + 15 * 60 * 1000)
      })
    } else {
      dbUserId = existingUser[0].id
    }

    // 3. Ritorna successo con istruzioni
    return NextResponse.json({
      success: true,
      userId: dbUserId,
      message: 'Account configurato! Automazione attiva.',
      instructions: {
        step1: 'Carica i tuoi contatti (CSV o connetti Airtable)',
        step2: 'I messaggi partiranno automaticamente ogni 15 minuti',
        step3: 'Monitora tutto dalla dashboard'
      },
      trial: {
        daysLeft: 14,
        contactsIncluded: 1000,
        messagesPerDay: 'Illimitati'
      }
    })

  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Setup failed', details: error },
      { status: 500 }
    )
  }
}