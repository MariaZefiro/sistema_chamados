import React, { useState, useEffect } from 'react';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, PointElement, LineElement, RadialLinearScale, } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, PointElement, LineElement, RadialLinearScale);

const MenuDashboard = () => {
    const [chamados, setChamados] = useState([]);

    useEffect(() => {
        const mockData = [
            { categoria: 'TI', status: 'Resolvido', colaborador: 'Maria', chamados: 10 },
            { categoria: 'RH', status: 'Pendente', colaborador: 'Maria', chamados: 5 },
            { categoria: 'Financeiro', status: 'Resolvido', colaborador: 'Maria', chamados: 3 },
            { categoria: 'TI', status: 'Pendente', colaborador: 'Carlos', chamados: 8 },
            { categoria: 'RH', status: 'Resolvido', colaborador: 'Carlos', chamados: 2 },
        ];
        setChamados(mockData);
    }, []);

    const chamadosPorCategoria = chamados.reduce((acc, chamado) => {
        acc[chamado.categoria] = (acc[chamado.categoria] || 0) + chamado.chamados;
        return acc;
    }, {});

    const chamadosResolvidos = chamados.filter((chamado) => chamado.status === 'Resolvido').length;
    const chamadosPendentes = chamados.filter((chamado) => chamado.status === 'Pendente').length;

    const barData = {
        labels: Object.keys(chamadosPorCategoria),
        datasets: [
            {
                label: 'Chamados por Categoria',
                data: Object.values(chamadosPorCategoria),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    const doughnutData = {
        labels: ['Resolvidos', 'Pendentes'],
        datasets: [
            {
                label: 'Status dos Chamados',
                data: [chamadosResolvidos, chamadosPendentes],
                backgroundColor: ['#4CAF50', '#F44336'],
            },
        ],
    };

    const lineData = {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        datasets: [
            {
                label: 'Chamados Abertos',
                data: [15, 20, 10, 5],
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54,162,235,0.2)',
            },
        ],
    };

    const radarData = {
        labels: ['TI', 'RH', 'Financeiro'],
        datasets: [
            {
                label: 'Chamados Resolvidos',
                data: [10, 2, 3],
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
                <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div style={{ width: '30%', minWidth: '300px' }}>
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
    );
};

export default MenuDashboard;