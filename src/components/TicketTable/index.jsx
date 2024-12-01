import React, { useEffect, useState } from 'react';
import './style.css';
import config from "../../config";
import moment from "moment";
import TicketFilter from '../TicketFilter';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const TicketTable = ({ }) => {
    const backendIp = config.backend_ip;
    const [chamados, setChamados] = useState([]);
    const [setorFiltro, setSetorFiltro] = useState('');
    const [ticketSelecionado, setTicketSelecionado] = useState(null);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const limitePagina = 10;

    useEffect(() => {
        fetchChamados();
    }, [setorFiltro]);

    const fetchChamados = async () => {
        try {
            const response = await fetch(`${backendIp}/api/list_chamados?setor=${setorFiltro}`);
            const data = await response.json();
            setChamados(data.chamados);
        } catch (error) {
            console.error('Erro ao buscar chamados:', error);
        }
    };

    const handleFilterChange = (setor) => {
        setSetorFiltro(setor);
    };

    const handleTicketClick = (ticket) => {
        if (ticketSelecionado && ticketSelecionado.id === ticket.id) {
            setTicketSelecionado(null);
        } else {
            setTicketSelecionado(ticket);
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
                            <th>Data</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ticketsExibidos.map((chamado) => (
                            <tr key={chamado.id}>
                                <td><div className={`${getCorPrioridade(chamado.prioridade)} prioridade-container`}>{chamado.prioridade}</div></td>
                                <td>{chamado.status}</td>
                                <td>{chamado.numero}</td>
                                <td>{chamado.titulo}</td>
                                <td>{chamado.setor}</td>
                                <td>{chamado.usuario_nome}</td>
                                <td>{moment(chamado.data).format('DD/MM HH[h]mm')}</td>
                                <td><a style={{ textDecoration: 'underline #009373', cursor: 'pointer', color: '#009373' }} onClick={() => handleTicketClick(chamado)}>Abrir</a></td>
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