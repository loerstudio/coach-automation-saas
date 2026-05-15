import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import nodemailer from 'nodemailer'

// This would run every 15 minutes via cron job
export async function POST(request: Request) {
  try {
    const { userId, tokens } = await request.json()

    // Setup Google Sheets API
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )
    oauth2Client.setCredentials(tokens)

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client })
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    // Read from Google Sheets
    const spreadsheetId = 'your-spreadsheet-id' // Get from user settings
    const range = 'Sheet1!A:F' // Nome, Email, Telefono, Stato, Messaggio, DataInvio

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    })

    const rows = response.data.values || []
    const headers = rows[0]
    const data = rows.slice(1)

    let emailsSent = 0
    let whatsappSent = 0

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      const rowData = {
        nome: row[0],
        email: row[1],
        telefono: row[2],
        stato: row[3],
        messaggio: row[4],
        dataInvio: row[5]
      }

      // Check if needs to be sent
      if (rowData.stato === 'Da Contattare') {
        // Send Email if email exists
        if (rowData.email) {
          await sendEmail(gmail, rowData.email, rowData.nome, rowData.messaggio)
          emailsSent++
        }

        // Send WhatsApp if phone exists
        if (rowData.telefono) {
          await sendWhatsApp(rowData.telefono, rowData.messaggio)
          whatsappSent++
        }

        // Update Sheet with "Contattato" status
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `Sheet1!D${i + 2}:F${i + 2}`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [['Contattato', rowData.messaggio, new Date().toISOString()]]
          }
        })
      }
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
      { error: 'Automation failed' },
      { status: 500 }
    )
  }
}

async function sendEmail(gmail: any, to: string, name: string, message: string) {
  const subject = `Ciao ${name}, messaggio importante per te`
  const body = message || `Ciao ${name},\n\nSpero tu stia bene! Ti contatto per il nostro programma di coaching.\n\nA presto!`

  const email = [
    `To: ${to}`,
    'Subject: ' + subject,
    '',
    body
  ].join('\n')

  const encodedMessage = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage
    }
  })
}

async function sendWhatsApp(phone: string, message: string) {
  // WhatsApp Business API
  const url = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: phone.replace(/\D/g, ''), // Remove non-digits
      type: 'text',
      text: {
        body: message || 'Ciao! Ti contatto per il nostro programma di coaching. Quando possiamo parlare?'
      }
    })
  })

  if (!response.ok) {
    throw new Error('WhatsApp send failed')
  }
}