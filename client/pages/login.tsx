import React, { FormEvent, useState } from "react";
import InputGroup from "@components/InputGroup";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthDispatch, useAuthState } from "@contexts/Auth";
import { User } from "@types";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

const Login = () => {
  let router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const { authenticated } = useAuthState();
  console.log(useAuthState());

  const dispatch = useAuthDispatch();

  if (authenticated) router.push("/");
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const res = await axios.post<{ user: User }>(
        "/auth/login",
        { password, username },
        { withCredentials: true }
      );
      console.log(res.data);
      dispatch({ type: "LOGIN", payload: res.data.user });

      router.push("/");
    } catch (error: any) {
      console.log(error);
      setErrors(error.response?.data || {});
    }
  };

  return (
    <div className="bg-white">
      <div className="flex h-screen flex-col items-center justify-center p-6">
        <div className="mx-auto w-10/12 md:w-96">
          <h1 className="mb-2 text-lg font-medium">로그인</h1>
          <form onSubmit={handleSubmit}>
            <InputGroup
              placeholder="Username"
              value={username}
              setValue={setUsername}
              error={errors.username}
            />
            <InputGroup
              placeholder="Password"
              value={password}
              setValue={setPassword}
              error={errors.password}
            />
            <button className="mb-1 w-full rounded border border-gray-400 bg-gray-400 py-2 text-xs font-bold uppercase text-white">
              로그인
            </button>
          </form>
          <small>
            아직 아이디가 없나요?
            <Link href="/register" className="ml-1 uppercase text-blue-500">
              회원가입
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
