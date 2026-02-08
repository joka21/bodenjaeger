import { wordPressClient } from '@/lib/wordpress';
import KontaktPage from '@/components/KontaktPage';
import { notFound } from 'next/navigation';

export const revalidate = 300;

export default async function KontaktPageRoute() {
  const page = await wordPressClient.getPageBySlug('beratung');

  if (!page) {
    notFound();
  }

  return <KontaktPage page={page} />;
}
