import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import { compare } from "bcryptjs"
import { sendWelcomeEmail } from "./email"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          return null
        }

        // Verificar contraseña
        const isPasswordValid = await compare(credentials.password, user.password)
        
        if (!isPasswordValid) {
          return null
        }

        console.log("Usuario autenticado:", {
          id: user.id,
          email: user.email,
          name: user.name
        })
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, isNewUser }) {
      // Enviar email de bienvenida para nuevos usuarios de Google
      if (isNewUser && account?.provider === "google" && user.email && user.name) {
        try {
          console.log("Enviando email de bienvenida a nuevo usuario de Google:", user.email)
          await sendWelcomeEmail({
            userName: user.name,
            userEmail: user.email
          })
          console.log("Email de bienvenida enviado exitosamente a:", user.email)
        } catch (error) {
          console.error("Error enviando email de bienvenida:", error)
          // No bloquear el signin si falla el email
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
}