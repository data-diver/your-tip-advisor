import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; // Changed Input to Textarea
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

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue('');

    // Mock LLM response (will be replaced in the next step)
    setTimeout(() => {
      const llmResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "This is a mock LLM response. I'll be able to provide more helpful advice soon!",
        sender: 'llm',
      };
      setMessages((prevMessages) => [...prevMessages, llmResponse]);
    }, 1000);
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
        </ScrollArea>
        <div className="flex items-start gap-2"> {/* items-start for better alignment with multi-line textarea */}
          <Textarea
            placeholder="Ask for tipping advice..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              // Send on Enter unless Shift is pressed (for new line)
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevent new line in textarea
                handleSendMessage();
              }
            }}
            className="flex-grow resize-none" // resize-none to prevent manual resize, let content dictate height or scroll
            rows={1} // Start with 1 row, will expand / scroll based on content and CSS
          />
          <Button onClick={handleSendMessage} className="self-end">Send</Button> {/* self-end to align with bottom of textarea if it grows */}
        </div>
      </div>
    </div>
  );
};
