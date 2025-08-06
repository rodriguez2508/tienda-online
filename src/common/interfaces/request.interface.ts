import { Request } from 'express';
import { UserRole } from '../../modules/users/entities/user.entity';

export interface AuthenticatedRequest extends Request {
  user: {
    sub: string;    // ID del usuario
    email: string;  // Email del usuario
    role: UserRole; // Rol (enum: 'user' o 'admin')
  };
}