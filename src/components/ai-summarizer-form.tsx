
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { getResourceSummary } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LanguageSelector, createLanguagePrompt, getLocalizedText } from '@/components/language-selector';

const FormSchema = z.object({
  resourceContent: z.string().min(100, 'Please paste content with at least 100 characters to summarize.'),
});

const localizedTexts = {
  title: {
    en: 'AI Resource Summarizer',
    hi: 'एआई रिसोर्स सारांशकर्ता',
    te: 'AI రిసోర్స్ సారాంశకర్త',
    ta: 'AI வள சுருக்கம்'
  },
  description: {
    en: 'Paste any article, blog post, or documentation content below to get a concise summary from our AI.',
    hi: 'हमारे एआई से संक्षिप्त सारांश प्राप्त करने के लिए नीचे कोई भी लेख, ब्लॉग पोस्ट या दस्तावेज़ सामग्री पेस्ट करें।',
    te: 'మా AI నుండి సంక్షిప్త సారాంశం పొందడానికి దిగువ ఏదైనా వ్యాసం, బ్లాగ్ పోస్ట్ లేదా డాక్యుమెంటేషన్ కంటెంట్‌ను పేస్ట్ చేయండి।',
    ta: 'எங்கள் AI இலிருந்து சுருக்கமான சுருக்கத்தைப் பெற கீழே எந்த கட்டுரை, வலைப்பதிவு இடுகை அல்லது ஆவண உள்ளடக்கத்தையும் ஒட்டவும்.'
  },
  resourceContent: {
    en: 'Resource Content',
    hi: 'संसाधन सामग्री',
    te: 'వనరుల కంటెంట్',
    ta: 'வள உள்ளடக்கம்'
  },
  placeholder: {
    en: 'Paste the content of the article or blog post here...',
    hi: 'यहाँ लेख या ब्लॉग पोस्ट की सामग्री पेस्ट करें...',
    te: 'వ్యాసం లేదా బ్లాగ్ పోస్ట్ యొక్క కంటెంట్‌ను ఇక్కడ పేస్ట్ చేయండి...',
    ta: 'கட்டுரை அல்லது வலைப்பதிவு இடுகையின் உள்ளடக்கத்தை இங்கே ஒட்டவும்...'
  },
  summarizeButton: {
    en: 'Summarize Content',
    hi: 'सामग्री का सारांश करें',
    te: 'కంటెంట్‌ను సారాంశం చేయండి',
    ta: 'உள்ளடக்கத்தை சுருக்கவும்'
  },
  summaryTitle: {
    en: 'Summary',
    hi: 'सारांश',
    te: 'సారాంశం',
    ta: 'சுருக்கம்'
  }
};

export function AiSummarizerForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      resourceContent: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setSummary(null);
    
    // Create language-specific prompt if not English
    const languagePrompt = selectedLanguage !== 'en' 
      ? createLanguagePrompt(data.resourceContent, selectedLanguage)
      : data.resourceContent;
    
    const result = await getResourceSummary({ resourceContent: languagePrompt });
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result.data) {
      setSummary(result.data.summary);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-headline">
                {getLocalizedText(localizedTexts.title, selectedLanguage)}
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                {getLocalizedText(localizedTexts.description, selectedLanguage)}
              </p>
            </div>
            <LanguageSelector 
              value={selectedLanguage} 
              onValueChange={setSelectedLanguage}
              size="sm"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="resourceContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getLocalizedText(localizedTexts.resourceContent, selectedLanguage)}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={getLocalizedText(localizedTexts.placeholder, selectedLanguage)}
                        className="min-h-[250px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {getLocalizedText(localizedTexts.summarizeButton, selectedLanguage)}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {summary && (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className='font-headline text-2xl'>
                  {getLocalizedText(localizedTexts.summaryTitle, selectedLanguage)}
                </CardTitle>
            </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">{summary}</div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
