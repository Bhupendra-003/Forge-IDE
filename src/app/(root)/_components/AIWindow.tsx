"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useAIWindowStore } from '@/store/useAIWindowStore';
import { RxCross2 } from "react-icons/rx";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, Send, Copy, Check, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAIMessageStore } from '@/store/useAIMessageStore';
import useTheme from "@/hooks/useTheme";


// Custom ThinkingDots component for loading animation
const ThinkingDots = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <span>{dots}</span>;
};

// Code block component with copy button
const CodeBlock = ({ language, value }: { language: string, value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { isDarkMode } = useTheme();
  // Default values shown
  return (
    <div className="relative group scrollbar-custom">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          onClick={handleCopy}
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 bg-gray-800/50 hover:bg-gray-700/70"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language || 'javascript'}
        style={isDarkMode ? dracula : vs}
        className="!rounded-md !mt-0"
        customStyle={{
          padding: '1rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem',
          fontSize: "1.2rem",  // Increased font size for code blocks
          lineHeight: '1.6',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};


function AIWindow() {
  const { closeAIWindow } = useAIWindowStore();
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();
  // Use our AI message store
  const messages = useAIMessageStore(state => state.messages);
  const isLoading = useAIMessageStore(state => state.isLoading);
  const streamingMessage = useAIMessageStore(state => state.streamingMessage);
  const sendMessage = useAIMessageStore(state => state.sendMessage);
  const clearChat = useAIMessageStore(state => state.clearChat);

  // Auto-scroll to bottom when messages change or when streaming
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset to shrink if needed
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [inputValue]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    await sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-full h-full flex flex-col overflow-clip">
      {/* Header */}
      <div className="w-full h-10 flex bg-background-2 border border-b-0 items-center justify-between">
        <div className='w-fit h-full flex pt-1 border-t-2 border-t-primary items-center gap-2 px-3 bg-muted/50'>
          <Bot size={20} />
          <p className="text-lg font-sans">Forge AI</p>
        </div>
        <div className="flex items-center gap-2 pr-2">
          <Button
            onClick={clearChat}
            size="icon"
            variant="ghost"
            className="w-6 h-6 flex items-center justify-center hover:bg-muted rounded-full"
            title="Clear chat history"
          >
            <Trash2 size={16} />
          </Button>
          <Button
            onClick={closeAIWindow}
            size="icon"
            variant="ghost"
            className="w-6 h-6 flex items-center justify-center hover:bg-muted rounded-full"
          >
            <RxCross2 size={18} />
          </Button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 scrollbar-custom w-full overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.map((message: { role: 'user' | 'ai'; content: string }, index: number) => (
          <div
            key={index}
            className={`flex  ${message.role === 'user' ? 'justify-end' : 'w-full'}`}
          >
            {message.role === 'user' ? (
              // User message with avatar
              <div className="flex gap-3 max-w-[80%] flex-row-reverse">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-lg bg-muted text-primary-foreground">
                  <p className="text-[1.1rem] text-foreground whitespace-pre-wrap font-mono">{message.content}</p>
                </div>
              </div>
            ) : (
              // AI message - full width, no avatar, with markdown support
              <div className="w-full p-3 rounded-lg bg-transparent">
                <div className="text-[1.3rem] text-foreground prose prose-sm dark:prose-invert max-w-none font-sans">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ ...props }) => <p className="mb-4 " {...props} />,
                      h1: ({ ...props }) => <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />,
                      h2: ({ ...props }) => <h2 className="text-xl font-bold mb-3 mt-5" {...props} />,
                      h3: ({ ...props }) => <h3 className="text-lg font-bold mb-2 mt-4" {...props} />,
                      h4: ({ ...props }) => <h4 className="font-bold mb-2 mt-3" {...props} />,
                      ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                      ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                      li: ({ ...props }) => <li className="mb-1" {...props} />,
                      blockquote: ({ ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />,
                      code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';
                        const isInline = !match;

                        return isInline ? (
                          <code className={`text-foreground border-1 rounded px-1 py-0.3 font-mono text-[1.3rem] ${isDarkMode ? "bg-[#3a2d5f]" : "bg-muted-foreground"}`} {...props}>
                            {children}
                          </code> 
                        ) : (
                          <CodeBlock language={language} value={String(children).replace(/\n$/, '')} />
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
                <p className="font-mono">
                </p>
              </div>
            )}
          </div>
        ))}
        {isLoading && !streamingMessage && (
          <div className="flex w-full">
            <div className="w-full p-3 rounded-lg bg-muted/20 border">
              <p className="text-[1.1rem] font-mono">
                Thinking<ThinkingDots />
              </p>
            </div>
          </div>
        )}
        {/* Invisible div for auto-scrolling */}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-center gap-2">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI about your code..."
            className="flex-1 scrollbar-custom font-mono text-lg focus:ring-0 focus:outline-none min-h-[48px] max-h-[200px] p-2 px-4 rounded-md border bg-muted/30 resize-none overflow-y-auto"
            rows={1}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="h-12 w-25 rounded-full mt-auto"
            disabled={isLoading || !inputValue.trim()}
          >
            <Send className='scale-125 mr-2' />
            <p className="text-[.65vw]">Send</p>
          </Button>
        </div>
      </div>  
    </div>
  );
}

export default AIWindow;
