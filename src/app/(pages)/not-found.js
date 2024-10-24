import { redirect } from 'next/navigation'

export default function NotFound() {  
  // Redirect to dashboard 404 to maintain dashboard layout
  redirect(`/dashboard/`);
}