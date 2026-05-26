'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth'

import { useRouter } from 'next/navigation'
import { auth } from './firebase'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Bootstrap from localStorage
  useEffect(() => {
    try {
      const t = localStorage.getItem('cc_token')
      const u = localStorage.getItem('cc_user')
      if (t && u) {
        setToken(t)
        setUser(JSON.parse(u))
      }
    } catch (e) {}
    setLoading(false)
  }, [])

  const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  )

  setUser(userCredential.user)

  return userCredential.user
}
  

  const signup = async (name, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  )

  setUser(userCredential.user)

  return userCredential.user
}
const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email)
}
  const logout = useCallback(() => {
    localStorage.removeItem('cc_token')
    localStorage.removeItem('cc_user')
    setToken(null)
    setUser(null)
    router.push('/login')
  }, [router])

  // Authed fetch helper
  const authFetch = useCallback(
    async (url, options = {}) => {
      const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      }
      if (token) headers['Authorization'] = `Bearer ${token}`
      const res = await fetch(url, { ...options, headers })
      return res
    },
    [token]
  )

  return (
   <AuthContext.Provider
  value={{
    user,
    loading,
    login,
    signup,
    logout,
    resetPassword
  }}
>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
