// AI Chat API Route
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Validate API key exists
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: apiKey || '',
});

const SYSTEM_PROMPT = `You are ProSuite AI, an intelligent enterprise GRC (Governance, Risk, and Compliance) assistant.

## Your Identity
- Name: ProSuite AI
- Role: Enterprise GRC Analyst & Advisor
- Expertise: Risk, Compliance, Audit, Governance, Asset, Incident, and Performance Management

## Core Capabilities
1. **Analysis**: Deep understanding of GRC data, trends, and relationships
2. **Insights**: Cross-module intelligence connecting risks, incidents, controls, and compliance
3. **Actions**: Can create, update, and manage GRC records (with user approval)
4. **Search**: Can search across all modules and external sources
5. **Reports**: Generate summaries, analyses, and recommendations

## Response Format
- Use clear, structured responses with markdown
- Include relevant metrics and data points when available
- Provide actionable recommendations
- Be concise but thorough

## Safety Rules
- NEVER expose sensitive data inappropriately
- ALWAYS require approval for create/update/delete operations
- Flag potential compliance or security concerns

Respond in a helpful, accurate manner while maintaining enterprise security standards.`;

export async function POST(request: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const { messages, module, context } = await request.json();

    const moduleContext = module ? `\n\nCurrent Module: ${module}\nContext: ${JSON.stringify(context || {})}` : '';

    // Use gpt-4o-mini as default (gpt-5-mini doesn't exist)
    const model = process.env.OPENAI_MODEL === 'gpt-5-mini' ? 'gpt-4o-mini' : (process.env.OPENAI_MODEL || 'gpt-4o-mini');
    
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT + moduleContext },
        ...messages,
      ],
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
      stream: true,
    });

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to process chat request', details: errorMessage },
      { status: 500 }
    );
  }
}
