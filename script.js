window.tarefas = JSON.parse(localStorage.getItem('tarefas')) || [
    { id: 1, titulo: 'Redesenho da Homepage', categoria: 'Design', status: 'Concluído', prioridade: 'Alta', municipio: 'São Paulo', estado: 'SP' },
    { id: 2, titulo: 'Implementar Dark Mode', categoria: 'Desenvolvimento', status: 'Em andamento', prioridade: 'Média', municipio: 'Rio de Janeiro', estado: 'RJ' },
    { id: 3, titulo: 'Otimizar Performance', categoria: 'Desenvolvimento', status: 'Pendente', prioridade: 'Alta', municipio: 'Belo Horizonte', estado: 'MG' }
];

window.tarefaEditandoId = null;

window.salvarTarefas = function() {
    localStorage.setItem('tarefas', JSON.stringify(window.tarefas));
}

window.mostrarTarefas = function() {
    const listaTarefas = document.getElementById('corpo-tabela');
    if (!listaTarefas) return;

    listaTarefas.innerHTML = '';
    
    window.tarefas.forEach(tarefa => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${tarefa.titulo}</td>
            <td>${tarefa.descricao || '-'}</td>
            <td>${tarefa.categoria || '-'}</td>
            <td><span class="status-badge status-${tarefa.status.toLowerCase()}">${tarefa.status}</span></td>
            <td><span class="prioridade-badge prioridade-${tarefa.prioridade.toLowerCase()}">${tarefa.prioridade}</span></td>
            <td>${tarefa.estado || '-'}</td>
            <td>${tarefa.municipio || '-'}</td>
            <td class="acoes">
                <button onclick="window.editarTarefa(${tarefa.id})" class="botao-acao editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="window.excluirTarefa(${tarefa.id})" class="botao-acao excluir">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        listaTarefas.appendChild(tr);
    });
}

window.mostrarFormulario = function() {
    const formulario = document.getElementById('formulario-tarefa');
    if (!formulario) return;
    
    formulario.classList.remove('oculto');
    if (window.tarefaEditandoId === null) {
        formulario.reset();
    }
}

window.esconderFormulario = function() {
    const formulario = document.getElementById('formulario-tarefa');
    if (!formulario) return;
    
    formulario.classList.add('oculto');
    formulario.reset();
    window.tarefaEditandoId = null;
    const btnEnviar = formulario.querySelector('button[type="submit"]');
    if (btnEnviar) {
        btnEnviar.textContent = 'Adicionar';
    }
}

window.editarTarefa = function(id) {
    const formulario = document.getElementById('formulario-tarefa');
    if (!formulario) return;
    
    const tarefa = window.tarefas.find(t => t.id === id);
    if (tarefa) {
        window.tarefaEditandoId = id;
        const campos = formulario.elements;
        campos.titulo.value = tarefa.titulo;
        campos.descricao.value = tarefa.descricao;
        campos.status.value = tarefa.status;
        campos.prioridade.value = tarefa.prioridade;
        campos.estado.value = tarefa.estado;
        campos.municipio.value = tarefa.municipio || '';
        window.mostrarFormulario();
        const btnEnviar = formulario.querySelector('button[type="submit"]');
        if (btnEnviar) {
            btnEnviar.textContent = 'Atualizar';
        }
    }
}

window.excluirTarefa = function(id) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        window.tarefas = window.tarefas.filter(t => t.id !== id);
        window.salvarTarefas();
        window.mostrarTarefas();
    }
}

window.salvarTarefa = function(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const tarefa = {
        id: form.dataset.id || Date.now(),
        titulo: formData.get('titulo'),
        descricao: formData.get('descricao'),
        categoria: formData.get('categoria'),
        status: formData.get('status'),
        prioridade: formData.get('prioridade'),
        estado: formData.get('estado'),
        municipio: formData.get('municipio')
    };
    
    if (form.dataset.id) {
        window.tarefas = window.tarefas.map(t => 
            t.id === parseInt(form.dataset.id) ? tarefa : t
        );
    } else {
        // Nova tarefa
        window.tarefas.push(tarefa);
    }
    
    window.salvarTarefas();
    window.mostrarTarefas();
    window.esconderFormulario();
}

