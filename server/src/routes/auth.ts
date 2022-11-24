import { validate } from "class-validator";
import { Router, Request, Response } from "express";
import User from "../entities/User";

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

const router = Router();
router.post("/register", register);

export default router;
