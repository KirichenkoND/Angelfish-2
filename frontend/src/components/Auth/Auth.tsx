import React, { useCallback, useState } from "react";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import { useAppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../store/Slices/userSlice";
import { ILogin, useLoginMutation, useMeQuery } from "../../api/authApi";
import "./Auth.scss";

const successStyle: React.CSSProperties = {
  color: "green",
};

const nevalidStyle: React.CSSProperties = {
  color: "red",
};

const Auth: React.FC = () => {
  const [login, { isError, isLoading, isSuccess }] = useLoginMutation();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleChangePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };
  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const credentials: ILogin = { phone, password };

  const handleLogin = useCallback(() => {
    console.log(credentials)
    login(credentials);
  }, [credentials]);

  if (isSuccess) {
    dispatch(setUser({ phone, role: null}));
    navigate("/");
    window.location.reload();
  }

  return (
    <div className="container">
      {(isLoading && "Жди, ты грузишься, сори я устал поэтому без лоудера") || (
        <>
          <div className="login">
            <label className="label_auth">Логин</label>
            <div className="sec-2">
              <Input
                type="login"
                styleName="auth_input"
                placeholder="+7..."
                value={phone}
                onChange={handleChangePhone}
              />
            </div>
          </div>
          <div className="password">
            <label className="label_auth">Пароль</label>
            <div className="sec-2">
              <Input
                type="password"
                styleName="auth_input"
                placeholder="************"
                value={password}
                onChange={handleChangePassword}
              />
            </div>
          </div>
          <div className="sec-2">
            <Button text="Авторизоваться" onClick={handleLogin} />
          </div>
        </>
      )}
      {isError && (
        <p style={nevalidStyle}>Неправильный номер телефона или пароль</p>
      )}
      {isSuccess && <p style={successStyle}>Авторизация успешна!</p>}
    </div>
  );
};

export default Auth;
