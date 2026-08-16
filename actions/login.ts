"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export interface FormState {
  success: boolean
  message?: string
}

export async function loginAction(prevState: FormState, formData: FormData): Promise<FormState> {
  try {

    // make : fetch post login code
    const res = await fetch("https://absensi.lerynsoftware.com/api/console/login", {
      method: "POST",
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    })

    const data = await res.json()

    if (data.success) {
      const cookieStore = await cookies()
      cookieStore.set("session_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 hari
        path: "/",
      })
    }

    return {
      success: data.success,
      message: data.message ?? 'request done with no message',
    }
  }
  catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "",
    }
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("session_token")
  redirect("/login")
}