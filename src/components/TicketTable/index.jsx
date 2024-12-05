import React, { useEffect, useState, useRef } from 'react';
import './style.css';
import config from "../../config";
import moment from "moment";
import TicketFilter from '../TicketFilter';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TicketSelected from '../TicketSelected';
import socket from '../../socket';

const TicketTable = ({ chamadoSelecionado, handleAbrirChamado }) => {
    const backendIp = config.backend_ip;
    const [chamados, setChamados] = useState([]);
    const [setorFiltro, setSetorFiltro] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const limitePagina = 5;

    useEffect(() => {
        fetchChamados();
    }, [setorFiltro]);

    useEffect(() => {
        socket.on("novo_chamado", (data) => {
            setChamados((prevChamados) => {
                const updatedChamados = [data, ...prevChamados];
                return updatedChamados.sort((a, b) => moment(b.data).diff(moment(a.data)));
            });
            return () => {
                socket.off("novo_chamado");
            };
        });

        return () => {
            socket.off("novo_chamado");
        };
    }, []);

    const fetchChamados = async () => {
        try {
            const response = await fetch(`${backendIp}/api/list_chamados?setor=${setorFiltro}`);
            const data = await response.json();
            const sortedTickets = data.chamados || [];
            sortedTickets.sort((a, b) => moment(b.data).diff(moment(a.data)));
            setChamados(sortedTickets);
        } catch (error) {
            console.error('Erro ao buscar chamados:', error);
        }
    };

    const handleFilterChange = (setor) => {
        setSetorFiltro(setor);
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

    const totalPaginas = Math.ceil(chamados.length / limitePagina);

    const ticketsExibidos = chamados.slice(
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

    return (
        <div>
            <div className="section tickets">
                <h2>Novos Chamados</h2>
                <p>Aqui você pode visualizar todos os chamados.</p>
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
                                    onClick={() => handleAbrirChamado(ticket)}
                                    style={{
                                        textDecoration: 'underline #009373',
                                        cursor: 'pointer',
                                        color: '#009373'
                                    }}
                                >
                                    {chamadoSelecionado && chamadoSelecionado.id === ticket.id ? 'Fechar' : 'Abrir'}
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
        </div>
    );
};

export default TicketTable;