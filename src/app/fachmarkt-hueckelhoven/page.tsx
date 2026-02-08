import { wordPressClient } from '@/lib/wordpress';
import FachmarktPage from '@/components/FachmarktPage';
import { notFound } from 'next/navigation';

export const revalidate = 300;

export default async function FachmarktHueckelhovenPage() {
  const page = await wordPressClient.getPageBySlug('filiale-hueckelhoven');

  if (!page) {
    notFound();
  }

  return <FachmarktPage page={page} />;
}
