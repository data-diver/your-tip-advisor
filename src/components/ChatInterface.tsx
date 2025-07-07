import { useState, useEffect, useRef } from 'react'; // Added useEffect and useRef
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'llm';
}

export const ChatInterface = ({ isOpen, onClose }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for the element at the end of messages

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue('');

    // Call the backend API
    const callBackendApi = async () => {
      setIsLoading(true); // Set loading true
      try {
        const response = await fetch('http://localhost:5000/api/chat-gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: newUserMessage.text }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const backendResponse = await response.json();

        const llmResponse: Message = {
          id: (Date.now() + 1).toString(), // Simple ID generation
          text: backendResponse.reply || "No reply from backend.",
          sender: 'llm', // Assuming 'llm' or derive from backendResponse.sender if available
        };
        setMessages((prevMessages) => [...prevMessages, llmResponse]);

      } catch (error) {
        console.error("Failed to fetch from backend:", error);
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I couldn't connect to the AI advisor. Please try again later.",
          sender: 'llm',
        };
        setMessages((prevMessages) => [...prevMessages, errorResponse]);
      } finally {
        setIsLoading(false); // Set loading false in finally block
      }
    };

    callBackendApi();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card text-card-foreground rounded-lg shadow-xl w-full max-w-md h-[70vh] flex flex-col p-4 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Chat with Tip Advisor</h3>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-grow mb-4 p-3 border rounded-md">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 p-2 rounded-lg max-w-[80%] ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground ml-auto'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Element to scroll to */}
        </ScrollArea>
        <div className="flex items-start gap-2"> {/* items-start for better alignment with multi-line textarea */}
          <Textarea
            placeholder="Ask for tipping advice..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isLoading) { // Disable onKeyPress send if loading
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-grow resize-none"
            rows={1}
            disabled={isLoading} // Disable textarea when loading
          />
          <Button onClick={handleSendMessage} className="self-end" disabled={isLoading}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
