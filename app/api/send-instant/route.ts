import { NextResponse } from 'next/server'
import twilio from 'twilio'
import { Resend } from 'resend'

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json()

    const results = {
      email: false,
      whatsapp: false
    }

    // Invia Email
    if (email) {
      try {
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: email,
          subject: `Messaggio importante per ${name}`,
          html: `
            <h2>Ciao ${name}!</h2>
            <p>${message}</p>
            <p>---<br>Il tuo coach</p>
          `
        })
        results.email = true
        console.log(`✅ Email sent to ${email}`)
      } catch (error) {
        console.error('Email error:', error)
      }
    }

    // Invia WhatsApp
    if (phone) {
      try {
        const formattedPhone = phone.startsWith('whatsapp:')
          ? phone
          : `whatsapp:${phone.replace(/\D/g, '')}`

        await twilioClient.messages.create({
          from: 'whatsapp:+14155238886', // Twilio Sandbox
          to: formattedPhone,
          body: `Ciao ${name}! ${message}`
        })
        results.whatsapp = true
        console.log(`✅ WhatsApp sent to ${phone}`)
      } catch (error) {
        console.error('WhatsApp error:', error)
      }
    }

    return NextResponse.json({
      success: results.email || results.whatsapp,
      results
    })

  } catch (error) {
    console.error('Send error:', error)
    return NextResponse.json(
      { error: 'Send failed', details: error },
      { status: 500 }
    )
  }
}