import { NextResponse } from 'next/server'

// This endpoint would be called by Vercel Cron or external service every 15 minutes
export async function GET(request: Request) {
  // Verify the request is from authorized source (Vercel Cron secret)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all active users with automations enabled
    // For demo, we'll simulate this
    const activeUsers = [
      {
        id: 'user1',
        email: 'coach@example.com',
        tokens: {
          access_token: 'mock_token',
          refresh_token: 'mock_refresh'
        }
      }
    ]

    const results = []

    // Process each user's automation
    for (const user of activeUsers) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/automation/run`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user.id,
            tokens: user.tokens
          })
        })

        const result = await response.json()
        results.push({
          userId: user.id,
          ...result
        })
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error)
        results.push({
          userId: user.id,
          error: 'Processing failed'
        })
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
      nextRun: new Date(Date.now() + 15 * 60 * 1000).toISOString() // +15 minutes
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    )
  }
}