// ProSuite GRC AI Agent
import OpenAI from 'openai';
import { AI_CONFIG, ModuleKey, MODULE_SUGGESTIONS } from '../config';
import { SYSTEM_PROMPT, MODULE_PROMPTS } from '../prompts/system';
import { buildModuleContext, buildScreenContext } from '../context/builder';
import { createActionRequest, executeAction } from '../actions/handler';
import { AIAction, ActionType } from '../actions/types';

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actions?: AIAction[];
  suggestions?: string[];
}

export interface AgentResponse {
  message: string;
  actions: AIAction[];
  suggestions: string[];
  context?: Record<string, unknown>;
}

// Main GRC Agent class
export class GRCAgent {
  private conversationHistory: ChatMessage[] = [];
  private currentModule: ModuleKey = 'risk';
  private screenContext: Record<string, unknown> = {};

  constructor() {
    this.initializeConversation();
  }

  private initializeConversation() {
    this.conversationHistory = [{
      id: 'system_init',
      role: 'system',
      content: SYSTEM_PROMPT,
      timestamp: new Date().toISOString(),
    }];
  }

  // Set current module context
  setModule(module: ModuleKey) {
    this.currentModule = module;
  }

  // Update screen context
  updateScreenContext(pageType: 'list' | 'detail' | 'chart' | 'form', visibleData?: { ids?: number[]; metrics?: Record<string, number> }) {
    this.screenContext = buildScreenContext(this.currentModule, pageType, visibleData);
  }

  // Get suggestions for current module
  getSuggestions(): string[] {
    return MODULE_SUGGESTIONS[this.currentModule] || [];
  }

