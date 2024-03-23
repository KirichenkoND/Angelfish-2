import React from 'react';
import "./Button.scss";

interface ButtonProps {
    text: string;
    styleName?: string;
    onClick?: () => void;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text = "ТЫКНИ", styleName = 'default_btn', ...OtherFields }) => {
    return (
        <button className={styleName} {...OtherFields} disabled={OtherFields.disabled}>
            {text}
        </button>
    );
};

export default Button;