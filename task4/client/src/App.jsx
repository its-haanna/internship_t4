import React from "react";
import { nanoid } from "nanoid";
import Axios from "axios";
import Dashboard from "./Dashboard";

function App() {
  Axios.defaults.withCredentials = true;
  const [registerData, setRegisterData] = React.useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
  });

  const [registerMessage, setRegisterMessage] = React.useState("");
  const [loginMessage, setLoginMessage] = React.useState("");
  const [loggedUser, setLoggedUser] = React.useState(false);

  function handleRegisterData(event) {
    setRegisterData((prev) => {
      return {
        ...prev,
        username: nanoid(),
        [event.target.name]: event.target.value,
      };
    });
  }

  function handleLoginData(event) {
    setLoginData((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  }

  function register() {
    Axios.post("http://localhost:3001/register", {
      username: registerData.username,
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
    }).then((response) => {
      if (
        response.data.message !== null &&
        response.data.message.code === "ER_DUP_ENTRY"
      ) {
        setRegisterMessage("This e-mail already exists in the database.");
      } else {
        setRegisterMessage(" ");
        setRegisterData({
          username: "",
          name: "",
          email: "",
          password: "",
        });
      }
    });
  }

  function login() {
    Axios.post("http://localhost:3001/login", {
      email: loginData.email,
      password: loginData.password,
    }).then((response) => {
      if (!response.data.auth) {
        setLoginMessage(response.data.message);
        setLoggedUser(false);
      } else {
        localStorage.setItem("token", response.data.token);
        setLoggedUser(true);
        localStorage.setItem("user", response.data.result[0].id);
        setLoginMessage("");
        setLoginData({
          email: "",
          password: "",
        });
      }
    });
  }

  React.useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (
        (response.data.loggedIn &&
          response.data.user[0].status === "Offline") ||
        (response.data.loggedIn && response.data.user[0].status === "Online")
      ) {
        setLoggedUser(true);
      } else {
        setLoggedUser(false);
      }
    });
  });

  return (
    <>
      {!loggedUser ? (
        <div className="bg-sky-100 p-10 w-2/5 font-sans rounded flex flex-col text-neutral-900 items-center max-w-md">
          <form className="max-w-md mb-6 flex flex-col">
            <h1 className="mb-4 self-center tracking-wide text-xl">
              Register:
            </h1>
            <div className="flex flex-col">
              <label htmlFor="name" className="my-1 tracking-wide ml-px">
                Name:
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Name..."
                onChange={handleRegisterData}
                value={registerData.name}
                className="mb-2 placeholder:mx-1 placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-3 pr-3"
              />
              <label htmlFor="email" className="my-1 tracking-wide ml-px">
                E-mail:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="E-mail..."
                onChange={handleRegisterData}
                value={registerData.email}
                className="mb-2 placeholder:mx-1 placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-3 pr-3"
              />
              <p className="text-sm my-2">{registerMessage}</p>
              <label htmlFor="password" className="my-1 tracking-wide ml-px">
                Password:
              </label>
              <input
                id="password"
                type="password"
                name="password"
                minLength={1}
                placeholder="Password..."
                onChange={handleRegisterData}
                value={registerData.password}
                className="placeholder:mx-1 placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-3 pr-3"
              />
            </div>
            <button
              type="button"
              onClick={register}
              className="bg-sky-900 text-white px-5 py-3 rounded mt-5"
            >
              Register
            </button>
            <p></p>
          </form>

          <form className="max-w-sm flex flex-col mt-10">
            <h1 className="mb-4 self-center tracking-wide text-xl">Login:</h1>
            <div className="flex flex-col">
              <label htmlFor="email" className="my-1 tracking-wide">
                E-mail:
              </label>
              <input
                id="email"
                type="email"
                name="email"
                onChange={handleLoginData}
                value={loginData.email}
                placeholder="E-mail..."
                className="mb-2 placeholder:mx-1 placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-3 pr-3"
              />
              <label htmlFor="password" className="my-1 tracking-wide">
                Password:
              </label>
              <input
                id="password"
                type="password"
                name="password"
                minLength={1}
                onChange={handleLoginData}
                value={loginData.password}
                placeholder="Password..."
                className="placeholder:mx-1 placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-3 pr-3"
              />
            </div>
            <button
              type="button"
              onClick={login}
              className="bg-sky-900 text-white px-5 py-3 rounded mt-5"
            >
              Log in
            </button>
            <p className="text-sm my-2">{loginMessage}</p>
          </form>
        </div>
      ) : (
        <Dashboard />
      )}
    </>
  );
}

export default App;
