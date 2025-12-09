import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { UserRole } from '@prisma/client'

/**
 * Guard that allows only USER role (regular users)
 */
@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new ForbiddenException('Authentication required')
    }

    // Allow USER role only (not security or admin)
    if (user.role !== UserRole.USER) {
      throw new ForbiddenException('User access required')
    }

    return true
  }
}


