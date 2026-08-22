'use client';

import { useEffect, useState, useRef } from 'react';
import { Plus, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function AddActionButton() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [form, setForm] = useState({ keterangan: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, ['keterangan']: e.target.value }));
  };



  const handleOpen = () => {
    setStatus('idle');
    setErrorMessage('');
    setForm({ keterangan: '', });
    setIsOpen(true);
  };

  const handleClose = () => {
    if (status === 'loading') return;
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const key = form.keterangan.split('/')
      const formData = new FormData();

      formData.append('directory', key[0])
      formData.append('class', key[1])
      formData.append('method', key[2])
      formData.append('description', key[3])

      const params = { method: 'POST', body: formData }
      const res = await fetch('https://absensi.lerynsoftware.com/api/console/add_action', params);

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || `Server error: ${res.status}`);
      }
      else {
        setStatus('idle');
        setForm((prev) => ({ ...prev, ['keterangan']: '' }));
      }
    }
    catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

  useEffect(() => {
    if (isOpen && status === 'idle' && form.keterangan === '') {
      // Delay kecil untuk memastikan DOM sudah stabil
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isOpen, status, form.keterangan]);

  return (
    <>
      {/* Trigger Button */}
      <button onClick={handleOpen} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm">
        <Plus size={16} />
        Tambah Aksi
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-lg font-semibold text-gray-800">Tambah Aksi</h3>
              <button onClick={handleClose} disabled={status === 'loading'} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50">
                <X size={18} />
              </button>
            </div>

            {/* Success State */}
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3">
                <CheckCircle size={52} className="text-emerald-500" />
                <p className="text-gray-700 font-medium text-lg">Aksi berhasil ditambahkan!</p>
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
                  {/* Nama Perusahaan */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keterangan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={form.keterangan}
                      onChange={handleChange}
                      placeholder="Contoh: PT. Maju Mundur"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                      required
                      disabled={status === 'loading'}
                      ref={inputRef}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={handleClose} disabled={status === 'loading'} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium disabled:opacity-50">
                    Batal
                  </button>
                  <button type="submit" disabled={status === 'loading'} className="flex items-center gap-2 px-5 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                    {status === 'loading' && <Loader2 size={15} className="animate-spin" />}
                    {status === 'loading' ? 'Menyimpan...' : 'Simpan Aksi'}
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
