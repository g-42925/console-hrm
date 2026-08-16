"use client"

import { logoutAction } from "../../actions/logout"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
  return (
    <button 
      onClick={() => logoutAction()} 
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all shadow-sm"
    >
      <LogOut size={16} />
      Logout
    </button>
  )
}
