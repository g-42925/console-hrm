'use client';

import { useState, useRef } from 'react';
import { MapPin, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface AddLocationButtonProps {
  companyId: string;
  companyName: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function AddLocationButton({ companyId, companyName }: AddLocationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const isSubmitting = useRef(false);

  const [form, setForm] = useState({
    nama_lokasi: '',
    alamat_lokasi: '',
    garis_lintang: '',
    garis_bujur: '',
    jangkauan_radius: 100,
    main_location: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'jangkauan_radius' ? Number(value) : value,
    }));
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus('idle');
    setErrorMessage('');
    setForm({
      nama_lokasi: '',
      alamat_lokasi: '',
      garis_lintang: '',
      garis_bujur: '',
      jangkauan_radius: 100,
      main_location: false,
    });
    isSubmitting.current = false;
    setIsOpen(true);
  };

  const handleClose = () => {
    if (status === 'loading') return;
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === 'loading' || isSubmitting.current) return;
    isSubmitting.current = true;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch(
        `https://absensi.lerynsoftware.com/api/console/add_location/${companyId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || `Server error: ${res.status}`);
      }

      setStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
        isSubmitting.current = false;
      }, 1800);
    }
    catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Terjadi kesalahan.');
      isSubmitting.current = false;
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleOpen}
        title="Tambah Lokasi"
        className="flex items-center gap-1.5 mt-3 px-3 py-1.5 text-xs font-medium text-emerald-700 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <MapPin size={13} />
        Tambah Lokasi
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Tambah Lokasi</h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{companyName}</p>
              </div>
              <button
                onClick={handleClose}
                disabled={status === 'loading'}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* Success State */}
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3">
                <CheckCircle size={52} className="text-emerald-500" />
                <p className="text-gray-700 font-medium text-lg">Lokasi berhasil ditambahkan!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                {/* Error Banner */}
                {status === 'error' && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nama Lokasi */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lokasi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nama_lokasi"
                      value={form.nama_lokasi}
                      onChange={handleChange}
                      placeholder="Contoh: Kantor Pusat Medan"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>

                  {/* Garis Lintang (Lat) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Garis Lintang (Lat) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="garis_lintang"
                      value={form.garis_lintang}
                      onChange={handleChange}
                      placeholder="Contoh: 3.5888806"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>

                  {/* Garis Bujur (Long) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Garis Bujur (Long) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="garis_bujur"
                      value={form.garis_bujur}
                      onChange={handleChange}
                      placeholder="Contoh: 98.6318991"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>

                  {/* Radius */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jangkauan Radius (m) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="jangkauan_radius"
                      value={form.jangkauan_radius}
                      onChange={handleChange}
                      placeholder="Contoh: 100"
                      min={1}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>

                  {/* Lokasi Utama */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lokasi Utama? <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="main_location"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all"
                      required
                      onChange={(e) => {
                        setForm((prev) => ({
                          ...prev,
                          main_location: e.target.value === "1"
                        }));
                      }}
                      disabled={status === 'loading'}
                    >
                      <option value="">Pilih</option>
                      <option value="1">Ya</option>
                      <option value="0">Tidak</option>
                    </select>
                  </div>
                </div>

                {/* Alamat Lokasi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Lokasi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="alamat_lokasi"
                    value={form.alamat_lokasi}
                    onChange={handleChange}
                    placeholder="Masukkan alamat lengkap lokasi"
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all resize-none"
                    required
                    disabled={status === 'loading'}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={status === 'loading'}
                    className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex items-center gap-2 px-5 py-2 text-sm text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' && <Loader2 size={15} className="animate-spin" />}
                    {status === 'loading' ? 'Menyimpan...' : 'Simpan Lokasi'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
