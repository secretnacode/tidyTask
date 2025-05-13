"use client";

import { LoginUserType, SignUpUserValType } from "@/type";
import {
  ValidateUserLogin,
  ValidateUserSignup,
} from "@/util/functions/validateFrontFunction";
import { Eye, EyeClosed } from "lucide-react";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useNotification } from "./providers/notificationProvider";
import { useRouter } from "next/navigation";

export function LandingForm() {
  const [isSignup, setIsSignUp] = useState<boolean>(true);

  const handleSignUpForm = useCallback<(val: boolean) => void>(
    (val: boolean) => {
      setIsSignUp(val);
    },
    []
  );

  return (
    <div>
      {isSignup ? (
        <SignUp handleSignUpForm={handleSignUpForm} />
      ) : (
        <LogIn handleSignUpForm={handleSignUpForm} />
      )}
    </div>
  );
}

export function SignUp({
  handleSignUpForm,
}: {
  handleSignUpForm: (val: boolean) => void;
}) {
  const [passHide, setPassHide] = useState<boolean>(true);
  const [confirmPassHide, setConfirmPassHide] = useState<boolean>(true);
  const { showNotification } = useNotification();
  const [userVal, setUserVal] = useState<SignUpUserValType>({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogInFormView = useCallback(() => {
    handleSignUpForm(false);
  }, [handleSignUpForm]);

  const handleUserVal = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUserVal((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleForm = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const validation = ValidateUserSignup(userVal);

      if (!validation.validate)
        return showNotification({
          message: `${validation.message}`,
          type: "warning",
        });

      try {
        const res = await fetch(`/api/us3ru4th/signUp`, {
          method: "POST",
          body: JSON.stringify({
            username: userVal.username,
            password: userVal.password,
          }),
        });

        const data = await res.json();

        // check if the response is ok, if not, throw an error
        if (!res.ok) throw new Error(data.message);

        // if the response is ok, set the form into login form and setting a notification
        // that will indicate that the user is created successfully
        handleSignUpForm(false);
        showNotification({
          message: "User created successfully",
          type: "success",
        });

        // after a certain time the value of the notification will go back to its defaul value
      } catch (error) {
        const err = error as Error;
        console.log(err.message);

        // will call the setNotification function from the notification provider
        // to give an error message to the provider
        showNotification({ message: err.message, type: "error" });

        // after a certain time the value of the notification will go back to its defaul value
      }
    },
    [userVal, handleSignUpForm, showNotification]
  );

  return (
    <div className="w-full md:max-w-[370px] border-2 p-5 rounded-[15px]">
      <h1 className="text-center font-black mb-8 text-2xl">Sign Up</h1>
      <form onSubmit={handleForm} className="flex flex-col gap-13">
        <div className="grid grid-rows-3 gap-3">
          {/* Username  */}
          <div>
            <label htmlFor="username" className="landing-formLabel">
              Username:
            </label>
            <div>
              <input
                type="text"
                name="username"
                value={userVal.username}
                onChange={handleUserVal}
                placeholder="john doe"
                className="landing-formInput !px-4"
              />
            </div>
          </div>

          {/* Password  */}
          <div>
            <label htmlFor="pass" className="landing-formLabel">
              Password:
            </label>
            <div className="relative">
              <input
                type={passHide ? "password" : "text"}
                name="password"
                value={userVal.password}
                onChange={handleUserVal}
                placeholder="12345"
                className="landing-formInput"
              />

              <div
                className="landing-hidePass"
                onClick={() => setPassHide((prev) => !prev)}
              >
                {passHide ? <EyeClosed /> : <Eye />}
              </div>
            </div>
          </div>

          {/* Confirm Password  */}
          <div>
            <label htmlFor="confirmPass" className="landing-formLabel">
              Confirm Password:
            </label>

            <div className="relative">
              <input
                type={confirmPassHide ? "password" : "text"}
                name="confirmPassword"
                value={userVal.confirmPassword}
                onChange={handleUserVal}
                placeholder="12345"
                className="landing-formInput"
              />

              <div
                className="landing-hidePass"
                onClick={() => setConfirmPassHide((prev) => !prev)}
              >
                {confirmPassHide ? <EyeClosed /> : <Eye />}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 items-center mb-5">
          <button
            type="submit"
            className="cursor-pointer go-button rounded-[10px] w-full"
          >
            Sign Up
          </button>

          <p className="text-[15px]">
            Already have an account?{" "}
            <span
              onClick={handleLogInFormView}
              className="cursor-pointer inline-flex underline font-bold hover:text-goButton active:scale-90"
            >
              Login
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export function LogIn({
  handleSignUpForm,
}: {
  handleSignUpForm: (val: boolean) => void;
}) {
  const [passHide, setPassHide] = useState<boolean>(true);
  const { showNotification } = useNotification();
  const route = useRouter();
  const [userVal, setUserVal] = useState<LoginUserType>({
    username: "",
    password: "",
  });

  const handleSignUpFormView = useCallback(() => {
    handleSignUpForm(true);
  }, [handleSignUpForm]);

  const handleUserVal = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUserVal((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleUserLogin = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // validate the user value first
      const validation = ValidateUserLogin(userVal);

      if (!validation.validate)
        return showNotification({
          message: `${validation.message}`,
          type: "warning",
        });

      try {
        const res = await fetch(`/api/us3ru4th/logIn`, {
          method: "POST",
          body: JSON.stringify({
            username: userVal.username,
            password: userVal.password,
          }),
        });

        const data = await res.json();

        // check if the response is ok, if not, throw an error
        if (!res.ok) throw new Error(data.message);

        route.push(`/${data.userId}/dashboard`);
      } catch (error) {
        const err = error as Error;
        console.log(err.message);

        // will call the setNotification function from the notification provider
        // to give an error message to the provider
        showNotification({ message: err.message, type: "error" });

        // after a certain time the value of the notification will go back to its defaul value
      }
    },
    [userVal, showNotification, route]
  );
  return (
    <div className="w-full md:max-w-[370px] border-2 p-5 rounded-[15px]">
      <h1 className="text-center font-black mb-12 text-2xl">LogIn</h1>
      <form onSubmit={handleUserLogin} className="flex flex-col gap-15">
        <div className="grid grid-rows-2 gap-3">
          {/* Username  */}
          <div>
            <label htmlFor="username" className="landing-formLabel">
              Username:
            </label>
            <div>
              <input
                type="text"
                name="username"
                value={userVal.username}
                onChange={handleUserVal}
                placeholder="john doe"
                className="landing-formInput !px-4"
              />
            </div>
          </div>

          {/* Password  */}
          <div>
            <label htmlFor="pass" className="landing-formLabel">
              Password:
            </label>
            <div className="relative">
              <input
                type={passHide ? "password" : "text"}
                name="password"
                value={userVal.password}
                onChange={handleUserVal}
                placeholder="12345"
                className="landing-formInput"
              />

              <div
                className="landing-hidePass"
                onClick={() => setPassHide((prev) => !prev)}
              >
                {passHide ? <EyeClosed /> : <Eye />}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 items-center mb-8">
          <button
            type="submit"
            className="cursor-pointer go-button rounded-[10px] w-full"
          >
            Log In
          </button>

          <p className="text-[15px]">
            Dont have an accout yet?{" "}
            <span
              onClick={handleSignUpFormView}
              className="cursor-pointer inline-flex underline font-bold hover:text-goButton active:scale-90"
            >
              Register
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
