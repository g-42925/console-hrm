"use client"

import { useFormAction } from "@/hooks/useFormAction";
import { loginAction, FormState } from "@/actions/login";
import { Mail, Lock, Building2, ArrowRight, User } from "lucide-react";

export default function Form() {


  const loginFn = useFormAction(loginAction, {
    onSuccess: (state: FormState) => {
      console.log(state)
    }
  })

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex items-center justify-center p-4 overflow-hidden relative font-sans">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10">

        {/* Left Side: Branding / Info */}
        <div className="md:w-1/2 p-10 flex flex-col justify-between relative bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border-b md:border-b-0 md:border-r border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
                NexusHR
              </span>
            </div>

            <h1 className="text-4xl font-bold mb-4 text-white leading-tight tracking-tight">
              Manage your workforce <br />
              <span className="text-indigo-400">intelligently.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Access the ultimate human resource management console designed for modern, high-performing teams.
            </p>
          </div>

          <div className="mt-12 hidden md:block">
            <div className="flex -space-x-4 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500">Trusted by over 10,000+ companies worldwide.</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-10 sm:p-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back</h2>
            <p className="text-slate-400 mb-8">Sign in to your console to continue.</p>

            <form action={loginFn.formAction} className="space-y-6">

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    name="username"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button type="submit" disabled={loginFn.isPending} className="w-full relative group overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl py-3 px-4 transition-all duration-300 ease-out flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-70 disabled:cursor-not-allowed">
                {loginFn.isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Login
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );

}