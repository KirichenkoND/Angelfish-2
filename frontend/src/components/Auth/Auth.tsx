import React, { useCallback, useState } from "react";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
/*import { useAppDispatch } from "../../store/store";*/
import { useNavigate } from "react-router-dom";
/*import { setUser } from "../../store/slices/userSlice";
import { ILogin } from "../../api/interfaces";
import { useLoginMutation } from "../../api/api";*/
import "./Auth.scss";

const Auth: React.FC = () => {
    /*const [login, { isError, isLoading, isSuccess }] = useLoginMutation();

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const handleChangePhone = (event: React.ChangeEvent<any>) => {
        setPhone(event.target.value);
    };
    const handleChangePassword = (event: React.ChangeEvent<any>) => {
        setPassword(event.target.value);
    };

    const credentials: ILogin = { phone, password };

    const handleLogin = useCallback(() => {
        login(credentials);
    }, [credentials]);

    if (isSuccess) {
        dispatch(setUser({ phone, role: 'receptionist' }))
        navigate("/");
    }*/

    // ЗАГЛУШКИ
    const isLoading = false;
    const isError = true;
    const phone = "1";
    const password = "1";
    const handleChangePhone = () => {};
    const handleChangePassword = () => {};
    const handleLogin = () => {};
    return (
        <div className="container">
            {(isLoading && "Жди, ты грузишься, сори я устал поэтому без лоудера") ||
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
                        <Button
                            text="Авторизоваться"
                            onClick={handleLogin}
                        />
                    </div>
                </>
            }
            {isError && "Неправильный номер телефона или пароль"}
        </div>
    );
};

export default Auth;
