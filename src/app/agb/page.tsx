import { wordPressClient } from '@/lib/wordpress';
import WordPressPage from '@/components/WordPressPage';
import { notFound } from 'next/navigation';

export const revalidate = 300;

export default async function AgbPage() {
  const page = await wordPressClient.getPageBySlug('allgemeine-geschaeftsbedingungen');

  if (!page) {
    notFound();
  }

  return <WordPressPage page={page} />;
}
