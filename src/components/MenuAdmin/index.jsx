import React, { useEffect, useState } from 'react';
import './style.css';
import BarChartIcon from '@mui/icons-material/BarChart';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ArticleIcon from '@mui/icons-material/Article';
import ConstructionIcon from '@mui/icons-material/Construction';
import { useNavigate } from 'react-router-dom';
import config from "../../config";
import Header from '../Header';
import TicketTable from '../TicketTable';
import moment from "moment";
import TicketFilter from '../TicketFilter';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TicketSelected from '../TicketSelected';

const MenuAdmin = () => {
    const backendIp = config.backend_ip;
    const [userData, setUserData] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [setorFiltro, setSetorFiltro] = useState('');
    const [filtroTicket, setFiltroTicket] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
    const limitePagina = 10;
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
            setTickets(data.tickets || []);
            setFiltroTicket(data.tickets || []);
        } catch (error) {
            console.error('Erro ao buscar tickets:', error);
        }
    };

    const handleFilterChange = (setor) => {
        setSetorFiltro(setor);
        if (setor === '') {
            setFiltroTicket(tickets);
        } else {
            const filtered = tickets.filter(ticket => ticket.setor === setor);
            setFiltroTicket(filtered);
        }
    };

    const getCorPrioridade = (prioridade) => {
        switch (prioridade) {
            case 'Alta':
                return 'alta-prioridade';
            case 'Média':
                return 'media-prioridade';
            case 'Baixa':
                return 'baixa-prioridade';
            default:
                return '';
        }
    };

    const totalPaginas = Math.ceil(tickets.length / limitePagina);

    const ticketsExibidos = tickets.slice(
        (paginaAtual - 1) * limitePagina,
        paginaAtual * limitePagina
    );

    const handleNextPage = () => {
        if (paginaAtual < totalPaginas) {
            setPaginaAtual((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (paginaAtual > 1) {
            setPaginaAtual((prevPage) => prevPage - 1);
        }
    };

    const handleAbrirChamado = (ticket) => {
        setChamadoSelecionado(ticket);
    };

    const handleVoltar = () => {
        setChamadoSelecionado(null);
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
                                    <a href="#" className="nav-item">
                                        <BarChartIcon />
                                        <span>Dashboard</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="nav-item active">
                                        <ConfirmationNumberIcon />
                                        <span>Chamados</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="nav-item">
                                        <ArticleIcon />
                                        <span>Artigos</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="nav-item">
                                        <ConstructionIcon />
                                        <span>Configurações</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="content">
                        <div className="section">
                            <h2>Meus Chamados</h2>
                            <TicketFilter handleFilterChange={handleFilterChange} />
                            <table>
                                <thead>
                                    <tr style={{ backgroundColor: '#009373', color: 'white' }}>
                                        <th>Prioridade</th>
                                        <th>Status</th>
                                        <th>Número</th>
                                        <th>Mensagem</th>
                                        <th>Departamento</th>
                                        <th>Autor</th>
                                        <th>Data</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ticketsExibidos.map((ticket) => (
                                        <tr key={ticket.ticket_id}>
                                            <td><div className={`${getCorPrioridade(ticket.prioridade)} prioridade-container`}>{ticket.prioridade}</div></td>
                                            <td>{ticket.status}</td>
                                            <td>{ticket.numero}</td>
                                            <td>{ticket.titulo}</td>
                                            <td>{ticket.setor}</td>
                                            <td>{ticket.usuario_nome}</td>
                                            <td>{moment(ticket.data).format('DD/MM HH[h]mm')}</td>
                                            <td><a style={{ textDecoration: 'underline #009373', cursor: 'pointer', color: '#009373' }} onClick={() => handleAbrirChamado(ticket)}>Abrir</a></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="paginacao">
                                <NavigateBeforeIcon onClick={handlePrevPage} disabled={paginaAtual === 1} style={{ cursor: 'pointer' }} />
                                <span style={{ fontSize: '13px', display: 'flex', alignItems: 'center', margin: '0 8px' }}>
                                    Página {paginaAtual} de {totalPaginas}
                                </span>
                                <NavigateNextIcon onClick={handleNextPage} disabled={paginaAtual === totalPaginas} style={{ cursor: 'pointer' }} />
                            </div>
                        </div>
                        <TicketTable />
                        {chamadoSelecionado && (
                            <div className="modal-overlay">
                                <TicketSelected 
                                    chamado={chamadoSelecionado} 
                                    onVoltar={handleVoltar} 
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MenuAdmin;