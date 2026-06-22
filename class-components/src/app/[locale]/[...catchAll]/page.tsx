import { notFound } from 'next/navigation';

export default function LocaleCatchAll() {
  console.log('should trigger');
  notFound();
}
