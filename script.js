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
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<span></span>';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    });

    document.querySelectorAll('a, button, .skill-card').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
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

    botoesAba.forEach(btn => {
        btn.addEventListener('click', () => {
            const abaAlvo = btn.dataset.tab;
            
            botoesAba.forEach(b => b.classList.remove('active'));
            paineis.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const elementoAlvo = document.getElementById(abaAlvo);
            if (elementoAlvo) {
                elementoAlvo.classList.add('active');
            }
        });
    });

    window.mostrarTarefas();

    const opcoes = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
                if (entrada.target.classList.contains('skill-card')) {
                    setTimeout(() => {
                        entrada.target.querySelector('.skill-level-fill').style.width = entrada.target.dataset.level + '%';
                    }, 300);
                }
            }
        });
    }, opcoes);

    document.querySelectorAll('.fade-in, .skill-card').forEach(elemento => {
        observador.observe(elemento);
    });
});

const habilidades = [
    { 
        nome: 'HTML', 
        nivel: 90, 
        categoria: 'frontend',
        descricao: 'Desenvolvimento de estruturas web semânticas e acessíveis, com foco em SEO e boas práticas.'
    },
    { 
        nome: 'CSS', 
        nivel: 85, 
        categoria: 'frontend',
        descricao: 'Criação de layouts responsivos, animações e estilização moderna com Flexbox, Grid e preprocessadores.'
    },
    { 
        nome: 'JavaScript', 
        nivel: 80, 
        categoria: 'frontend',
        descricao: 'Desenvolvimento de aplicações interativas, manipulação do DOM e integração com APIs.'
    },
    { 
        nome: 'React', 
        nivel: 75, 
        categoria: 'frontend',
        descricao: 'Construção de interfaces componentizadas, gerenciamento de estado e roteamento.'
    },

    { 
        nome: 'Node.js', 
        nivel: 70, 
        categoria: 'backend',
        descricao: 'Desenvolvimento de APIs RESTful, autenticação e integração com bancos de dados.'
    },
    { 
        nome: 'Express', 
        nivel: 65, 
        categoria: 'backend',
        descricao: 'Criação de rotas, middlewares e APIs escaláveis.'
    },
    { 
        nome: 'MongoDB', 
        nivel: 60, 
        categoria: 'backend',
        descricao: 'Modelagem de dados, queries e operações CRUD.'
    },

    { 
        nome: 'Git', 
        nivel: 85, 
        categoria: 'ferramentas',
        descricao: 'Controle de versão, branches, merges e colaboração em equipe.'
    },
    { 
        nome: 'VS Code', 
        nivel: 90, 
        categoria: 'ferramentas',
        descricao: 'Ambiente de desenvolvimento integrado com extensões e personalização.'
    },
    { 
        nome: 'Webpack', 
        nivel: 70, 
        categoria: 'ferramentas',
        descricao: 'Bundling, otimização e gerenciamento de assets.'
    },

    { 
        nome: 'Clean Code', 
        nivel: 85, 
        categoria: 'conceitos',
        descricao: 'Práticas de código limpo, princípios SOLID e padrões de projeto.'
    },
    { 
        nome: 'Responsive Design', 
        nivel: 90, 
        categoria: 'conceitos',
        descricao: 'Design adaptativo, mobile-first e media queries.'
    },
    { 
        nome: 'UI/UX Design', 
        nivel: 80, 
        categoria: 'conceitos',
        descricao: 'Princípios de design, usabilidade e experiência do usuário.'
    }
];

function inicializarHabilidades() {
    const gridHabilidades = document.querySelector('.skills-grid');
    const detalhesHabilidade = document.getElementById('skillDetails');
    const botoesCategoria = document.querySelectorAll('.category-btn');
    let categoriaAtual = 'all';

    function atualizarHabilidades(categoria = 'all') {
        if (!gridHabilidades) return;
        
        categoriaAtual = categoria;
        gridHabilidades.innerHTML = '';

        const habilidadesFiltradas = habilidades.filter(habilidade => 
            categoria === 'all' || habilidade.categoria === categoria
        );

        habilidadesFiltradas.forEach(habilidade => {
            const cartaoHabilidade = document.createElement('div');
            cartaoHabilidade.className = 'skill-card';
            cartaoHabilidade.innerHTML = `
                <h3 class="skill-name">${habilidade.nome}</h3>
                <div class="skill-progress">
                    <div class="skill-progress-bar" style="width: ${habilidade.nivel}%"></div>
                </div>
                <div class="skill-level">${habilidade.nivel}%</div>
            `;

            cartaoHabilidade.addEventListener('click', () => mostrarDetalhesHabilidade(habilidade));
            gridHabilidades.appendChild(cartaoHabilidade);
        });
    }

    function mostrarDetalhesHabilidade(habilidade) {
        if (!detalhesHabilidade) return;

        const titulo = detalhesHabilidade.querySelector('.skill-details-title');
        const descricao = detalhesHabilidade.querySelector('.skill-details-description');
        const btnFechar = detalhesHabilidade.querySelector('.close-btn');

        if (titulo) titulo.textContent = habilidade.nome;
        if (descricao) descricao.textContent = habilidade.descricao;

        detalhesHabilidade.classList.remove('hidden');

        if (btnFechar) {
            btnFechar.addEventListener('click', () => {
                detalhesHabilidade.classList.add('hidden');
            }, { once: true });
        }
    }

    botoesCategoria.forEach(btn => {
        btn.addEventListener('click', () => {
            botoesCategoria.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            atualizarHabilidades(btn.dataset.categoria);
        });
    });

    atualizarHabilidades();
}
