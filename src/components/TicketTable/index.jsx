import React, { useEffect, useState } from 'react';
import './style.css';
import config from "../../config";
import moment from "moment";
import TicketFilter from '../TicketFilter';

const TicketTable = ({ }) => {
    const backendIp = config.backend_ip;
    const [chamados, setChamados] = useState([]);
    const [setorFiltro, setSetorFiltro] = useState('');
    const [colaboradores, setColaboradores] = useState([]);
    const [ticketSelecionado, setTicketSelecionado] = useState(null);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [selecionados, setSelecionados] = useState([]);
    const [statusEdicao, setStatusEdicao] = useState('');
    const [prioridadeEdicao, setPrioridadeEdicao] = useState('');

    useEffect(() => {
        fetchChamados();
        fetchColaboradores();
    }, [setorFiltro]);

    const fetchColaboradores = async () => {
        try {
            const response = await fetch(`${backendIp}/api/list_colaboradores`);
            const data = await response.json();
            setColaboradores(data.colaboradores);
        } catch (error) {
            console.error('Erro ao buscar colaboradores:', error);
        }
    };

    const fetchChamados = async () => {
        try {
            const response = await fetch(`${backendIp}/api/list_chamados?setor=${setorFiltro}`);
            const data = await response.json();
            setChamados(data.chamados);
        } catch (error) {
            console.error('Erro ao buscar chamados:', error);
        }
    };

    const fetchColaboradoresChamado = async (chamadoId) => {
        try {
            const response = await fetch(`${backendIp}/api/list_colaborador_chamado/${chamadoId}`);
            const data = await response.json();
            setSelecionados(data.colaboradores);
        } catch (error) {
            console.error('Erro ao buscar colaboradores do chamado:', error);
        }
    };

    const handleFilterChange = (setor) => {
        setSetorFiltro(setor);
    };

    const handleStatusChange = (event) => setStatusEdicao(event.target.value);
    const handlePrioridadeChange = (event) => setPrioridadeEdicao(event.target.value);

    const salvarEdicao = async () => {
        try {
            const response = await fetch(`${backendIp}/api/edit_chamado`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: ticketSelecionado.id,
                    status: statusEdicao,
                    prioridade: prioridadeEdicao,
                    colaboradores: selecionados,
                }),
            });

            if (response.ok) {
                const atualizado = await response.json();
                setChamados((prevChamados) =>
                    prevChamados.map((chamado) =>
                        chamado.id === atualizado.id ? atualizado : chamado
                    )
                );
                sairModoEdicao();
            } else {
                console.error('Erro ao salvar edição');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    const entrarModoEdicao = () => {
        if (ticketSelecionado) {
            setStatusEdicao(ticketSelecionado.status);
            setPrioridadeEdicao(ticketSelecionado.prioridade);
            setSelecionados(ticketSelecionado.colaboradores || []);
            setModoEdicao(true);
        }
    };

    const sairModoEdicao = () => {
        setModoEdicao(false);
    };

    const handleChange = (event) => {
        const { options } = event.target;
        const values = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                values.push(options[i].value);
            }
        }
        setSelecionados(values);
    };

    const handleTicketClick = (ticket) => {
        if (ticketSelecionado && ticketSelecionado.id === ticket.id) {
            setTicketSelecionado(null);
        } else {
            setTicketSelecionado(ticket);
            fetchColaboradoresChamado(ticket.id);
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
                        {chamados.map((chamado) => (
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
                <span className="tickets-count">{chamados.length} / Chamados</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className={`container-pai-open ${ticketSelecionado ? 'open' : ''}`}>
                    {ticketSelecionado && (
                        <>
                            {!modoEdicao ? (
                                <div style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <div style={{ borderRadius: '5px' }} className="container-open">
                                        <div className="header-open">
                                            <h1>{ticketSelecionado.numero}{' '}<a style={{ textDecoration: 'underline #009373', cursor: 'pointer', color: '#009373', fontWeight: 'normal' }} onClick={() => entrarModoEdicao()}>Editar</a></h1>
                                            <h2>{ticketSelecionado.titulo}</h2>
                                            <div className="flag-open"></div>
                                        </div>
                                        <div className="content-open">
                                            <div className="item-open">
                                                <h2>Departamento</h2>
                                                <p><a>{ticketSelecionado.setor}</a></p>
                                            </div>
                                            <div className="item-open">
                                                <h2>Tags</h2>
                                                <p><a>None</a></p>
                                            </div>
                                            <div className="item-open">
                                                <h2>Colaborador(es)</h2>
                                                {selecionados.length > 0 ? (
                                                    <div style={{ display: 'flex' }}>
                                                        <p>
                                                            {selecionados.map((colaborador) => (
                                                                <div>
                                                                    <a key={colaborador.colaborador_id}>{colaborador.colaborador}</a>
                                                                </div>
                                                            ))}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p>Nenhum colaborador associado</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="content-open">
                                            <div className="item-open">
                                                <h2>Autor</h2>
                                                <p><a>{ticketSelecionado.usuario_nome}</a></p>
                                            </div>
                                            <div className="item-open">
                                                <h2>Status</h2>
                                                <p><a>{ticketSelecionado.status}</a></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="chat-container">
                                        <div class="message">
                                            <img src="https://via.placeholder.com/40" alt="Avatar" />
                                            <div class="message-content">
                                                <div class="message-header">
                                                    <span class="name">{ticketSelecionado.usuario_nome}</span>
                                                    <span class="role">{ticketSelecionado.setor}</span>
                                                    <span class="time">{ticketSelecionado.data}</span>
                                                </div>
                                                <div class="message-body">
                                                    <p>{ticketSelecionado.descricao}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="message">
                                            {/* <img src="https://via.placeholder.com/40" alt="Avatar" />
                                            <div class="message-content">
                                                <div class="message-header">
                                                    <span class="name">Maria Carolina Zefiro Couto</span>
                                                    <span class="role">TI</span>
                                                    <span class="time">9 Agosto 2024, 11:20</span>
                                                </div>
                                                <div class="message-body">
                                                    <p>Prezados,</p>
                                                    <p>Após verificar os cabos HDMI, foi detectado que o cabo estava com defeito. Após realizra a troca o monitor retornou o funcionamento normal.</p>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="container-open2-edit">
                                    <h2 className="title-edit">Editar Chamado</h2>
                                    <form className='form-edit'>
                                        <label className='label-edit' htmlFor="status">Status:</label>
                                        <select className='select-edit' id="status" defaultValue={ticketSelecionado.status} value={statusEdicao} onChange={handleStatusChange}>
                                            <option value="AdminisAbertotração">Aberto</option>
                                            <option value="Fechado">Fechado</option>
                                            <option value="Em Andamento">Em Andamento</option>
                                            <option value="Espera">Espera</option>
                                        </select>

                                        <label className='label-edit' htmlFor="prioridade">Prioridade:</label>
                                        <select className='select-edit' id="prioridade" defaultValue={ticketSelecionado.prioridade} value={prioridadeEdicao} onChange={handlePrioridadeChange}>
                                            <option value="Alta">Alta</option>
                                            <option value="Média">Média</option>
                                            <option value="Baixa">Baixa</option>
                                        </select>

                                        <label className='label-edit' htmlFor="colaboradores">Colaboradores:</label>
                                        <select
                                            className="select-edit"
                                            id="colaboradores"
                                            multiple
                                            value={selecionados}
                                            onChange={handleChange}
                                        >
                                            {colaboradores.map((colaborador) => (
                                                <option key={colaborador.id} value={colaborador.id}>
                                                    {colaborador.nome}
                                                </option>
                                            ))}
                                        </select>

                                        <div className="edit-buttons">
                                            <button
                                                className="button-edit-save"
                                                type="button"
                                                onClick={() => {
                                                    salvarEdicao();
                                                    sairModoEdicao();
                                                }}
                                            >
                                                Salvar
                                            </button>
                                            <button className="button-edit-cancel" type="button" onClick={sairModoEdicao}>
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketTable;