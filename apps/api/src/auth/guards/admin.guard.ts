import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { UserRole } from '@prisma/client'

/**
 * Guard that allows only SUPER_ADMIN role
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new ForbiddenException('Authentication required')
    }

    if (user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Admin access required')
    }

    return true
  }
}



