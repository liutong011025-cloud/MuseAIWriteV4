import { NextRequest, NextResponse } from 'next/server'
import { logApiCall } from '@/lib/log-api-call'

const DIFY_API_KEY = process.env.DIFY_API_KEY || ''
const DIFY_CHAT_APP_ID = 'app-IKvkbOgKstyjEupEpbpu2iPF'
const DIFY_BASE_URL = 'https://api.dify.ai/v1'

export async function POST(request: NextRequest) {
  try {
    const { message, conversation_id, user_id } = await request.json()

    const apiKey = DIFY_API_KEY || DIFY_CHAT_APP_ID
    if (!apiKey) {
      return NextResponse.json(
        { error: 'DIFY_API_KEY not configured' },
        { status: 500 }
      )
    }

    // Dify API configuration
    const url = `${DIFY_BASE_URL}/chat-messages`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    }
    
    const requestBody: any = {
      inputs: {},
      query: message,
      response_mode: 'blocking',
      conversation_id: conversation_id || undefined,
      user: user_id || 'default-user',
    }

    // 如果使用的是app ID，需要在request body中添加app_id字段
    const isAppId = apiKey.startsWith('app-')
    if (isAppId) {
      requestBody.app_id = apiKey
    }

    console.log('Dify Chat API Request:', JSON.stringify({
      url,
      app_id: isAppId ? apiKey : 'using API key',
      has_conversation_id: !!conversation_id,
    }, null, 2))

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Dify API error:', errorText)
      return NextResponse.json(
        { error: `Dify API error: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // 记录API调用
    await logApiCall(
      user_id,
      'plot',
      '/api/dify-chat',
      { message, conversation_id },
      { answer: data.answer, conversation_id: data.conversation_id, message_id: data.id }
    )
    
    return NextResponse.json({
      answer: data.answer || '',
      conversation_id: data.conversation_id,
      message_id: data.id,
    })
  } catch (error) {
    console.error('Error calling Dify API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

