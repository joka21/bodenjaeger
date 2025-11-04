import { wordPressClient } from '@/lib/wordpress';
import WordPressPageComponent from '@/components/WordPressPage';
import { notFound } from 'next/navigation';

export const revalidate = 300; // 5 minutes

export default async function FachmarktHueckelhovenPage() {
  const page = await wordPressClient.getPageBySlug('filiale-hueckelhoven');

  if (!page) {
    notFound();
  }

  return <WordPressPageComponent page={page} />;
}
