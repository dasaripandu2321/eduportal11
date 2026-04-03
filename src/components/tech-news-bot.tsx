'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Loader2, Send, Sparkles, Languages } from 'lucide-react';
import { getTechNewsUpdate } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type Message = {
  content: string | React.ReactNode;
  sender: 'user' | 'bot';
};

type Language = {
  code: string;
  name: string;
  nativeName: string;
};

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
];

const welcomeMessages = {
  en: "Hi! I'm Techie, your friendly tech news bot. Ask me anything about the latest in tech!",
  hi: "नमस्ते! मैं टेकी हूं, आपका दोस्ताना टेक न्यूज़ बॉट। मुझसे टेक्नोलॉजी की नवीनतम जानकारी के बारे में कुछ भी पूछें!",
  te: "హాయ్! నేను టెకీని, మీ స్నేహపూర్వక టెక్ న్యూస్ బాట్. టెక్నాలజీలో తాజా విషయాల గురించి నన్ను ఏదైనా అడగండి!",
  ta: "வணக்கம்! நான் டெக்கி, உங்கள் நட்பு தொழில்நுட்ப செய்தி போட். தொழில்நுட்பத்தில் சமீபத்திய விஷயங்களைப் பற்றி என்னிடம் எதையும் கேளுங்கள்!"
};

const placeholders = {
  en: "Ask about tech news...",
  hi: "टेक न्यूज़ के बारे में पूछें...",
  te: "టెక్ న్యూస్ గురించి అడగండి...",
  ta: "தொழில்நுட்ப செய்திகளைப் பற்றி கேளுங்கள்..."
};

const thinkingMessages = {
  en: "Thinking...",
  hi: "सोच रहा हूं...",
  te: "ఆలోచిస్తున్నాను...",
  ta: "யோசித்துக்கொண்டிருக்கிறேன்..."
};

export function TechNewsBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message in selected language
  useEffect(() => {
    setMessages([
      { sender: 'bot', content: welcomeMessages[selectedLanguage as keyof typeof welcomeMessages] }
    ]);
  }, [selectedLanguage]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    
    // Create language-specific query
    const languagePrompt = selectedLanguage !== 'en' 
      ? `Please respond in ${languages.find(l => l.code === selectedLanguage)?.name} language. ${query}`
      : query;
    
    setQuery('');
    setIsLoading(true);

    const result = await getTechNewsUpdate({ query: languagePrompt });
    setIsLoading(false);

    if (result.error) {
      const errorMessages = {
        en: "Sorry, I'm having trouble fetching the news right now. Please try again later.",
        hi: "क्षमा करें, मुझे अभी समाचार लाने में परेशानी हो रही है। कृपया बाद में पुनः प्रयास करें।",
        te: "క్షమించండి, ప్రస్తుతం వార్తలను తీసుకురావడంలో నాకు ఇబ్బంది ఉంది. దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి.",
        ta: "மன்னிக்கவும், இப்போது செய்திகளைப் பெறுவதில் எனக்கு சிக்கல் உள்ளது. தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்."
      };
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      setMessages((prev) => [...prev, { 
        sender: 'bot', 
        content: errorMessages[selectedLanguage as keyof typeof errorMessages] 
      }]);
    } else if (result.data) {
        const botResponse = result.data;
        const botMessageContent = (
            <div className="space-y-3">
                <p className="text-sm">{botResponse.intro}</p>
                <div className="space-y-2">
                    {botResponse.news.map((item, index) => (
                        <div key={index} className="p-3 rounded-md border bg-background/70 text-card-foreground text-left">
                            <h4 className="font-semibold text-sm">{item.title}</h4>
                            {item.source && <p className="text-xs text-muted-foreground mb-1">{item.source}</p>}
                            <p className="text-xs">{item.summary}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
        const botMessage: Message = { sender: 'bot', content: botMessageContent };
        setMessages((prev) => [...prev, botMessage]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            size="lg" 
            className="rounded-full h-14 w-14 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg"
          >
            <Bot className="h-6 w-6" />
            <span className="sr-only">Open Tech News Bot</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 h-[28rem] mr-4 p-0 flex flex-col">
          <header className="p-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4"/> 
                <span>Tech News Bot</span>
              </h3>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-32 h-8 bg-white/20 border-white/30 text-white text-xs">
                  <Languages className="h-3 w-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} className="text-xs">
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-muted-foreground ml-2">({lang.name})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </header>
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={cn('flex items-start gap-3', message.sender === 'user' ? 'justify-end' : '')}>
                  {message.sender === 'bot' && (
                    <Avatar className='h-8 w-8 shrink-0'>
                      <AvatarFallback className='bg-blue-600 text-white'>
                        <Bot className='h-4 w-4'/>
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn(
                    'max-w-[85%] rounded-lg px-3 py-2',
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white' 
                      : 'bg-gray-100 border'
                  )}>
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3">
                   <Avatar className='h-8 w-8'>
                      <AvatarFallback className='bg-blue-600 text-white'>
                        <Bot className='h-4 w-4'/>
                      </AvatarFallback>
                    </Avatar>
                   <div className="bg-gray-100 border rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                     <Loader2 className="h-4 w-4 animate-spin" /> 
                     <span>
                       {thinkingMessages[selectedLanguage as keyof typeof thinkingMessages]}
                     </span>
                   </div>
                 </div>
              )}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholders[selectedLanguage as keyof typeof placeholders]}
                className="pr-12"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" 
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
}
