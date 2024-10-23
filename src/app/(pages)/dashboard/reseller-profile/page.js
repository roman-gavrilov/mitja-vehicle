import { headers } from 'next/headers';
import ProfileForm from './ProfileForm';

async function getProfile() {
  try {
    const headersList = headers();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/user`, {
      headers: {
        cookie: headersList.get('cookie'),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export default async function ResellerProfilePage() {
  const profileData = await getProfile();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <ProfileForm initialData={profileData || {
          firstName: "",
          lastName: "",
          email: "",
          companyDetails: {
            additionalPhones: [],
            additionalEmails: [],
            phone: "",
            companyName: "",
            logo: null,
            street: "",
            zip: "",
            city: "",
            vatNumber: "",
            workingHours: {
              monday: { start: "09:00", end: "17:00", isOpen: false },
              tuesday: { start: "09:00", end: "17:00", isOpen: false },
              wednesday: { start: "09:00", end: "17:00", isOpen: false },
              thursday: { start: "09:00", end: "17:00", isOpen: false },
              friday: { start: "09:00", end: "17:00", isOpen: false },
              saturday: { start: "09:00", end: "17:00", isOpen: false },
              sunday: { start: "09:00", end: "17:00", isOpen: false },
            },
          },
        }} />
      </div>
    </div>
  );
}