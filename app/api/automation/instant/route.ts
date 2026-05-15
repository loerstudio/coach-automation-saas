import { NextResponse } from 'next/server'
import twilio from 'twilio'
import { Resend } from 'resend'
import Airtable from 'airtable'

// Initialize services - ALL INSTANT, NO APPROVAL NEEDED!
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const resend = new Resend(process.env.RESEND_API_KEY)

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
)

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    let emailsSent = 0
    let whatsappSent = 0

    // Read from Airtable (instant, no OAuth!)
    const records = await base('Contacts').select({
      filterByFormula: "{Status} = 'To Contact'"
    }).all()

    for (const record of records) {
      const name = record.get('Name') as string
      const email = record.get('Email') as string
      const phone = record.get('Phone') as string
      const message = record.get('Message') as string || `Hi ${name}, this is your coach reaching out!`

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

      // Update Airtable record
      await base('Contacts').update(record.id, {
        'Status': 'Contacted',
        'Last Contact': new Date().toISOString()
      })
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