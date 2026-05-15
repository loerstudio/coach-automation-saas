import { NextResponse } from 'next/server'
import { db, users, contacts, automations, logs } from '@/lib/db'
import { eq, and } from 'drizzle-orm'
import twilio from 'twilio'
import { Resend } from 'resend'
import Airtable from 'airtable'

// Initialize services
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const resend = new Resend(process.env.RESEND_API_KEY)

// QUESTA È LA MAGIA: GIRA OGNI 15 MINUTI AUTOMATICAMENTE!
export async function GET(request: Request) {
  // Verifica cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Prendi TUTTE le automazioni attive
    const activeAutomations = await db
      .select()
      .from(automations)
      .where(eq(automations.active, true))

    console.log(`Processing ${activeAutomations.length} active automations`)

    const results = []

    for (const automation of activeAutomations) {
      try {
        // 1. Importa nuovi contatti dal CRM/Airtable se configurato
        if (automation.sourceType === 'airtable' && automation.sourceConfig) {
          await importFromAirtable(automation)
        }

        // 2. Processa tutti i contatti "to_contact" dell'utente
        const contactsToProcess = await db
          .select()
          .from(contacts)
          .where(
            and(
              eq(contacts.userId, automation.userId),
              eq(contacts.status, 'to_contact')
            )
          )
          .limit(50) // Max 50 per volta per evitare timeout

        let emailsSent = 0
        let whatsappSent = 0

        for (const contact of contactsToProcess) {
          // Invia Email
          if (contact.email && !contact.emailSent) {
            try {
              await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
                to: contact.email,
                subject: `Ciao ${contact.name}!`,
                html: automation.emailTemplate
                  ? automation.emailTemplate
                    .replace('{name}', contact.name || '')
                    .replace('{message}', contact.message || '')
                  : `<p>Ciao ${contact.name},<br><br>${contact.message || 'Ho un messaggio importante per te!'}</p>`
              })

              await db.update(contacts)
                .set({ emailSent: true })
                .where(eq(contacts.id, contact.id))

              emailsSent++

              await db.insert(logs).values({
                userId: automation.userId,
                contactId: contact.id,
                type: 'email',
                status: 'success',
                message: `Email sent to ${contact.email}`
              })
            } catch (error) {
              console.error('Email error:', error)
              await db.insert(logs).values({
                userId: automation.userId,
                contactId: contact.id,
                type: 'email',
                status: 'failed',
                message: 'Email failed',
                details: { error: String(error) }
              })
            }
          }

          // Invia WhatsApp
          if (contact.phone && !contact.whatsappSent) {
            try {
              const formattedPhone = contact.phone.startsWith('whatsapp:')
                ? contact.phone
                : `whatsapp:${contact.phone.replace(/\D/g, '')}`

              await twilioClient.messages.create({
                from: process.env.TWILIO_WHATSAPP_NUMBER!,
                to: formattedPhone,
                body: automation.whatsappTemplate
                  ? automation.whatsappTemplate
                    .replace('{name}', contact.name || '')
                    .replace('{message}', contact.message || '')
                  : `Ciao ${contact.name}! ${contact.message || 'Ho un messaggio importante per te!'}`
              })

              await db.update(contacts)
                .set({ whatsappSent: true })
                .where(eq(contacts.id, contact.id))

              whatsappSent++

              await db.insert(logs).values({
                userId: automation.userId,
                contactId: contact.id,
                type: 'whatsapp',
                status: 'success',
                message: `WhatsApp sent to ${contact.phone}`
              })
            } catch (error) {
              console.error('WhatsApp error:', error)
              await db.insert(logs).values({
                userId: automation.userId,
                contactId: contact.id,
                type: 'whatsapp',
                status: 'failed',
                message: 'WhatsApp failed',
                details: { error: String(error) }
              })
            }
          }

          // Marca come contattato se almeno uno è andato
          if (contact.emailSent || contact.whatsappSent) {
            await db.update(contacts)
              .set({
                status: 'contacted',
                lastContactedAt: new Date(),
                updatedAt: new Date()
              })
              .where(eq(contacts.id, contact.id))
          }
        }

        // Aggiorna stats automazione
        await db.update(automations)
          .set({
            totalEmailsSent: (automation.totalEmailsSent || 0) + emailsSent,
            totalWhatsappSent: (automation.totalWhatsappSent || 0) + whatsappSent,
            lastRunAt: new Date(),
            nextRunAt: new Date(Date.now() + (automation.checkInterval || 15) * 60 * 1000),
            updatedAt: new Date()
          })
          .where(eq(automations.id, automation.id))

        results.push({
          automationId: automation.id,
          userId: automation.userId,
          emailsSent,
          whatsappSent,
          processed: contactsToProcess.length
        })

      } catch (error) {
        console.error(`Error in automation ${automation.id}:`, error)
        results.push({
          automationId: automation.id,
          error: String(error)
        })
      }
    }

    return NextResponse.json({
      success: true,
      automationsProcessed: activeAutomations.length,
      results,
      nextRun: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    })

  } catch (error) {
    console.error('Engine error:', error)
    return NextResponse.json(
      { error: 'Engine failed', details: error },
      { status: 500 }
    )
  }
}

// Importa da Airtable
async function importFromAirtable(automation: any) {
  try {
    const config = automation.sourceConfig as any
    if (!config.apiKey || !config.baseId || !config.tableName) return

    const base = new Airtable({ apiKey: config.apiKey }).base(config.baseId)

    const records = await base(config.tableName)
      .select({
        filterByFormula: config.filter || "{Status} = 'New'"
      })
      .all()

    for (const record of records) {
      // Controlla se esiste già
      const existing = await db
        .select()
        .from(contacts)
        .where(
          and(
            eq(contacts.userId, automation.userId),
            eq(contacts.sourceId, record.id)
          )
        )
        .limit(1)

      if (existing.length === 0) {
        // Nuovo contatto!
        await db.insert(contacts).values({
          userId: automation.userId,
          name: record.get('Name') as string || 'Unknown',
          email: record.get('Email') as string,
          phone: record.get('Phone') as string,
          message: record.get('Message') as string,
          status: 'to_contact',
          source: 'airtable',
          sourceId: record.id,
          customFields: record.fields
        })
      }
    }
  } catch (error) {
    console.error('Airtable import error:', error)
  }
}