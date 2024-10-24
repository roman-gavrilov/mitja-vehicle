import { redirect } from 'next/navigation'

export default function NotFound() {
  const path = window?.location?.pathname || '';
  
  // Redirect to dashboard 404 to maintain dashboard layout
  redirect(`/dashboard${path}`);
}