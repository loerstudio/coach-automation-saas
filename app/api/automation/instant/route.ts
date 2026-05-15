import { NextResponse } from 'next/server'
import twilio from 'twilio'
import { Resend } from 'resend'

// Initialize services - ALL INSTANT, NO APPROVAL NEEDED!
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    let emailsSent = 0
    let whatsappSent = 0

    // Mock data for demo - replace with real database
    const mockContacts = [
      {
        name: 'Mario Rossi',
        email: 'mario@example.com',
        phone: '+393331234567',
        message: 'Ciao Mario! Messaggio di test dal sistema di automazione.'
      }
    ]

    for (const contact of mockContacts) {
      const { name, email, phone, message } = contact

      // Send Email with Resend (instant!)
      if (email) {
        try {
          await resend.emails.send({
            from: 'coach@yourdomain.com',
            to: email,
            subject: `Important message for ${name}`,
            text: message,
            html: `<p>${message}</p>`
          })
          emailsSent++
        } catch (error) {
          console.error('Email failed:', error)
        }
      }

      // Send WhatsApp with Twilio (instant sandbox!)
      if (phone) {
        try {
          await twilioClient.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER!, // Twilio sandbox number
            to: `whatsapp:${phone}`,
            body: message
          })
          whatsappSent++
        } catch (error) {
          console.error('WhatsApp failed:', error)
        }
      }

      // In real app: update database status
      console.log(`✅ Contact ${name} processed successfully`)
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      whatsappSent,
      processedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Automation error:', error)
    return NextResponse.json(
      { error: 'Automation failed', details: error },
      { status: 500 }
    )
  }
}