"use client";
import React, { useState } from 'react';
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

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: inputValue }]);
    
    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `I received your message: "${inputValue}". This is a placeholder response. In a real implementation, this would connect to an AI service.` 
      }]);
    }, 1000);
    
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full h-full flex flex-col font-mono">
      {/* Header */}
      <div className="w-full h-10 flex bg-background-2 border border-b-0 items-center justify-between">
        <div className='w-fit h-full flex pt-1 border-t-2 items-center gap-2 px-3 bg-muted/50'>
          <Bot size={20} />
          <p className="text-lg font-mono">Devine AI</p>
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30 font-mono">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {message.role === 'ai' ? (
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src="/avatars/ai-avatar.png" alt="AI" />
                  <AvatarFallback>
                    <Bot size={16} />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src="/avatars/bhupi.png" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
              <div 
                className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted border'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-center gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Devine AI about your code..."
            className="flex-1 focus:ring-0 focus:outline-none min-h-[40px] max-h-[120px] p-2 rounded-md border bg-muted/30 resize-none"
            rows={1}
          />
          <Button 
            onClick={handleSendMessage}
            size="icon" 
            className="h-10 w-10 rounded-full"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AIWindow;
