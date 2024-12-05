import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from "../../config";
import TicketTable from '../TicketTable';
import moment from "moment";
import TicketFilter from '../TicketFilter';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TicketSelected from '../TicketSelected';

const MenuChamados = () => {
    const backendIp = config.backend_ip;
    const [userData, setUserData] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [setorFiltro, setSetorFiltro] = useState('');
    const [filtroTicket, setFiltroTicket] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
    const limitePagina = 5;
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

    const fetchMeusTickets = async (colaboradorId) => {
        try {
            const response = await fetch(`${backendIp}/api/list_user_tickets/${colaboradorId}`);
            const data = await response.json();
            const sortedTickets = data.tickets || [];
            sortedTickets.sort((a, b) => moment(b.data).diff(moment(a.data)));
            setTickets(sortedTickets);
            setFiltroTicket(sortedTickets);
        } catch (error) {
            console.error('Erro ao buscar tickets:', error);
        }
    };

    const handleFilterChange = (setor) => {
        setSetorFiltro(setor);
        if (setor === '') {
            setFiltroTicket(tickets);
        } else {
            const filtered = tickets.filter(ticket => ticket.setor.toLowerCase().trim() === setor.toLowerCase().trim());
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

    const totalPaginas = Math.ceil(filtroTicket.length / limitePagina);

    const ticketsExibidos = filtroTicket.slice(
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
        if (chamadoSelecionado && chamadoSelecionado.id === ticket.id) {
            setChamadoSelecionado(null);
        } else {
            setChamadoSelecionado(ticket);
            setTimeout(() => {
                window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: 'smooth', 
                });
            }, 100); 
        }
    };

    const handleVoltar = () => {
        setChamadoSelecionado(null);
    };

    return (
        <div>
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
                            <th style={{ minWidth: '121px' }}>Data</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ticketsExibidos.map((ticket) => (
                            <tr key={ticket.id}>
                                <td><div className={`${getCorPrioridade(ticket.prioridade)} prioridade-container`}>{ticket.prioridade}</div></td>
                                <td>{ticket.status}</td>
                                <td>{ticket.numero}</td>
                                <td>{ticket.titulo}</td>
                                <td>{ticket.setor}</td>
                                <td>{ticket.usuario_nome}</td>
                                <td>
                                    {moment(ticket.data).isSame(moment(), 'day')
                                        ? `Hoje às ${moment(ticket.data).format('HH[h]mm')}`
                                        : moment(ticket.data).format('DD/MM HH[h]mm')}
                                </td>
                                <td>
                                    <a
                                        style={{
                                            textDecoration: 'underline #009373',
                                            cursor: 'pointer',
                                            color: '#009373'
                                        }}
                                        onClick={() => handleAbrirChamado(ticket)}
                                    >
                                        {chamadoSelecionado && chamadoSelecionado.id === ticket.id ? "Fechar" : "Abrir"}
                                    </a>
                                </td>
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
            <TicketTable
                chamadoSelecionado={chamadoSelecionado}
                handleAbrirChamado={handleAbrirChamado}
            />
            {chamadoSelecionado && (
                <div className="modal-overlay">
                    <TicketSelected
                        chamado={chamadoSelecionado}
                        onVoltar={handleVoltar}
                    />
                </div>
            )}
        </div>
    );
};

export default MenuChamados;