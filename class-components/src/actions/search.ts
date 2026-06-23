'use server';

import { redirect } from 'next/navigation';

export async function handleSearchAction(formData: FormData) {
  const searchTerm = formData.get('query') as string;
  const params = new URLSearchParams();

  if (searchTerm) params.set('search', searchTerm);
  params.set('page', '1');

  redirect(`/?${params.toString()}`);
}
