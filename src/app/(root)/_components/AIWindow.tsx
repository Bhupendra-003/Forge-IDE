"use client";
import React, { useState, useEffect } from 'react';
import { useAIWindowStore } from '@/store/useAIWindowStore';
import { IoSparklesSharp } from 'react-icons/io5';
import { RxCross2 } from "react-icons/rx";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, Send } from 'lucide-react';

function AIWindow() {
  const { closeAIWindow } = useAIWindowStore();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Hello! I\'m Devine AI. How can I help you with your code today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('ai-chat-history');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ai-chat-history', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { role: 'user' as const, content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call AI service - replace with your actual API endpoint
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        console.error('API response not OK:', response.status, response.statusText);
        throw new Error(`Failed to get AI response: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('AI response data:', data);

      // Check if we have a valid response
      if (!data.response) {
        console.error('Empty or invalid response from API:', data);
        throw new Error('Received empty response from AI service');
      }

      // Add AI response to messages
      setMessages(prev => [...prev, {
        role: 'ai',
        content: data.response
      }]);
    } catch (error) {
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

      setMessages(prev => [...prev, {
        role: 'ai',
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="w-full h-10 flex bg-background-2 border border-b-0 items-center justify-between">
        <div className='w-fit h-full flex pt-1 border-t-2 border-t-primary items-center gap-2 px-3 bg-muted/50'>
          <Bot size={20} />
          <p className="text-lg font-sans">Devine AI</p>
        </div>
        <div className="flex items-center pr-2">
          <button
            onClick={closeAIWindow}
            className="w-6 h-6 flex items-center justify-center hover:bg-input rounded-full"
          >
            <RxCross2 size={18} />
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'w-full'}`}
          >
            {message.role === 'user' ? (
              // User message with avatar
              <div className="flex gap-3 max-w-[80%] flex-row-reverse">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-lg bg-muted text-primary-foreground">
                  <p className="text-sm whitespace-pre-wrap font-mono">{message.content}</p>
                </div>
              </div>
            ) : (
              // AI message - full width, no avatar
              <div className="w-full p-3 rounded-lg bg-transparent">
                <p className="text-sm whitespace-pre-wrap font-mono">{message.content}</p>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex w-full">
            <div className="w-full p-3 rounded-lg bg-muted border">
              <p className="text-sm">Thinking...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-center gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Devine AI about your code..."
            className="flex-1 font-mono focus:ring-0 focus:outline-none min-h-[40px] max-h-[200px] p-2 rounded-md border bg-muted/30 resize-none"
            rows={10}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="h-10 w-10 rounded-full mt-auto"
            disabled={isLoading || !inputValue.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AIWindow;
