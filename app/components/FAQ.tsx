import { useState } from 'react';
import { faqs } from '@/data/mockData';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, HelpCircle, Phone, MessageCircle, Mail } from 'lucide-react';

export function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">常见问题</h1>
          <p className="text-muted-foreground">快速找到您需要的答案</p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="搜索问题..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <Badge key={category} variant="secondary" className="text-sm py-1 px-3 select-text">
              {category}
            </Badge>
          ))}
        </div>

        {/* FAQ List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5" />
              <span>常见问题解答</span>
            </CardTitle>
            <CardDescription>
              找到了 {filteredFaqs.length} 个相关问题
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-start space-x-3">
                      <Badge variant="outline" className="text-xs mt-0.5 select-text">
                        {faq.category}
                      </Badge>
                      <span className="select-text">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-16">
                      <p className="text-muted-foreground leading-relaxed select-text">
                        {faq.answer}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-8">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">未找到相关问题，请尝试其他关键词</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle>仍有疑问？</CardTitle>
            <CardDescription>
              我们的客服团队随时为您提供帮助
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Phone className="w-8 h-8 text-blue-600" />
                <div>
                  <h4 className="font-semibold select-text">电话客服</h4>
                  <p className="text-sm text-muted-foreground select-text">400-000-0000</p>
                  <p className="text-xs text-muted-foreground select-text">9:00-21:00</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <MessageCircle className="w-8 h-8 text-green-600" />
                <div>
                  <h4 className="font-semibold select-text">微信客服</h4>
                  <p className="text-sm text-muted-foreground select-text">franxx-service</p>
                  <p className="text-xs text-muted-foreground select-text">24小时在线</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Mail className="w-8 h-8 text-purple-600" />
                <div>
                  <h4 className="font-semibold select-text">邮箱支持</h4>
                  <p className="text-sm text-muted-foreground select-text">support@franxx.ai</p>
                  <p className="text-xs text-muted-foreground select-text">24小时内回复</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