async function carregarMunicipios(uf) {
    const selectMunicipio = document.getElementById('municipio');
    const loadingSpinner = document.getElementById('municipio-loading');
    
    if (!uf) {
        selectMunicipio.innerHTML = '<option value="">Selecione um município</option>';
        return;
    }
    
    try {
        loadingSpinner.style.display = 'inline-block';
        selectMunicipio.disabled = true;
        
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
        const municipios = await response.json();
        
        selectMunicipio.innerHTML = `
            <option value="">Selecione um município</option>
            ${municipios
                .sort((a, b) => a.nome.localeCompare(b.nome))
                .map(municipio => `<option value="${municipio.nome}">${municipio.nome}</option>`)
                .join('')}
        `;
    } catch (error) {
        console.error('Erro ao carregar municípios:', error);
        selectMunicipio.innerHTML = '<option value="">Erro ao carregar municípios</option>';
    } finally {
        loadingSpinner.style.display = 'none';
        selectMunicipio.disabled = false;
    }
}

function inicializarSelectsLocalizacao() {
    const selectEstado = document.getElementById('estado');
    if (selectEstado) {
        selectEstado.addEventListener('change', (e) => {
            const uf = e.target.value;
            carregarMunicipios(uf);
        });
    }
}

const traducoesTempo = {
    'clear': 'Céu limpo',
    'partly-cloudy-day': 'Parcialmente nublado',
    'cloudy': 'Nublado',
    'overcast': 'Encoberto',
    'rain': 'Chuva',
    'snow': 'Neve',
    'sleet': 'Granizo',
    'wind': 'Ventoso',
    'fog': 'Neblina',
    'thunder-rain': 'Tempestade',
    'thunder-showers-day': 'Pancadas de chuva com trovoadas',
    'thunder': 'Trovoadas',
    'showers-day': 'Pancadas de chuva',
    'rain-snow-showers-day': 'Chuva com neve',
    'snow-showers-day': 'Neve',
    'partly-cloudy-night': 'Parcialmente nublado',
    'showers-night': 'Pancadas de chuva',
    'thunder-showers-night': 'Tempestade',
    'snow-showers-night': 'Neve'
};

