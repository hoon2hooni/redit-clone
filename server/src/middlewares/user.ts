import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../entities/User";
//TODO 400과 401에러 코드 차이 알아보기
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    if (!token) return next();
    const { username }: any = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOneBy({ username });

    res.locals.user = user;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "에러가 발생했습니다." });
  }
};