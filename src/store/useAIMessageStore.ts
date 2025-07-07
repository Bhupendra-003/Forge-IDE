import { create } from "zustand";
import { useAIWindowStore } from '@/store/useAIWindowStore';
import { useCodeEditorStore } from '@/store/useCodeEditorStore';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface AIMessageState {
  messages: Message[];
  isLoading: boolean;
  streamingMessage: string;
  abortController: AbortController | null;
  
  // Actions
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateLastAIMessage: (content: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setStreamingMessage: (message: string) => void;
  setAbortController: (controller: AbortController | null) => void;
  
  // Operations
  sendMessage: (inputValue: string, customInstruction?: string) => Promise<void>;
  clearChat: () => void;
  abortStreaming: () => void;
}

// Initialize with default messages from localStorage if available
const getInitialMessages = (): Message[] => {
  if (typeof window === 'undefined') {
    return [{ role: 'ai', content: 'Hello! I\'m Forge AI. How can I help you with your code today?' }];
  }
  
  const savedMessages = localStorage.getItem('ai-chat-history');
  if (savedMessages) {
    try {
      return JSON.parse(savedMessages);
    } catch (e) {
      console.error('Error parsing saved messages:', e);
    }
  }
  
  return [{ role: 'ai', content: 'Hello! I\'m Forge AI. How can I help you with your code today?' }];
};

export const useAIMessageStore = create<AIMessageState>((set, get) => ({
  messages: getInitialMessages(),
  isLoading: false,
  streamingMessage: '',
  abortController: null,
  
  // Actions
  setMessages: (messages) => {
    set({ messages });
    localStorage.setItem('ai-chat-history', JSON.stringify(messages));
  },
  
  addMessage: (message) => {
    const newMessages = [...get().messages, message];
    set({ messages: newMessages });
    localStorage.setItem('ai-chat-history', JSON.stringify(newMessages));
  },
  
  updateLastAIMessage: (content) => {
    const messages = [...get().messages];
    if (messages.length > 0 && messages[messages.length - 1].role === 'ai') {
      messages[messages.length - 1].content = content;
      set({ messages });
      localStorage.setItem('ai-chat-history', JSON.stringify(messages));
    }
  },
  
  setIsLoading: (isLoading) => set({ isLoading }),
  setStreamingMessage: (streamingMessage) => set({ streamingMessage }),
  setAbortController: (abortController) => set({ abortController }),
  
  // Operations
  abortStreaming: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
      set({ abortController: null, isLoading: false });
    }
  },
  
  clearChat: () => {
    // Abort any ongoing streaming
    get().abortStreaming();
    
    // Clear messages
    const newMessages = [{ role: 'ai', content: 'Chat history cleared. How can I help you with your code today?' }];
    set({ messages: newMessages as Message[] });
    localStorage.setItem('ai-chat-history', JSON.stringify(newMessages));
  },
  
  sendMessage: async (inputValue, customInstruction) => {
    if (!inputValue.trim()) return;
    
    // Get required stores
    const { openAIWindow } = useAIWindowStore.getState();
    const { getCode, language } = useCodeEditorStore.getState();
    
    // Open AI Window if it's not already open
    openAIWindow();
    
    // Abort any ongoing streaming
    get().abortStreaming();
    
    // Create a new abort controller for this request
    const abortController = new AbortController();
    set({ abortController, isLoading: true, streamingMessage: '' });
    
    // Get code from editor if available
    const currentCode = getCode();
    
    // Add code context to the message if there's code in the editor
    let userContent = inputValue;
    
    // If there's a custom instruction, add it to the message
    if (customInstruction) {
      userContent = `${customInstruction}\n\n${inputValue}`;
    }
    
    // Add code context if available
    if (currentCode && currentCode.trim()) {
      userContent = `${userContent}\n\nHere's the code in my editor, take the context only if required(${language}):\n\`\`\`${language}\n${currentCode}\n\`\`\``;
    }
    
    // Add user message (show only the user's input in the UI, not the full context)
    get().addMessage({ role: 'user', content: inputValue });
    
    // Create the full message with context for the API
    const userMessage = { role: 'user' as const, content: userContent };
    
    try {
      // Call AI service with streaming enabled
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...get().messages.filter(m => m.role !== 'user' || m.content !== inputValue), userMessage],
          stream: true,
        }),
        signal: abortController.signal,
      });
      
      if (!response.ok) {
        console.error('API response not OK:', response.status, response.statusText);
        throw new Error(`Failed to get AI response: ${response.status} ${response.statusText}`);
      }
      
      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }
      
      // Add an initial AI message that will be updated as we receive chunks
      get().addMessage({ role: 'ai', content: '' });
      
      // Process the stream
      let accumulatedResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);
        
        try {
          // Parse the chunk as JSON
          const jsonChunks = chunk
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
              try {
                return JSON.parse(line);
              } catch (e) {
                console.error('Error parsing JSON line:', e, line);
                return null;
              }
            })
            .filter(item => item !== null);
          
          // Process each JSON chunk
          for (const jsonChunk of jsonChunks) {
            if (jsonChunk && jsonChunk.chunk) {
              accumulatedResponse += jsonChunk.chunk;
              
              // Update the streaming message and the last AI message
              set({ streamingMessage: accumulatedResponse });
              get().updateLastAIMessage(accumulatedResponse);
            }
          }
        } catch (e) {
          console.error('Error parsing chunk:', e, chunk);
        }
      }
    } catch (err) {
      const error = err as Error;
      // Only handle error if it's not an abort error
      if (error.name !== 'AbortError') {
        console.error('Error getting AI response:', error);
        
        // Provide a more helpful error message to the user
        let errorMessage = 'Sorry, I encountered an error processing your request.';
        
        if (error instanceof Error) {
          if (error.message.includes('empty response')) {
            errorMessage = 'I received an empty response from the Gemini API. This might be due to content filtering or an issue with the API key. Please try a different query or check your API configuration.';
          } else {
            errorMessage = `Error: ${error.message}. Please try again with a different query or check the console for more details.`;
          }
        }
        
        // Update the last AI message or add a new one
        const messages = [...get().messages];
        if (messages.length > 0 && messages[messages.length - 1].role === 'ai') {
          get().updateLastAIMessage(errorMessage);
        } else {
          get().addMessage({ role: 'ai', content: errorMessage });
        }
      }
    } finally {
      set({ isLoading: false, abortController: null });
    }
  },
}));
