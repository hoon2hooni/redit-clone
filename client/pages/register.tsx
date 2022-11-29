import axios, { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import InputGroup from "../components/InputGroup";
import { useAuthState } from "@contexts/Auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const { authenticated } = useAuthState();

  let router = useRouter();

  if (authenticated) router.push("/");
  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const res = await axios.post("/auth/register", {
        email,
        password,
        username,
      });
      console.log("res", res);
      // router.push("/login");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setErrors(error.response?.data || {});
        return;
      }

      if (error instanceof Error) {
        setErrors(error.message);
        return;
      }
    }
  };

  return (
    <div className="bg-white">
      <div className="flex h-screen flex-col items-center justify-center p-6">
        <div className="mx-auto w-10/12 md:w-96">
          <h1 className="mb-2 text-lg font-medium">회원가입</h1>
          <form onSubmit={handleSubmit}>
            <InputGroup
              placeholder="Email"
              value={email}
              setValue={setEmail}
              error={errors.email}
            />
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
              회원 가입
            </button>
          </form>
          <small>
            이미 가입하셨나요?
            <Link href="/login" className="ml-1 uppercase text-blue-500">
              로그인
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;