  // Process user message
  async chat(userMessage: string): Promise<AgentResponse> {
    if (!openai) {
      return {
        message: 'The AI service is not configured.',
        actions: [],
        suggestions: this.getSuggestions(),
      };
    }

    // Build context
    const moduleContext = buildModuleContext(this.currentModule);
    const modulePrompt = MODULE_PROMPTS[this.currentModule];

    // Add user message to history
    const userChatMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    this.conversationHistory.push(userChatMessage);

    // Build messages for API
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'system', content: modulePrompt },
      { role: 'system', content: `Current Context:\n${JSON.stringify({
        module: moduleContext.module,
        summary: moduleContext.summary,
        screenContext: this.screenContext,
      }, null, 2)}` },
      ...this.conversationHistory
        .filter(m => m.role !== 'system')
        .slice(-10) // Keep last 10 messages for context
        .map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
    ];

    try {
      const response = await openai.chat.completions.create({
        model: AI_CONFIG.model,
        messages,
        max_tokens: AI_CONFIG.maxTokens,
        temperature: AI_CONFIG.temperature,
        functions: this.getAvailableFunctions(),
        function_call: 'auto',
      });

      const assistantMessage = response.choices[0].message;
      const actions: AIAction[] = [];

      // Handle function calls
      if (assistantMessage.function_call) {
        const functionName = assistantMessage.function_call.name;
        const functionArgs = JSON.parse(assistantMessage.function_call.arguments || '{}');
        
        const action = this.handleFunctionCall(functionName, functionArgs);
        if (action) {
          actions.push(action);
        }
      }

      const responseContent = assistantMessage.content || 'I understand. How can I help you further?';

      // Add assistant message to history
      const assistantChatMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString(),
        actions,
        suggestions: this.generateContextualSuggestions(userMessage),
      };
      this.conversationHistory.push(assistantChatMessage);

      return {
        message: responseContent,
        actions,
        suggestions: assistantChatMessage.suggestions || [],
        context: moduleContext.summary as unknown as Record<string, unknown>,
      };
    } catch (error) {
      console.error('AI Agent Error:', error);
      return {
        message: 'I apologize, but I encountered an error processing your request. Please try again.',
        actions: [],
        suggestions: this.getSuggestions(),
      };
    }
  }

  // Handle function calls from AI
  private handleFunctionCall(name: string, args: Record<string, unknown>): AIAction | null {
    const actionTypeMap: Record<string, ActionType> = {
      create_record: 'create',
      update_record: 'update',
      delete_record: 'delete',
      escalate_item: 'escalate',
      assign_item: 'assign',
      search_data: 'search',
      analyze_data: 'analyze',
      generate_report: 'report',
      harvest_evidence: 'harvest-evidence',
    };

    const actionType = actionTypeMap[name];
    if (!actionType) return null;

    return createActionRequest({
      type: actionType,
      module: this.currentModule,
      collection: args.collection as string || `${this.currentModule}.${this.currentModule}s`,
      description: args.description as string || `${actionType} operation`,
      data: args,
    });
  }

  // Get available functions for OpenAI
  private getAvailableFunctions(): OpenAI.ChatCompletionCreateParams.Function[] {
    return [
      {
        name: 'create_record',
        description: 'Create a new record in the system',
        parameters: {
          type: 'object',
          properties: {
            collection: { type: 'string', description: 'The collection to create the record in' },
            description: { type: 'string', description: 'Description of what is being created' },
            data: { type: 'object', description: 'The record data' },
          },
          required: ['collection', 'data'],
        },
      },
      {
        name: 'search_data',
        description: 'Search for data across the system',
        parameters: {
          type: 'object',
          properties: {
            collection: { type: 'string', description: 'The collection to search' },
            query: { type: 'string', description: 'Search query' },
          },
          required: ['query'],
        },
      },
      {
        name: 'analyze_data',
        description: 'Analyze data and provide insights',
        parameters: {
          type: 'object',
          properties: {
            type: { type: 'string', description: 'Type of analysis (summary, trend, comparison)' },
          },
        },
      },
      {
        name: 'escalate_item',
        description: 'Escalate an item to critical priority',
        parameters: {
          type: 'object',
          properties: {
            collection: { type: 'string' },
            id: { type: 'number', description: 'ID of item to escalate' },
            reason: { type: 'string', description: 'Reason for escalation' },
          },
          required: ['id', 'reason'],
        },
      },
      {
        name: 'harvest_evidence',
        description: 'Automatically gather audit evidence from related modules',
        parameters: {
          type: 'object',
          properties: {
            engagement_id: { type: 'number', description: 'Audit engagement ID' },
          },
          required: ['engagement_id'],
        },
      },
      {
        name: 'generate_report',
        description: 'Generate a report for the current module',
        parameters: {
          type: 'object',
          properties: {
            type: { type: 'string', description: 'Report type (summary, detailed, executive)' },
          },
        },
      },
    ];
  }

  // Generate contextual suggestions based on conversation
  private generateContextualSuggestions(userMessage: string): string[] {
    const baseSuggestions = this.getSuggestions();
    const contextual: string[] = [];

    // Add contextual suggestions based on keywords
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('risk')) {
      contextual.push('Show risk mitigation status');
    }
    if (lowerMessage.includes('audit')) {
      contextual.push('Prepare evidence pack');
    }
    if (lowerMessage.includes('incident')) {
      contextual.push('Find related risks');
    }
    if (lowerMessage.includes('compliance')) {
      contextual.push('Run gap analysis');
    }

    return [...contextual, ...baseSuggestions.slice(0, 3)];
  }

  // Execute an approved action
  async executeApprovedAction(action: AIAction) {
    const approvedAction = { ...action, status: 'approved' as const };
    return executeAction(approvedAction);
  }

  // Clear conversation history
  clearHistory() {
    this.initializeConversation();
  }

  // Get conversation history
  getHistory(): ChatMessage[] {
    return this.conversationHistory.filter(m => m.role !== 'system');
  }
}

// Singleton instance
let agentInstance: GRCAgent | null = null;

export function getGRCAgent(): GRCAgent {
  if (!agentInstance) {
    agentInstance = new GRCAgent();
  }
  return agentInstance;
}
