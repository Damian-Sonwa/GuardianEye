import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { UserRole } from '@prisma/client'

/**
 * Guard that allows only SECURITY_OFFICER and SUPER_ADMIN roles
 */
@Injectable()
export class SecurityGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new ForbiddenException('Authentication required')
    }

    if (user.role !== UserRole.SECURITY_OFFICER && user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Security officer access required')
    }

    return true
  }
}



