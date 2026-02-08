import { wordPressClient } from '@/lib/wordpress';
import ServicePage from '@/components/ServicePage';
import { notFound } from 'next/navigation';

export const revalidate = 300;

export default async function ServicePageRoute() {
  const page = await wordPressClient.getPageBySlug('servicebereich-bodenjaeger');

  if (!page) {
    notFound();
  }

  return <ServicePage page={page} />;
}
