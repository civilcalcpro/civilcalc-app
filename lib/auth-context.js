'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'

import { auth } from './firebase'

const googleProvider = new GoogleAuthProvider()

const AuthContext = createContext(null)

function formatUser(firebaseUser) {
  if (!firebaseUser) return null

  const savedName =
    typeof window !== 'undefined'
      ? localStorage.getItem('cc_name')
      : ''

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    name: savedName || firebaseUser.displayName || 'Engineer',
    displayName: savedName || firebaseUser.displayName || 'Engineer',
    role: firebaseUser.email === 'admin@civilcalc.in' ? 'admin' : 'user',
    raw: firebaseUser,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(formatUser(firebaseUser))
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )

    const formattedUser = formatUser(userCredential.user)
    setUser(formattedUser)

    return formattedUser
  }

  const signup = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        provider: 'email',
        firebaseUid: userCredential.user.uid,
      }),
    })

    if (typeof window !== 'undefined') {
      localStorage.setItem('cc_name', name || 'Engineer')
    }

    const formattedUser = formatUser(userCredential.user)

    setUser(formattedUser)

    return formattedUser
  }

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)

      const firebaseUser = result.user

      const name = firebaseUser.displayName || 'Engineer'
      const email = firebaseUser.email

      if (typeof window !== 'undefined') {
        localStorage.setItem('cc_name', name)
      }

      await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password: 'google-auth-user',
          provider: 'google',
          firebaseUid: firebaseUser.uid,
        }),
      })

      const formattedUser = formatUser(firebaseUser)

      setUser(formattedUser)

      return formattedUser
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const updateProfileLocal = (name, email) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cc_name', name || 'Engineer')
    }

    setUser((prev) => ({
      ...prev,
      name: name || 'Engineer',
      displayName: name || 'Engineer',
      email: email || prev?.email,
    }))
  }

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email)
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    window.location.href = '/login'
  }

  const authFetch = useCallback(async (url, options = {}) => {
    const currentUser = auth.currentUser
    const token = currentUser ? await currentUser.getIdToken() : null

    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    if (currentUser?.uid) {
      headers['X-User-Id'] = currentUser.uid
    }

    if (currentUser?.email) {
      headers['X-User-Email'] = currentUser.email
    }

    return fetch(url, {
      ...options,
      headers,
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        resetPassword,
        authFetch,
        updateProfileLocal,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return ctx
}
