import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export function validateData(schema: z.ZodObject<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const castedError = error as ZodError;
                const errorMessages = castedError.errors.map((err: any) => ({ message: `${err.path.join('.')}: ${err.message}` }));
                res.status(400).json({ error: 'Invalid Data', details: errorMessages });
            } else {
                res.status(500).json({ error: 'Error validating data' });
            }
        }
    };
    
}
