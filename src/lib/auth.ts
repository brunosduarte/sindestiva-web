import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { loginUser } from './api'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'email@example.com',
        },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const response = await loginUser({
            email: credentials.email,
            password: credentials.password,
          })

          if (response.token && response.user) {
            return {
              id: response.user._id,
              name: response.user.name,
              email: response.user.email,
              role: response.user.role,
              token: response.token,
            }
          }
          return null
        } catch (error) {
          console.error('Erro na autenticação:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.accessToken = user.token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 dia
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Tipos do NextAuth
declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string
    role: string
    token: string
  }

  interface Session {
    user: User & {
      id: string
      role: string
    }
    accessToken: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    accessToken: string
  }
}
