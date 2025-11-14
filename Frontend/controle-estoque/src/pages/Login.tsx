import "./Login.css";
import ButtonMain from "../components/ButtonMain";
import InputForm from "../components/InputForm";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import { useEffect, useState } from "react";

const CustomH1 = styled.div`
  margin-bottom: 64px;
  width: 100%;
`;

const CustomInputForm = styled.div`
  margin-top: 48px;
  width: 100%;
`;

const CustomButtonMain = styled.div`
  margin-top: 112px;
  width: 100%;
`;

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoginFilled, setIsLoginFilled] = useState(false);
  const [isLoginValid, setIsLoginValid] = useState(true);

  useEffect(() => {
    setIsLoginValid(true);
    if (username != "" && password != "") {
      setIsLoginFilled(true);
    } else {
      setIsLoginFilled(false);
    }
  }, [username, password]);

  async function StockLogin() {
    const corpo: RequestLogin = {
      username: username,
      password: password,
    };

    fetch("http://127.0.0.1:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(corpo),
    }).then(async (res) => {
      if (res.status !== 200) {
        setIsLoginValid(false);
        return;
      }
      const data = await res.json();
      localStorage.setItem("authToken", data.token);
      navigate("/StockMain");
    });
  }

  class RequestLogin {
    username: string = "";
    password: string = "";
  }

  return (
    <>
      <div
        className="wrapper-login"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            StockLogin();
          }
        }}
      >
        <div className="login-div">
          <CustomH1>
            <h1>Faça seu login</h1>
          </CustomH1>

          <InputForm
            type="text"
            isInvalid={!isLoginValid}
            onChange={(value) => setUsername(value)}
            placeholder="Usuário"
          />
          <CustomInputForm>
            <InputForm
              type="password"
              onChange={(value) => setPassword(value)}
              isInvalid={!isLoginValid}
              placeholder="Senha"
            />
          </CustomInputForm>
          <span className="error-msg small-medium">
            {isLoginValid ? (
              ""
            ) : (
              <span>Usuário ou senha incorretos. Tente de novo.</span>
            )}
          </span>
          <CustomButtonMain>
            <ButtonMain
              text="Entrar"
              onClick={() => StockLogin()}
              disabled={!isLoginFilled || !isLoginValid}
            />
          </CustomButtonMain>
        </div>
      </div>
    </>
  );
}

export default Login;
