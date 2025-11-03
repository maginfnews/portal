import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
// Definindo tipos localmente até o Prisma gerar corretamente
type UserRole = 'MAGINF_ADMIN' | 'CLIENTE_ADMIN' | 'CLIENTE_USER'

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  tenantId?: string
  nome: string
}

export interface AuthUser {
  id: string
  nome: string
  email: string
  role: UserRole
  tenantId?: string
  tenant?: {
    id: string
    nome: string
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      tenant: {
        select: {
          id: true,
          nome: true,
        },
      },
    },
  })

  if (!user || !user.ativo) {
    return null
  }

  const isValidPassword = await verifyPassword(password, user.senhaHash)
  if (!isValidPassword) {
    return null
  }

  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId || undefined,
    tenant: user.tenant || undefined,
  }
}

export async function getUserFromToken(token: string): Promise<AuthUser | null> {
  const payload = verifyToken(token)
  if (!payload) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      tenant: {
        select: {
          id: true,
          nome: true,
        },
      },
    },
  })

  if (!user || !user.ativo) {
    return null
  }

  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId || undefined,
    tenant: user.tenant || undefined,
  }
}
