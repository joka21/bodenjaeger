import { wordPressClient } from '@/lib/wordpress';
import WordPressPageComponent from '@/components/WordPressPage';
import { notFound } from 'next/navigation';

export const revalidate = 300; // 5 minutes

export default async function AgbPage() {
  const page = await wordPressClient.getPageBySlug('allgemeine-geschaeftsbedingungen');

  if (!page) {
    notFound();
  }

  return <WordPressPageComponent page={page} />;
}
