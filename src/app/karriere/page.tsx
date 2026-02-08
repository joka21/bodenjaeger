import { wordPressClient } from '@/lib/wordpress';
import KarrierePage from '@/components/KarrierePage';
import { notFound } from 'next/navigation';

export const revalidate = 300;

export default async function KarrierePageRoute() {
  const page = await wordPressClient.getPageBySlug('karriere');

  if (!page) {
    notFound();
  }

  return <KarrierePage page={page} />;
}
