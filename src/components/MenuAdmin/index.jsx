import React, { useEffect, useState } from 'react';
import './style.css';
import BarChartIcon from '@mui/icons-material/BarChart';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ArticleIcon from '@mui/icons-material/Article';
import { useNavigate } from 'react-router-dom';
import config from "../../config";
import Header from '../Header';
import moment from "moment";
import MenuChamados from '../MenuChamados';
import MenuArtigos from '../MenuArtigos';
import MenuDashboard from '../MenuDashboard';

const MenuAdmin = () => {
    const backendIp = config.backend_ip;
    const [userData, setUserData] = useState(null);
    const [activeMenu, setActiveMenu] = useState('chamados');
    const navigate = useNavigate();

    useEffect(() => {
        const cachedData = localStorage.getItem('userData');
        if (cachedData) {
            const data = JSON.parse(cachedData);
            if (data.tipo !== 'colaborador') {
                navigate('/MenuUser');
            } else {
                setUserData(data);
                fetchMeusTickets(data.id);
            }
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userData');
        navigate('/');
    };

    const fetchMeusTickets = async (colaboradorId) => {
        try {
            const response = await fetch(`${backendIp}/api/list_user_tickets/${colaboradorId}`);
            const data = await response.json();
            const sortedTickets = data.tickets || [];
            sortedTickets.sort((a, b) => moment(b.data).diff(moment(a.data)));
        } catch (error) {
            console.error('Erro ao buscar tickets:', error);
        }
    };

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
    };

    return (
        <div>
            <Header />
            <main>
                <div className="container">
                    <div className="sidebar">
                        <div className="user-info">
                            <img src="/images/logo_fundo.png" alt="User Profile" />
                            <p className="user-name">{userData?.nome}</p>
                            <span className="user-options">
                                Minha Conta | <button className="button-logout" onClick={handleLogout}>Logout</button>
                            </span>
                        </div>
                        <nav className="navigation">
                            <ul>
                                <li>
                                    <a
                                        href="#"
                                        className={`nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
                                        onClick={() => handleMenuClick('dashboard')}
                                    >
                                        <BarChartIcon />
                                        <span>Dashboard</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className={`nav-item ${activeMenu === 'chamados' ? 'active' : ''}`}
                                        onClick={() => handleMenuClick('chamados')}
                                    >
                                        <ConfirmationNumberIcon />
                                        <span>Chamados</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className={`nav-item ${activeMenu === 'artigos' ? 'active' : ''}`}
                                        onClick={() => handleMenuClick('artigos')}
                                    >
                                        <ArticleIcon />
                                        <span>Artigos</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="content">
                        {activeMenu === 'dashboard' && <MenuDashboard />}
                        {activeMenu === 'chamados' && <MenuChamados />}
                        {activeMenu === 'artigos' && <MenuArtigos />}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MenuAdmin;