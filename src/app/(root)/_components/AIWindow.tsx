"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Copy, Check, Trash2 } from 'lucide-react';
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
// Memoized to prevent unnecessary re-renders when typing in the input field
const CodeBlock = React.memo(({ language, value }: { language: string, value: string }) => {
  const [copied, setCopied] = useState(false);
  const { isDarkMode } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
});

// Add display name for debugging purposes
CodeBlock.displayName = 'CodeBlock';


function AIWindow() {
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
    <div className="relative w-full h-full flex flex-col overflow-hidden">

      <div className='rounded-full p-2 backdrop-blur-sm absolute z-50 hover:text-red-500 transition-all top-4 right-4 cursor-pointer'><Trash2 onClick={clearChat} size={18} /></div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30 scrollbar-custom">
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
                  <p className="bg-muted px-3 py-2 h-fit rounded-lg text-[1.1rem] text-foreground whitespace-pre-wrap">{message.content}</p>
              </div>
            ) : (
              // AI message - full width, no avatar, with markdown support
              <div className="w-full p-3 rounded-lg bg-transparent">
                <div className="text-[1.3rem] text-foreground prose prose-sm dark:prose-invert max-w-none font-sans">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ ...props }) => <p className="mb-4 text-[1.1rem] " {...props} />,
                      h1: ({ ...props }) => <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />,
                      h2: ({ ...props }) => <h2 className="text-xl font-bold mb-3 mt-5" {...props} />,
                      h3: ({ ...props }) => <h3 className="text-lg font-bold mb-2 mt-4" {...props} />,
                      h4: ({ ...props }) => <h4 className="font-bold  mb-2 mt-3" {...props} />,
                      ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                      ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                      li: ({ ...props }) => <li className="mb-1 text-[1.1rem]" {...props} />,
                      blockquote: ({ ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />,
                      code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';
                        const isInline = !match;

                        return isInline ? (
                          <code className={`text-foreground border-1 rounded px-1 py-0.3 font-medium font-mono text-[1.1rem] ${isDarkMode ? "bg-zinc-800" : "bg-muted-foreground"}`} {...props}>
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
      <div className="p-3 bg-muted/30 w-full flex-shrink-0 border-t">
        <div className="flex items-center gap-2">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI about your code..."
            className="w-full text-[1.1rem] px-4 py-3 resize-none scrollbar-custom rounded-2xl outline-none border min-h-14 max-h-[200px]"
            rows={1}
            disabled={isLoading}
            spellCheck="false"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="h-12 w-12 md:w-24 flex gap-2 rounded-full mt-auto"
            disabled={isLoading || !inputValue.trim()}
          >
            <Send size={20} />
            <p className="hidden md:block text-[.70vw]">Send</p>
          </Button>
        </div>
      </div>  
    </div>
  );
}

export default AIWindow;
