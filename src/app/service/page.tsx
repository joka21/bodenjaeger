import { wordPressClient } from '@/lib/wordpress';
import WordPressPageComponent from '@/components/WordPressPage';
import { notFound } from 'next/navigation';

export const revalidate = 300; // 5 minutes

export default async function ServicePage() {
  const page = await wordPressClient.getPageBySlug('servicebereich-bodenjaeger');

  if (!page) {
    notFound();
  }

  return <WordPressPageComponent page={page} />;
}
