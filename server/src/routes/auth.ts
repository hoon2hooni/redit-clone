import { validate, isEmpty } from "class-validator";
import { Router, Request, Response } from "express";
import User from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    let errors: any = {};
    //이메일과 유저이름이 이미 User에 존재하는지 확인
    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    //이미 있다면 errors객체에 넣어줌
    if (emailUser) errors.email = "이미 해당 이메일이 존재합니다.";
    if (usernameUser) errors.username = "이미 해당 사용자이름이 존재합니다.";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;
    //
    errors = await validate(user);
    if (errors.length > 0) {
      errors = errors.reduce((acc: any, curr: any) => {
        acc[curr.property] = Object.values(curr.constraints);
        return acc;
      }, {});
      return res.status(400).json(errors);
    }
    await user.save();
    return res.json(user);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    let errors: any = {};
    if (isEmpty(username))
      errors.username = "사용자 이름은 비워둘 수 없습니다.";
    if (isEmpty(password)) errors.password = "비밀번호는 비워둘 수 없습니다.";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    //db에서 유저 찾기
    const user = await User.findOneBy({ username });
    if (!user)
      return res
        .status(404)
        .json({ username: "해당 유저가 존재하지 않습니다." });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ password: "비밀번호가 잘못되었습니다." });

    //비밀번호가 맞다면 토큰 생성
    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    //쿠키저장
    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, //1주일
        path: "/",
      })
    );
    return res.json({ user, token });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const me = async (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

const router = Router();

router.get("/me", userMiddleware, authMiddleware, me);
router.post("/register", register);
router.post("/login", login);

export default router;
