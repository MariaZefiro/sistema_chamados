import React, { useEffect, useState } from 'react';
import moment from "moment";
import config from "../../config";

const TicketSelected = ({ chamado, onVoltar }) => {
    const backendIp = config.backend_ip;
    const [modoEdicao, setModoEdicao] = useState(false);
    const [selecionados, setSelecionados] = useState([]);
    const [statusEdicao, setStatusEdicao] = useState('');
    const [prioridadeEdicao, setPrioridadeEdicao] = useState('');
    const [colaboradores, setColaboradores] = useState([]);
    const [chamadoSelecionado, setChamadoSelecionado] = useState(chamado);

    useEffect(() => {
        fetchColaboradores();
        if (chamadoSelecionado) {
            fetchColaboradoresChamado(chamadoSelecionado.id);
        }
    }, [chamadoSelecionado]);


    const fetchColaboradores = async () => {
        try {
            const response = await fetch(`${backendIp}/api/list_colaboradores`);
            const data = await response.json();
            setColaboradores(data.colaboradores);
        } catch (error) {
            console.error('Erro ao buscar colaboradores:', error);
        }
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

    const handleStatusChange = (event) => setStatusEdicao(event.target.value);
    const handlePrioridadeChange = (event) => setPrioridadeEdicao(event.target.value);

    const salvarEdicao = async () => {
        const payload = { id: chamadoSelecionado.id };

        if (statusEdicao !== chamadoSelecionado.status) {
            payload.status = statusEdicao;
        }
        if (prioridadeEdicao !== chamadoSelecionado.prioridade) {
            payload.prioridade = prioridadeEdicao;
        }
        if (selecionados.length > 0) {
            payload.colaboradores = selecionados;
        }

        try {
            const response = await fetch(`${backendIp}/api/edit_chamado`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const atualizado = await response.json();
                setChamadoSelecionado(null);
                sairModoEdicao();
                window.location.reload();
            } else {
                console.error('Erro ao salvar edição');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
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

    const entrarModoEdicao = () => {
        if (chamadoSelecionado) {
            setStatusEdicao(chamadoSelecionado.status);
            setPrioridadeEdicao(chamadoSelecionado.prioridade);
            setSelecionados(chamadoSelecionado.colaboradores || []);
            setModoEdicao(true);
        }
    };

    const sairModoEdicao = () => {
        setModoEdicao(false);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className={`container-pai-open ${chamadoSelecionado ? 'open' : ''}`}>
                {chamadoSelecionado && (
                    <>
                        {!modoEdicao ? (
                            <div style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                <div style={{ borderRadius: '5px' }} className="container-open">
                                    <div className="header-open">
                                        <h1>{chamadoSelecionado.numero}{' '}<a style={{ textDecoration: 'underline #009373', cursor: 'pointer', color: '#009373', fontWeight: 'normal' }} onClick={() => entrarModoEdicao()}>Editar</a></h1>
                                        <h2>{chamadoSelecionado.titulo}</h2>
                                        <div className="flag-open"></div>
                                    </div>
                                    <div className="content-open">
                                        <div className="item-open">
                                            <h2>Departamento</h2>
                                            <p><a>{chamadoSelecionado.setor}</a></p>
                                        </div>
                                        <div className="item-open">
                                            <h2>Data</h2>
                                            <p><a>{moment(chamadoSelecionado.data).isSame(moment(), 'day') ? `Hoje às ${moment(chamadoSelecionado.data).format('HH[h]mm')}`: moment(chamadoSelecionado.data).format('DD/MM HH[h]mm')}</a></p>
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
                                            <p><a>{chamadoSelecionado.usuario_nome}</a></p>
                                        </div>
                                        <div className="item-open">
                                            <h2>Status</h2>
                                            <p><a>{chamadoSelecionado.status}</a></p>
                                        </div>
                                        <div className="item-open">
                                            <h2>Tipo do Problema</h2>
                                            <p><a>{chamadoSelecionado.tipo_de_problema} / {chamadoSelecionado.especificacao_problema}</a></p>
                                        </div>
                                    </div>
                                </div>
                                <div class="chat-container">
                                    <div class="message">
                                        <img src="https://via.placeholder.com/40" alt="Avatar" />
                                        <div class="message-content">
                                            <div class="message-header">
                                                <span class="name">{chamadoSelecionado.usuario_nome}</span>
                                                <span class="role">{chamadoSelecionado.setor}</span>
                                                <span class="time">{chamadoSelecionado.data}</span>
                                            </div>
                                            <div class="message-body">
                                                <p>{chamadoSelecionado.descricao}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="message">
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="container-open2-edit">
                                <h2 className="title-edit">Editar Chamado</h2>
                                <form className='form-edit'>
                                    <label className='label-edit' htmlFor="status">Status:</label>
                                    <select className='select-edit' id="status" defaultValue={chamadoSelecionado.status} value={statusEdicao} onChange={handleStatusChange}>
                                        <option value="AdminisAbertotração">Aberto</option>
                                        <option value="Fechado">Fechado</option>
                                        <option value="Em Andamento">Em Andamento</option>
                                        <option value="Espera">Espera</option>
                                    </select>

                                    <label className='label-edit' htmlFor="prioridade">Prioridade:</label>
                                    <select className='select-edit' id="prioridade" defaultValue='' onChange={handlePrioridadeChange}>
                                        <option value="" disabled>Selecione a prioridade</option>
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
    );
};

export default TicketSelected;