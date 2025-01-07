import type { Request, Response, NextFunction} from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found - ${req.method} ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        code: statusCode,
        message: err.message,
        stack: process.env.NODE_ENV === 'dev' ? err.stack : null,
    });
};