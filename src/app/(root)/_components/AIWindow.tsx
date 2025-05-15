"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useAIWindowStore } from '@/store/useAIWindowStore';
import { useCodeEditorStore } from '@/store/useCodeEditorStore';
import { RxCross2 } from "react-icons/rx";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, Send, Copy, Check, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
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

  // Default values shown
  return (
    <div className="relative group">
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
        style={dracula}
        className="!rounded-md !mt-0"
        customStyle={{
          padding: '1rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem',
          fontSize: '1.2rem',  // Increased font size for code blocks
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
  const { getCode, language } = useCodeEditorStore();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Hello! I\'m Devine AI. How can I help you with your code today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const textareaRef = useRef(null)
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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

  // Auto-scroll to bottom when messages change or when streaming
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  // Function to handle cleanup when streaming is done or aborted
  const cleanupStreaming = () => {
    setIsLoading(false);
    if (abortControllerRef.current) {
      abortControllerRef.current = null;
    }
  };

  // Function to abort ongoing streaming
  const abortStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      cleanupStreaming();
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current as HTMLTextAreaElement | null;
    if (textarea) {
      textarea.style.height = 'auto' // Reset to shrink if needed
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [inputValue])

  // Effect to clean up streaming on component unmount
  useEffect(() => {
    return () => {
      abortStreaming();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to clear chat history
  const clearChat = () => {
    // Clear messages from state
    setMessages([
      { role: 'ai', content: 'Chat history cleared. How can I help you with your code today?' }
    ]);

    // Clear from localStorage
    localStorage.removeItem('ai-chat-history');

    // Abort any ongoing streaming
    abortStreaming();
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Abort any ongoing streaming
    abortStreaming();

    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // Get code from editor if available
    const currentCode = getCode();

    // Add code context to the message if there's code in the editor
    let userContent = inputValue;
    if (currentCode && currentCode.trim()) {
      userContent = `${inputValue}\n\nHere's the code in my editor (${language}):\n\`\`\`${language}\n${currentCode}\n\`\`\``;
    }

    // Add user message
    const userMessage = { role: 'user' as const, content: userContent };
    setMessages(prev => [...prev, { role: 'user', content: inputValue }]); // Show only the user's question in the UI
    setIsLoading(true);
    setStreamingMessage(''); // Reset streaming message

    try {
      // Call AI service with streaming enabled
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          stream: true,
        }),
        signal,
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

      // Create a placeholder for the AI message
      setMessages(prev => [...prev, { role: 'ai', content: '' }]);

      // Process the stream
      let accumulatedResponse = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk
        const chunk = decoder.decode(value, { stream: true });

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

              // Update the streaming message
              setStreamingMessage(accumulatedResponse);

              // Update the last message in the messages array
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: 'ai',
                  content: accumulatedResponse
                };
                return newMessages;
              });
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

        setMessages(prev => {
          // If we already added a placeholder AI message, update it
          if (prev[prev.length - 1].role === 'ai') {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              role: 'ai',
              content: errorMessage
            };
            return newMessages;
          }
          // Otherwise add a new AI message
          return [...prev, { role: 'ai', content: errorMessage }];
        });
      }
    } finally {
      cleanupStreaming();
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
        <div className="flex items-center gap-2 pr-2">
          <Button
            onClick={clearChat}
            size="icon"
            variant="ghost"
            className="w-6 h-6 flex items-center justify-center hover:bg-input rounded-full"
            title="Clear chat history"
          >
            <Trash2 size={16} />
          </Button>
          <Button
            onClick={closeAIWindow}
            size="icon"
            variant="ghost"
            className="w-6 h-6 flex items-center justify-center hover:bg-input rounded-full"
          >
            <RxCross2 size={18} />
          </Button>
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
                  <p className="text-[1.1rem] whitespace-pre-wrap font-mono">{message.content}</p>
                </div>
              </div>
            ) : (
              // AI message - full width, no avatar, with markdown support
              <div className="w-full p-3 rounded-lg bg-transparent">
                <div className="text-[1.3rem] text-zinc-200 prose prose-sm dark:prose-invert max-w-none font-sans">
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
                          <code className="bg-[#3a2d5f] text-zinc-100 border-1 rounded px-1 py-0.3 font-mono text-[1.3rem]" {...props}>
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
            className="flex-1 font-mono text-lg focus:ring-0 focus:outline-none min-h-[40px] max-h-[200px] p-2 rounded-md border bg-muted/30 resize-none overflow-y-auto"
            rows={1}
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
