import React, { useState } from 'react';
import "./Input.scss";
import logo_eye from "../../assets/eye-svgrepo-com.svg";
import logo_closed_eye from "../../assets/eye-slash-svgrepo-com.svg";

interface InputProps {
    type?: string;
    styleName?: string
    placeholder?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
}

const Input: React.FC<InputProps> = ({type = "text", styleName = "default_input", value, onChange, ...OtherFields}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="input-wrapper">
            <input type={showPassword ? "text" : type} value={value} className={styleName} onChange={onChange} {...OtherFields}/>
            {type === "password" && (
                <button className="password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword ? <img src={logo_closed_eye} alt="" /> : <img src={logo_eye} alt="" /> }
                </button>
            )}
        </div>
    );
};

export default Input;