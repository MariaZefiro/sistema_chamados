import React, { useEffect, useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const cachedData = localStorage.getItem('userData');
        if (cachedData) {
            const data = JSON.parse(cachedData);
            if (data.tipo !== 'colaborador') {
                navigate('/MenuUser');
            } else {
                setUserData(data);
            }
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userData');
        navigate('/');
    };

    const getGreeting = () => {
        if (!userData) return 'Bem vindo!';
        const { nome } = userData;
        const primeiroNome = nome.split(' ')[0];
        return (
            <>
                Bem-vindo, <span className="user-name">{primeiroNome}</span>
            </>
        );
    };

    return (
        <header>
            <div className="container">
                <div className="header-left">
                    <h1>{getGreeting()}</h1>
                </div>
                <div className="header-right">
                    <div className="language-selector">
                        <span className="flag"></span>
                        <span className="lang">pt-br</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;