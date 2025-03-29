window.tarefas = JSON.parse(localStorage.getItem('tarefas')) || [
    { id: 1, titulo: 'Redesenho da Homepage', categoria: 'Design', status: 'Concluído', prioridade: 'Alta', municipio: 'São Paulo' },
    { id: 2, titulo: 'Implementar Dark Mode', categoria: 'Desenvolvimento', status: 'Em andamento', prioridade: 'Média', municipio: 'Rio de Janeiro' },
    { id: 3, titulo: 'Otimizar Performance', categoria: 'Desenvolvimento', status: 'Pendente', prioridade: 'Alta', municipio: 'Belo Horizonte' }
];

window.tarefaEditandoId = null;

window.salvarTarefas = function() {
    localStorage.setItem('tarefas', JSON.stringify(window.tarefas));
}

window.mostrarTarefas = function() {
    const tabelaTarefas = document.getElementById('taskTableBody');
    if (!tabelaTarefas) return;

    tabelaTarefas.innerHTML = '';
    window.tarefas.forEach(tarefa => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${tarefa.titulo}</td>
            <td>${tarefa.categoria}</td>
            <td>${tarefa.status}</td>
            <td>${tarefa.prioridade}</td>
            <td>${tarefa.municipio || 'Não especificado'}</td>
            <td class="task-actions">
                <button class="action-btn edit" onclick="window.editarTarefa(${tarefa.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="action-btn delete" onclick="window.excluirTarefa(${tarefa.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </td>
        `;
        tabelaTarefas.appendChild(tr);
    });
}

window.mostrarFormulario = function() {
    const formulario = document.getElementById('taskForm');
    if (!formulario) return;
    
    formulario.classList.remove('hidden');
    if (window.tarefaEditandoId === null) {
        formulario.reset();
    }
}

window.esconderFormulario = function() {
    const formulario = document.getElementById('taskForm');
    if (!formulario) return;
    
    formulario.classList.add('hidden');
    formulario.reset();
    window.tarefaEditandoId = null;
    const btnEnviar = formulario.querySelector('button[type="submit"]');
    if (btnEnviar) {
        btnEnviar.textContent = 'Adicionar';
    }
}

window.editarTarefa = function(id) {
    const formulario = document.getElementById('taskForm');
    if (!formulario) return;
    
    const tarefa = window.tarefas.find(t => t.id === id);
    if (tarefa) {
        window.tarefaEditandoId = id;
        const campos = formulario.elements;
        campos.title.value = tarefa.titulo;
        campos.category.value = tarefa.categoria;
        campos.status.value = tarefa.status;
        campos.priority.value = tarefa.prioridade;
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

document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-personalizado';
    cursor.innerHTML = '<span></span>';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => cursor.classList.add('hover'));
    document.addEventListener('mouseup', () => cursor.classList.remove('hover'));

    const elementos = document.querySelectorAll('a, button, .cartao-projeto, .cartao-habilidade');
    elementos.forEach(elemento => {
        elemento.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        elemento.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    inicializarHabilidades();

    const elementoAno = document.getElementById('currentYear');
    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }

    document.querySelectorAll('a[href^="#"]').forEach(ancora => {
        ancora.addEventListener('click', function (e) {
            e.preventDefault();
            const alvo = document.querySelector(this.getAttribute('href'));
            if (alvo) {
                alvo.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const urlApi = "https://servicodados.ibge.gov.br/api/v1/localidades/municipios";
    const selectMunicipio = document.getElementById("municipioSelect");

    async function carregarMunicipios() {
        try {
            const resposta = await fetch(urlApi);
            if (!resposta.ok) {
                throw new Error("Erro ao buscar os municípios");
            }
            const dados = await resposta.json();
            preencherSelect(dados);
        } catch (erro) {
            console.error("Erro:", erro);
            selectMunicipio.innerHTML = "<option value=''>Erro ao carregar municípios</option>";
        }
    }

    function preencherSelect(municipios) {
        selectMunicipio.innerHTML = "<option value=''>Selecione um município</option>";
        municipios
            .sort((a, b) => a.nome.localeCompare(b.nome))
            .forEach(municipio => {
                const opcao = document.createElement("option");
                opcao.value = municipio.nome;
                opcao.textContent = municipio.nome;
                selectMunicipio.appendChild(opcao);
            });
    }

    const formulario = document.getElementById('taskForm');
    const btnAdicionar = document.getElementById('addTaskBtn');
    const btnCancelar = document.getElementById('cancelTaskBtn');

    if (formulario && btnAdicionar && btnCancelar) {
        formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            const dadosForm = new FormData(formulario);
            const dadosTarefa = {
                titulo: dadosForm.get('title'),
                categoria: dadosForm.get('category'),
                status: dadosForm.get('status'),
                prioridade: dadosForm.get('priority'),
                municipio: dadosForm.get('municipio')
            };

            if (window.tarefaEditandoId === null) {
                dadosTarefa.id = Date.now();
                window.tarefas.push(dadosTarefa);
            } else {
                const index = window.tarefas.findIndex(t => t.id === window.tarefaEditandoId);
                if (index !== -1) {
                    window.tarefas[index] = { ...window.tarefas[index], ...dadosTarefa };
                }
            }

            window.salvarTarefas();
            window.mostrarTarefas();
            window.esconderFormulario();
        });

        btnAdicionar.addEventListener('click', window.mostrarFormulario);
        btnCancelar.addEventListener('click', window.esconderFormulario);
    }

    carregarMunicipios();

    const botoesAba = document.querySelectorAll('.tab-btn');
    const paineis = document.querySelectorAll('.tab-pane');

    botoesAba.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesAba.forEach(b => b.classList.remove('active'));
            paineis.forEach(p => p.classList.remove('active'));
            
            botao.classList.add('active');
            const painel = document.querySelector(`.tab-pane[data-tab="${botao.dataset.tab}"]`);
            if (painel) {
                painel.classList.add('active');
            }
        });
    });
});

const habilidades = [
    {
        nome: 'HTML5',
        categoria: 'frontend',
        nivel: 90,
        descricao: 'Domínio em estruturação semântica, formulários e elementos multimídia.'
    },
    {
        nome: 'CSS3',
        categoria: 'frontend',
        nivel: 85,
        descricao: 'Experiência com layouts responsivos, flexbox, grid e animações.'
    },
    {
        nome: 'JavaScript',
        categoria: 'frontend',
        nivel: 80,
        descricao: 'Conhecimento em ES6+, DOM, eventos e assincronismo.'
    },
    {
        nome: 'Node.js',
        categoria: 'backend',
        nivel: 75,
        descricao: 'Desenvolvimento de APIs RESTful e integração com bancos de dados.'
    },
    {
        nome: 'Python',
        categoria: 'backend',
        nivel: 70,
        descricao: 'Automação de tarefas e desenvolvimento de scripts.'
    },
    {
        nome: 'Git',
        categoria: 'ferramentas',
        nivel: 85,
        descricao: 'Controle de versão, branches, merges e colaboração.'
    },
    {
        nome: 'VS Code',
        categoria: 'ferramentas',
        nivel: 90,
        descricao: 'Ambiente de desenvolvimento integrado com extensões.'
    },
    {
        nome: 'Responsividade',
        categoria: 'conceitos',
        nivel: 85,
        descricao: 'Design adaptável para diferentes dispositivos e telas.'
    }
];

function inicializarHabilidades() {
    const container = document.querySelector('.habilidades-grid');
    if (!container) return;

    function filtrarHabilidades(categoria) {
        return categoria === 'todas' ? habilidades : habilidades.filter(h => h.categoria === categoria);
    }

    function atualizarHabilidades(categoria) {
        const habilidadesFiltradas = filtrarHabilidades(categoria);
        container.innerHTML = habilidadesFiltradas.map(habilidade => `
            <div class="cartao-habilidade" onclick="mostrarDetalhesHabilidade('${habilidade.nome}', '${habilidade.descricao}')">
                <div class="cabecalho-habilidade">
                    <h3>${habilidade.nome}</h3>
                    <div class="nivel-habilidade">
                        <div class="barra-habilidade">
                            <div class="progresso-habilidade" style="width: ${habilidade.nivel}%"></div>
                        </div>
                        <span>${habilidade.nivel}%</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    document.querySelectorAll('.botao-categoria').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.botao-categoria').forEach(b => b.classList.remove('ativo'));
            btn.classList.add('ativo');
            atualizarHabilidades(btn.dataset.categoria);
        });
    });

    atualizarHabilidades('todas');
}

window.mostrarDetalhesHabilidade = function(nome, descricao) {
    const detalhes = document.getElementById('detalhesHabilidade');
    if (!detalhes) return;

    const titulo = detalhes.querySelector('.titulo-detalhes-habilidade');
    const desc = detalhes.querySelector('.descricao-detalhes-habilidade');
    
    if (titulo && desc) {
        titulo.textContent = nome;
        desc.textContent = descricao;
        detalhes.classList.remove('oculto');
    }
}

document.querySelector('.botao-fechar')?.addEventListener('click', () => {
    document.getElementById('detalhesHabilidade')?.classList.add('oculto');
});
