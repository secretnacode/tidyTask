import Link from "next/link";
import { LandingForm } from "../component/clientComponent/landingPage";

export default function Page() {
  return (
    <div className="min-h-screen max-h-fit grid grid-rows-[70px_1fr]">
      <header className="flex flex-row justify-between items-center px-5 shadow-lg">
        <div className="flex flex-row justify-center items-center gap-2">
          <svg
            id="logo-14"
            width="73"
            height="49"
            viewBox="0 0 73 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hidden sm:inline-flex"
          >
            {" "}
            <path
              d="M46.8676 24C46.8676 36.4264 36.794 46.5 24.3676 46.5C11.9413 46.5 1.86765 36.4264 1.86765 24C1.86765 11.5736 11.9413 1.5 24.3676 1.5C36.794 1.5 46.8676 11.5736 46.8676 24Z"
              className="ccustom"
              fill="#68DBFF"
            ></path>{" "}
            <path
              d="M71.1324 24C71.1324 36.4264 61.1574 46.5 48.8529 46.5C36.5484 46.5 26.5735 36.4264 26.5735 24C26.5735 11.5736 36.5484 1.5 48.8529 1.5C61.1574 1.5 71.1324 11.5736 71.1324 24Z"
              className="ccompli1"
              fill="#FF7917"
            ></path>{" "}
            <path
              d="M36.6705 42.8416C42.8109 38.8239 46.8676 31.8858 46.8676 24C46.8676 16.1144 42.8109 9.17614 36.6705 5.15854C30.5904 9.17614 26.5735 16.1144 26.5735 24C26.5735 31.8858 30.5904 38.8239 36.6705 42.8416Z"
              className="ccompli2"
              fill="#5D2C02"
            ></path>{" "}
          </svg>
          <span className="title">TaskTidy</span>
        </div>
        <Link href="/" className="go-button rounded-[10px] md:hidden">
          Log In
        </Link>
      </header>
      <main className="flex flex-row justify-center items-center">
        <div className="flex flex-col justify-center gap-5 text-center md:w-[50%] md:min-h-[500px] md:text-right md:gap-0 md:border-r-2 md:py-10 lg:w-[45%] xl:w-[40%]">
          <div className="px-5 xl:px-10">
            <h1 className="text-6xl md:mb-5">
              Where{" "}
              <span className="italic bg-gradient-to-r from-[#e01c98] via-[#f61010] via-50% to-[#ff8810] bg-clip-text text-transparent">
                Priority
              </span>{" "}
              Meets{" "}
              <span className="italic bg-gradient-to-r from-[#1CB5E0] via-[#103af6] via-50% to-[#5410ff] bg-clip-text text-transparent">
                Productivity
              </span>
            </h1>
            <p className="text-[15px] tracking-wide pt-1">
              A minimalist to-do list web app that helps you prioritize tasks
              and stay organized with a clean, clutter-free interface.
            </p>
          </div>
          <div className="w-full">
            <Link
              href="/signUp"
              className="go-button inline-block w-[50%] max-w-[500px] rounded-[10px] md:hidden"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* form value for sign up and login  */}
        <div className="hidden md:block md:min-w-[50%] px-5 lg:min-w-[45%] lg:px-10 xl:min-w-[40%] xl:px-15">
          <LandingForm />
        </div>
      </main>
    </div>
  );
}
