import React from 'react';
import "./HeaderLink.scss"

interface HeaderLinkProps {
    image?: string;
    text?: string;
    path: string;
}

const HeaderLink: React.FC<HeaderLinkProps> = ({ image, text, path }) => {
    return (
        <a href={path} className='header-link-route' >
            <div className='header-link'>
                <img src={image}></img>
                {text}
            </div>
        </a>
    );
};

export default HeaderLink;