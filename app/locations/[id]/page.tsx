import LocationList from './LocationList';

async function getLocations(companyId: string) {
  const res = await fetch(`https://absensi.lerynsoftware.com/api/console/locationlist/${companyId}`, { 
    cache: 'no-store' 
  });
  if (!res.ok) {
    throw new Error('Failed to fetch locations');
  }
  return res.json();
}

export default async function LocationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locations = await getLocations(id);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Daftar Lokasi</h1>
      </div>
      <LocationList initialLocations={locations} />
    </div>
  );
}
