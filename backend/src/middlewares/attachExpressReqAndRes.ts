import { CONFIGS } from "../common/configs";
import { Response, Request, NextFunction } from "express";
import getRawBody from 'raw-body';

export async function attachExpressReqAndRes(req: Request, res: Response, next: NextFunction) {
  // if (req.url?.startsWith(CONFIGS.WEBHOOK_URL)) {
  //   const rawBody = await getRawBody(req, {
  //     length: req.headers['content-length'],
  //     encoding: req.headers['content-encoding'] || 'utf-8',
  //   });
  //   (req as any).rawBody = rawBody;
  // }

  req.res = res;
  (req as any).expressRawRequest = req;
  next();
  }