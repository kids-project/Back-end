import { SetMetadata } from '@nestjs/common';
import { ROLE } from 'src/context/users/users.constant';

export const Roles = (...roles: ROLE[]) => SetMetadata('roles', roles);
