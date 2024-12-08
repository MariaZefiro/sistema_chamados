import React, { useState, useEffect } from 'react';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';
import config from "../../config";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, PointElement, LineElement, RadialLinearScale } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, PointElement, LineElement, RadialLinearScale);

const MenuDashboard = () => {
    const [chamados, setChamados] = useState([]);
    const backendIp = config.backend_ip;

    const setores = [
        'Administração', 'CGR', 'Call Center', 'Comunicação', 'Desenvolvimento', 'Diretoria', 'Engenharia', 'Expansão', 'Estoque', 'Frota',
        'Jurídico', 'Logística', 'Loja', 'Operacional', 'Patrimônio', 'Projetos', 'Recursos Humanos', 'TIC'
    ];

    const cores = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#4BCE36', '#C040FF', '#36A1EB', '#E56A2C',
        '#FF8E1E', '#CE4B36', '#A1FF36', '#9A36FF', '#EC7A1E', '#5E36FF', '#4CC0C0', '#FF5733'
    ];

    useEffect(() => {
        fetch(`${backendIp}/api/list_chamados`)
            .then(response => response.json())
            .then(data => {
                setChamados(data.chamados);
            })
            .catch(error => {
                console.error('Erro ao carregar os dados dos chamados:', error);
            });
    }, []);

    const dataHoje = new Date();
    const dataLimite = new Date(dataHoje.setDate(dataHoje.getDate() - 7));

    const chamadosUltimos7Dias = chamados.filter(chamado => {
        const dataChamado = new Date(chamado.data);
        return dataChamado >= dataLimite;
    });

    const chamadosPorDia = chamadosUltimos7Dias.reduce((acc, chamado) => {
        const diaChamado = chamado.data.split(' ')[0]; 
        acc[diaChamado] = (acc[diaChamado] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(chamadosPorDia).sort();
    const dataValues = labels.map(label => chamadosPorDia[label]);

    const lineData = {
        labels: labels,
        datasets: [
            {
                label: 'Chamados Abertos (últimos 7 dias)',
                data: dataValues,
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54,162,235,0.2)',
            },
        ],
    };

    const chamadosPorCategoria = chamados.reduce((acc, chamado) => {
        acc[chamado.setor] = (acc[chamado.setor] || 0) + 1;
        return acc;
    }, {});

    const chamadosResolvidos = chamados.filter((chamado) => chamado.status === 'Fechado').length;
    const chamadosEmAndamento = chamados.filter((chamado) => chamado.status === 'Em Andamento').length;
    const chamadosEspera = chamados.filter((chamado) => chamado.status === 'Espera').length;
    const chamadosPendentes = chamados.filter((chamado) => chamado.status === 'Aberto').length;

    const barData = {
        labels: setores,
        datasets: [
            {
                label: 'Chamados por Setor',
                data: setores.map(setor => chamadosPorCategoria[setor] || 0),
                backgroundColor: cores,
            },
        ],
    };

    const doughnutData = {
        labels: ['Fechados', 'Abertos', 'Em Andamento', 'Espera'],
        datasets: [
            {
                label: 'Status dos Chamados',
                data: [chamadosResolvidos, chamadosPendentes, chamadosEmAndamento, chamadosEspera],
                backgroundColor: ['#4CAF50', '#F44336', '#9966FF', 'gray'],
            },
        ],
    };

    const chamadosPorSetores = setores.reduce((acc, setor) => {
        acc[setor] = chamados.filter(chamado => chamado.setor === setor && chamado.status === 'Fechado').length;
        return acc;
    }, {});

    const radarData = {
        labels: setores,
        datasets: [
            {
                label: 'Chamados Resolvidos',
                data: setores.map(setor => chamadosPorSetores[setor]),
                backgroundColor: 'rgba(153,102,255,0.2)',
                borderColor: '#9966FF',
                pointBackgroundColor: '#9966FF',
            },
        ],
    };

    return (
        <div>
            <div className="section">
                <h2>Meu Dashboard</h2>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                        <div style={{ width: '41%', minWidth: '300px' }}>
                            <h3>Chamados por Categoria</h3>
                            <Bar data={barData} />
                        </div>
                        <div style={{ width: '30%', minWidth: '300px' }}>
                            <h3>Chamados Abertos</h3>
                            <Line data={lineData} />
                        </div>
                        <div style={{ width: '30%', minWidth: '300px' }}>
                            <h3>Chamados no Radar</h3>
                            <Radar data={radarData} />
                        </div>
                        <div style={{ width: '30%', minWidth: '300px' }}>
                            <h3>Status dos Chamados</h3>
                            <Doughnut data={doughnutData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuDashboard;