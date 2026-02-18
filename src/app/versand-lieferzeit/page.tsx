import { wordPressClient } from '@/lib/wordpress';
import VersandLieferzeitPage from '@/components/VersandLieferzeitPage';
import { notFound } from 'next/navigation';

export const revalidate = 300;

export default async function VersandLieferzeitPageRoute() {
  const page = await wordPressClient.getPageBySlug('versandkosten-lieferzeit');

  if (!page) {
    notFound();
  }

  return <VersandLieferzeitPage page={page} />;
}
