'use client';

import { LogOut } from 'lucide-react';
import { logoutAction } from '@/actions/logout';
import { useTransition } from 'react';

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium border border-red-200 disabled:opacity-50"
      title="Keluar"
    >
      <LogOut size={16} />
      {isPending ? 'Keluar...' : 'Keluar'}
    </button>
  );
}
