import { wordPressClient } from '@/lib/wordpress';
import WordPressPage from '@/components/WordPressPage';
import { notFound } from 'next/navigation';

export const revalidate = 300;

export default async function DatenschutzPage() {
  const page = await wordPressClient.getPageBySlug('datenschutzerklaerung-2');

  if (!page) {
    notFound();
  }

  return <WordPressPage page={page} />;
}