async function carregarDadosClima() {
    try {
        const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/São%20leopoldo?unitGroup=metric&key=DWJFJ7YVUFAHE4Q4X6AB5TWZX&contentType=json');
        const data = await response.json();
        
        const condicoesAtuais = data.currentConditions;
        document.getElementById('temp-atual').textContent = condicoesAtuais.temp.toFixed(1) + '°C';
        document.getElementById('temp-80m').textContent = condicoesAtuais.temp.toFixed(1) + '°C';
        document.getElementById('chuva-atual').textContent = (condicoesAtuais.precip || 0).toFixed(1) + ' mm/h';
        document.getElementById('precipitacao-atual').textContent = (condicoesAtuais.precipprob || 0) + '%';
        document.getElementById('clima-descricao').textContent = traducoesTempo[condicoesAtuais.icon] || condicoesAtuais.conditions;
        
        const tabelaCorpo = document.getElementById('tabela-previsao-corpo');
        tabelaCorpo.innerHTML = '';
        
        data.days.slice(1, 6).forEach(day => {
            const data = new Date(day.datetime);
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${data.toLocaleDateString('pt-BR', {weekday: 'long', day: 'numeric'})}</td>
                <td class="temperatura">${day.temp.toFixed(1)}°C</td>
                <td>${(day.precip || 0).toFixed(1)} mm</td>
                <td>${day.precipprob || 0}%</td>
            `;
            
            tabelaCorpo.appendChild(row);
        });
        
    } catch (error) {
        console.error('Erro ao carregar dados do clima:', error);
        document.getElementById('clima-descricao').textContent = 'Erro ao carregar dados do clima';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.cursor-personalizado');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const elementosHover = document.querySelectorAll('a, button, .cartao-habilidade, .cartao-projeto');
    elementosHover.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    const elementoAno = document.getElementById('ano-atual');
    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }

    const abas = document.querySelectorAll('.botao-aba');
    const paineis = document.querySelectorAll('.painel-aba');

    abas.forEach(aba => {
        aba.addEventListener('click', () => {
            const abaAlvo = aba.dataset.aba;
            
            abas.forEach(t => t.classList.remove('ativo'));
            paineis.forEach(p => p.classList.remove('ativo'));
            
            aba.classList.add('ativo');
            document.getElementById(abaAlvo).classList.add('ativo');
        });
    });

    const formulario = document.getElementById('formulario-tarefa');
    if (formulario) {
        formulario.addEventListener('submit', window.salvarTarefa);
    }

    const botaoAdicionar = document.getElementById('botao-adicionar');
    if (botaoAdicionar) {
        botaoAdicionar.addEventListener('click', window.mostrarFormulario);
    }

    const botaoCancelar = document.getElementById('botao-cancelar');
    if (botaoCancelar) {
        botaoCancelar.addEventListener('click', window.esconderFormulario);
    }

    const observador = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visivel');
                observador.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.aparecer, .aparecer-esquerda, .aparecer-direita').forEach(elemento => {
        observador.observe(elemento);
    });

    const habilidades = [
        { 
            nome: 'HTML', 
            nivel: 90,
            categoria: 'frontend',
            descricao: 'Desenvolvimento de estruturas web semânticas e acessíveis.'
        },
        { 
            nome: 'CSS', 
            nivel: 85,
            categoria: 'frontend',
            descricao: 'Criação de layouts responsivos e animações modernas.'
        },
        { 
            nome: 'JavaScript', 
            nivel: 80,
            categoria: 'frontend',
            descricao: 'Programação frontend com foco em interatividade e UX.'
        },
        { 
            nome: 'Node.js', 
            nivel: 75,
            categoria: 'backend',
            descricao: 'Desenvolvimento de APIs e serviços backend.'
        },
        { 
            nome: 'React', 
            nivel: 70,
            categoria: 'frontend',
            descricao: 'Criação de interfaces modernas e componentizadas.'
        },
        { 
            nome: 'Git', 
            nivel: 85,
            categoria: 'ferramentas',
            descricao: 'Controle de versão e colaboração em equipe.'
        },
        { 
            nome: 'SQL', 
            nivel: 75,
            categoria: 'backend',
            descricao: 'Modelagem e consulta de bancos de dados relacionais.'
        },
        { 
            nome: 'Docker', 
            nivel: 65,
            categoria: 'ferramentas',
            descricao: 'Containerização e deploy de aplicações.'
        },
        { 
            nome: 'TypeScript', 
            nivel: 70,
            categoria: 'frontend',
            descricao: 'Desenvolvimento JavaScript com tipagem estática.'
        },
        { 
            nome: 'API REST', 
            nivel: 80,
            categoria: 'conceitos',
            descricao: 'Design e implementação de APIs RESTful.'
        },
        { 
            nome: 'Clean Code', 
            nivel: 85,
            categoria: 'conceitos',
            descricao: 'Práticas de código limpo e manutenível.'
        },
        { 
            nome: 'Scrum', 
            nivel: 75,
            categoria: 'conceitos',
            descricao: 'Metodologia ágil e gestão de projetos.'
        }
    ];

    function inicializarHabilidades() {
        const gradeHabilidades = document.querySelector('.grade-habilidades');
        const detalhesHabilidade = document.getElementById('detalhes-habilidade');
        const botoesCategoria = document.querySelectorAll('.botao-categoria');

        function atualizarHabilidades(categoria = 'all') {
            if (!gradeHabilidades) return;
            
            gradeHabilidades.innerHTML = '';

            const habilidadesFiltradas = habilidades.filter(habilidade => 
                categoria === 'all' || habilidade.categoria === categoria
            );

            habilidadesFiltradas.forEach(habilidade => {
                const cartaoHabilidade = document.createElement('div');
                cartaoHabilidade.className = 'cartao-habilidade';
                cartaoHabilidade.innerHTML = `
                    <h3 class="nome-habilidade">${habilidade.nome}</h3>
                    <div class="nivel-habilidade">
                        <div class="nivel-habilidade-fill" style="width: 0%"></div>
                    </div>
                    <span class="porcentagem-habilidade">${habilidade.nivel}%</span>
                `;

                cartaoHabilidade.addEventListener('click', () => mostrarDetalhesHabilidade(habilidade));
                gradeHabilidades.appendChild(cartaoHabilidade);

                setTimeout(() => {
                    const barra = cartaoHabilidade.querySelector('.nivel-habilidade-fill');
                    if (barra) {
                        barra.style.width = `${habilidade.nivel}%`;
                    }
                }, 100);
            });
        }

        function mostrarDetalhesHabilidade(habilidade) {
            if (!detalhesHabilidade) return;

            const titulo = detalhesHabilidade.querySelector('.titulo-detalhes');
            const descricao = detalhesHabilidade.querySelector('.descricao-detalhes');
            const botaoFechar = detalhesHabilidade.querySelector('.botao-fechar');

            if (titulo) titulo.textContent = habilidade.nome;
            if (descricao) descricao.textContent = habilidade.descricao;

            detalhesHabilidade.classList.remove('oculto');

            if (botaoFechar) {
                botaoFechar.addEventListener('click', () => {
                    detalhesHabilidade.classList.add('oculto');
                }, { once: true });
            }
        }

        botoesCategoria.forEach(btn => {
            btn.addEventListener('click', () => {
                botoesCategoria.forEach(b => b.classList.remove('ativo'));
                btn.classList.add('ativo');
                atualizarHabilidades(btn.dataset.categoria);
            });
        });

        atualizarHabilidades();
    }

    inicializarHabilidades();
    window.mostrarTarefas();
    carregarDadosClima();
    inicializarSelectsLocalizacao();
});