'use client';

import { ArrowRight, HelpCircle, Mail, MessageCircle, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const supportOptions = [
  {
    id: 'articles',
    icon: HelpCircle,
    title: 'Help articles',
    action: 'See articles',
  },
  {
    id: 'chat',
    icon: MessageCircle,
    title: 'Chat with support',
    action: 'Chat now',
  },
  {
    id: 'call',
    icon: Phone,
    title: 'Call us',
    action: 'Call us',
  },
  {
    id: 'email',
    icon: Mail,
    title: 'Send us an email',
    action: 'Contact us',
  },
];

const featuredArticles = [
  {
    id: 1,
    title: 'Setting Up Your Dojo Planner Account',
    description: 'This article guides you through creating your account from scratch, selecting the right subscription tier for your gym, and completing the initial setup steps to get your CRM ready for use.',
  },
  {
    id: 2,
    title: 'Importing Your Student Roster',
    description: 'Learn how to import your current student list into Dojo Planner using our CSV template or manual entry, with tips on formatting fields like names, contact info, belt rank, and active status.',
  },
  {
    id: 3,
    title: 'Adding and Editing Student Profiles',
    description: 'Learn how to add new students into the system, update their personal and training information, attach documents like waivers, and keep their records accurate and up to date.',
  },
  {
    id: 4,
    title: 'Creating and Managing Class Schedules',
    description: 'Set up single or recurring classes, assign instructors, manage time slots and class capacity, and organize your weekly timetable with built in scheduling tools.',
  },
];

export function HelpPage() {
  const t = useTranslations('Help');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
      </div>

      {/* Support Options Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {supportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card key={option.id} className="p-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <Icon className="h-8 w-8 text-foreground" />
                <h3 className="font-semibold text-foreground">{option.title}</h3>
                <Button variant="outline" size="sm">
                  {option.action}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Featured Articles Section */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-foreground">{t('featured_articles_title')}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {featuredArticles.map(article => (
            <Card key={article.id} className="flex flex-col gap-4 p-6">
              <h3 className="font-semibold text-foreground">{article.title}</h3>
              <p className="flex-1 text-sm text-muted-foreground">{article.description}</p>
              <Button variant="outline" size="sm" className="w-fit">
                {t('read_article_button')}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* See All Articles Button */}
      <div className="flex justify-center">
        <Button>
          {t('see_all_articles_button')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
