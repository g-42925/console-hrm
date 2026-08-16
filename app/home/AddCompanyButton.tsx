'use client';

import { useState } from 'react';
import { Plus, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function AddCompanyButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    company_name: '',
    phone: '',
    email: '',
    address: '',
    admin_name: '',
    admin_password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleOpen = () => {
    setStatus('idle');
    setErrorMessage('');
    setForm({
      company_name: '',
      phone: '',
      email: '',
      address: '',
      admin_name: '',
      admin_password: '',
    });
    setLogoFile(null);
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
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
      const formData = new FormData();
      formData.append('company_name', form.company_name);
      formData.append('phone', form.phone);
      formData.append('email', form.email);
      formData.append('address', form.address);
      formData.append('logo', logoFile as File);
      formData.append('admin_name', form.admin_name);
      formData.append('admin_password', form.admin_password);

      const res = await fetch(
        'https://absensi.lerynsoftware.com/api/console/add_company', {
        method: 'POST',
        body: formData,
      }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || `Server error: ${res.status}`);
      } else {
        setStatus('success');
        setTimeout(() => {
          setIsOpen(false);
          window.location.reload();
        }, 1500);
      }
    }
    catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm"
      >
        <Plus size={16} />
        Tambah Perusahaan
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
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-lg font-semibold text-gray-800">Tambah Perusahaan Baru</h3>
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
                <p className="text-gray-700 font-medium text-lg">Perusahaan berhasil ditambahkan!</p>
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

                {/* Logo Perusahaan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo Perusahaan
                  </label>
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200 shrink-0">
                        <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                        <span className="text-xs">No Logo</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all outline-none"
                      disabled={status === 'loading'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nama Perusahaan */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Perusahaan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={form.company_name}
                      onChange={handleChange}
                      placeholder="Contoh: PT. Maju Mundur"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Contoh: contact@perusahaan.com"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>

                  {/* Telepon */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Contoh: 081234567890"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>

                  {/* Nama Admin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Admin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="admin_name"
                      value={form.admin_name}
                      onChange={handleChange}
                      placeholder="Contoh: John Doe"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>

                  {/* Password Admin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password Admin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="admin_password"
                      value={form.admin_password}
                      onChange={handleChange}
                      placeholder="Contoh: admin123"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                      required
                      disabled={status === 'loading'}
                    />
                  </div>
                </div>

                {/* Alamat */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Masukkan alamat lengkap perusahaan"
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all resize-none"
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
                    className="flex items-center gap-2 px-5 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' && <Loader2 size={15} className="animate-spin" />}
                    {status === 'loading' ? 'Menyimpan...' : 'Simpan Perusahaan'}
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
