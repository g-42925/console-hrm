import Link from 'next/link';
import AddLocationButton from './AddLocationButton';
import AddCompanyButton from './AddCompanyButton';
import LogoutButton from '@/components/LogoutButton';

async function getCompanies() {
  const res = await fetch('https://absensi.lerynsoftware.com/api/console/companylist', { 
    cache: 'no-store' 
  });
  if (!res.ok) {
    throw new Error('Failed to fetch companies');
  }
  return res.json();
}

interface Company {
  id: string;
  company_name: string;
  phone: string;
  email: string;
  logo: string;
  address: string;
}

export default async function HomePage() {
  const companies = await getCompanies();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Perusahaan</h1>
        <div className="flex items-center gap-3">
          <AddCompanyButton />
          <LogoutButton />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company: Company) => (
          <div key={company.id} className="p-6 border rounded-xl hover:shadow-lg transition-shadow bg-white h-full flex flex-col">
            <Link href={`/locations/${company.id}`} className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                {company.logo && (
                  <img src={company.logo} alt={company.company_name} className="w-12 h-12 rounded-full object-cover" />
                )}
                <h2 className="text-xl font-semibold">{company.company_name}</h2>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Telepon:</strong> {company.phone}</p>
                <p><strong>Email:</strong> {company.email}</p>
                <p className="line-clamp-2"><strong>Alamat:</strong> {company.address}</p>
              </div>
            </Link>
            <AddLocationButton companyId={company.id} companyName={company.company_name} />
          </div>
        ))}
      </div>
    </div>
  );
}