import { Injectable, CanActivate, ExecutionContext, ForbiddenException, SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from '@prisma/client'

export const ROLES_KEY = 'roles'

/**
 * Decorator to specify required roles for a route
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) {
      return true // No roles required, allow access
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new ForbiddenException('Authentication required')
    }

    const hasRole = requiredRoles.some((role) => user.role === role)
    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions')
    }

    return true
  }
}

