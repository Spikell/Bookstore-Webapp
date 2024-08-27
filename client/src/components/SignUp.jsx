import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Firebase/AuthProvider";
import { GoogleAuthProvider } from "firebase/auth";
import Login from "./Login";

const SignUp = () => {
  const { createUser, loginWithGoogle } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Clear error when user starts typing or deletes the password
    if (error) {
      setError("");
    }
  };

  const handleSignUp = (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;

    // Clear previous errors
    setError("");

    // Check password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    createUser(email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        alert("Signed up successfully!");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
        // ..
      });
  };

  // signup using google
  const handleGoogleSignUp = () => {
    loginWithGoogle()
      .then((result) => {
        const user = result.user;
        navigate(from, { replace: true });
        alert("Signed up successfully!");
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
      });
  };

  return (
    <div className="bg-white rounded-lg ">
      <div className="container flex flex-col mx-auto bg-white rounded-lg">
        <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
          <div className="flex items-center justify-center w-full lg:p-6">
            <div className="flex items-center xl:p-10">
              <form
                onSubmit={handleSignUp}
                className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"
              >
                <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">
                  Sign Up
                </h3>
                <p className="mb-4 text-gray-700">
                  Enter your email and password
                </p>
                <a
                  className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-200 
                  rounded-2xl text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-1 focus:ring-gray-400"
                  onClick={handleGoogleSignUp}
                >
                  <img
                    className="h-5 mr-2"
                    src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png"
                    alt="Sign up with Google"
                  />
                  Sign up with Google
                </a>
                <div className="flex items-center mb-3">
                  <hr className="h-0 border-b border-solid border-gray-500 grow" />
                  <p className="mx-4 text-gray-600">or</p>
                  <hr className="h-0 border-b border-solid border-gray-500 grow" />
                </div>
                <label
                  htmlFor="email"
                  className="mb-2 text-sm text-start text-gray-900"
                >
                  Email*
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-gray-100 mb-7 placeholder:text-gray-700 bg-gray-200 text-dark-gray-900 rounded-2xl"
                />
                <label
                  htmlFor="password"
                  className="mb-2 text-sm text-start text-gray-900"
                >
                  Password*
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter a password"
                  className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-gray-100 placeholder:text-gray-700 bg-gray-200 text-dark-gray-900 rounded-2xl"
                />
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="flex flex-row justify-between mb-6">
                  {/* <label className="relative inline-flex items-center mr-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked
                      value=""
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 bg-black border-2 rounded-sm border-gray-500 peer peer-checked:border-0 peer-checked:bg-purple-blue-500">
                      <img
                        className=""
                        src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/icons/check.png"
                        alt="tick"
                      />
                    </div>
                    <span className="ml-3 text-sm font-normal text-grey-900">
                      Keep me logged in
                    </span> 
                  </label> */}
                  {/* <a
                    href="#"
                    className="mr-4 text-sm font-medium text-purple-blue-500"
                  >
                    Forget password?
                  </a> */}
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-200 
                  md:w-96 rounded-2xl hover:bg-sky-600 focus:ring-4 focus:ring-sky-100 bg-sky-500"
                >
                  Sign Up
                </button>
                <p className="text-sm leading-relaxed text-gray-900">
                  Already have an account?{" "}
                  <a href="/login" className="font-bold text-gray-700">
                    Log In
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;