import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../interfaces/request.interface';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - User: ${req.user?.sub || 'Guest'}`);
        next();
      }
}