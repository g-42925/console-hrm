'use client';

import { useState } from 'react';
import { Pencil, MapPin } from 'lucide-react';

interface Location {
  lokasi_id: string;
  nama_lokasi: string;
  alamat_lokasi: string;
  garis_lintang: string;
  garis_bujur: string;
  jangkauan_radius: string;
  main_location: string;
}

export default function LocationList({ initialLocations }: { initialLocations: Location[] }) {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [isMainLocation, setIsMainLocation] = useState<string>("0");
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [locationId, setLocationId] = useState<string>("");
  const [locationName, setLocationName] = useState<string>("");
  const [locationAddress, setLocationAddress] = useState<string>("");
  const [locationLat, setLocationLat] = useState<string>("");
  const [locationLong, setLocationLong] = useState<string>("");
  const [locationRadius, setLocationRadius] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleEdit = (location: Location) => {
    setLocationId(location.lokasi_id);
    setLocationName(location.nama_lokasi);
    setLocationAddress(location.alamat_lokasi);
    setLocationLat(location.garis_lintang);
    setLocationLong(location.garis_bujur);
    setLocationRadius(location.jangkauan_radius);
    setEditingLocation(location);
    setIsMainLocation(location.main_location);
  };

  const closeModal = () => {
    setEditingLocation(null);
    setErrorMsg("");
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg("");

    const params = {
      nama_lokasi: locationName,
      alamat_lokasi: locationAddress,
      garis_lintang: locationLat,
      garis_bujur: locationLong,
      jangkauan_radius: locationRadius,
      main_location: parseInt(isMainLocation),
    };

    try {
      const res = await fetch(`https://absensi.lerynsoftware.com/api/console/edit_location/${locationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || `Server error: ${res.status}`);
      }

      window.location.reload();
    }
    catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan.');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <div key={loc.lokasi_id} className="p-6 border rounded-xl hover:shadow-lg transition-shadow bg-white relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => handleEdit(loc)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Edit Location"
              >
                <Pencil size={18} />
              </button>
            </div>

            <div className="flex items-start space-x-3 mb-4 pr-10">
              <MapPin className="text-gray-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h2 className="text-xl font-semibold">{loc.nama_lokasi}</h2>
                <p className="text-sm text-gray-500 mt-1 line-clamp-3">{loc.alamat_lokasi}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Radius:</span>
                <span>{loc.jangkauan_radius} m</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Lat:</span>
                <span>{loc.garis_lintang}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Long:</span>
                <span>{loc.garis_bujur}</span>
              </div>
            </div>
          </div>
        ))}
        {locations.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            Tidak ada lokasi yang ditemukan.
          </div>
        )}
      </div>

      {editingLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b">
              <h3 className="text-xl font-semibold">Edit Lokasi</h3>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                  {errorMsg}
                </div>
              )}
              <div className="hidden">
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi ID</label>
                <input
                  type="text"
                  onChange={(e) => setLocationId(e.target.value)}
                  defaultValue={editingLocation.lokasi_id}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-500"
                  readOnly
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lokasi</label>
                  <input
                    type="text"
                    onChange={(e) => setLocationName(e.target.value)}
                    defaultValue={editingLocation.nama_lokasi}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Garis Lintang (Lat)</label>
                  <input
                    type="text"
                    onChange={(e) => setLocationLat(e.target.value)}
                    defaultValue={editingLocation.garis_lintang}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Garis Bujur (Long)</label>
                  <input
                    type="text"
                    onChange={(e) => setLocationLong(e.target.value)}
                    defaultValue={editingLocation.garis_bujur}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jangkauan Radius (m)</label>
                  <input
                    type="number"
                    onChange={(e) => setLocationRadius(e.target.value)}
                    defaultValue={editingLocation.jangkauan_radius}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apakah Lokasi Utama?</label>
                  <select defaultValue={isMainLocation === "1" ? "1" : "0"} onChange={(e) => setIsMainLocation(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                    <option value="0">Tidak</option>
                    <option value="1">Ya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lokasi</label>
                <textarea
                  onChange={(e) => setLocationAddress(e.target.value)}
                  defaultValue={editingLocation.alamat_lokasi}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                  required
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={closeModal} disabled={isSubmitting} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium disabled:opacity-50">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
