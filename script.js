// Custom cursor
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Scale effect on hoverable elements
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Update copyright year
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Skills data
    const skills = [
        // Frontend
        { 
            name: 'HTML', 
            level: 90, 
            category: 'frontend',
            description: 'Desenvolvimento de estruturas web semânticas, acessíveis e otimizadas para SEO. Experiência com formulários, validações e integração com JavaScript.'
        },
        { 
            name: 'CSS', 
            level: 85, 
            category: 'frontend',
            description: 'Criação de layouts responsivos e modernos utilizando Flexbox e Grid. Experiência com animações, transições e design adaptativo.'
        },
        { 
            name: 'JavaScript', 
            level: 80, 
            category: 'frontend',
            description: 'Desenvolvimento de aplicações web interativas, manipulação do DOM, APIs modernas e programação assíncrona com Promises/async/await.'
        },
        { 
            name: 'Tailwind CSS', 
            level: 85, 
            category: 'frontend',
            description: 'Utilização do framework para desenvolvimento ágil de interfaces, customização de temas e criação de componentes reutilizáveis.'
        },
        { 
            name: 'TypeScript', 
            level: 75, 
            category: 'frontend',
            description: 'Desenvolvimento com tipagem estática, interfaces, generics e integração com frameworks modernos.'
        },
        
        // Backend
        { 
            name: 'Node.js', 
            level: 75, 
            category: 'backend',
            description: 'Desenvolvimento de APIs RESTful, integração com bancos de dados, autenticação e autorização de usuários.'
        },
        { 
            name: 'Python', 
            level: 70, 
            category: 'backend',
            description: 'Criação de scripts de automação, processamento de dados e desenvolvimento de APIs com Flask/FastAPI.'
        },

        // Tools
        { 
            name: 'VS Code', 
            level: 85, 
            category: 'tools',
            description: 'Domínio do editor, extensões produtivas, debugger integrado e personalização avançada do ambiente.'
        },
        { 
            name: 'Figma', 
            level: 75, 
            category: 'tools',
            description: 'Prototipagem de interfaces, inspeção de design, exportação de assets e colaboração com equipes de design.'
        },
        { 
            name: 'Git & GitHub', 
            level: 80, 
            category: 'tools',
            description: 'Controle de versão, branches, pull requests, resolução de conflitos e colaboração em equipe.'
        }
    ];

    // Skills functionality
    let activeCategory = 'all';
    const skillsGrid = document.getElementById('skillsGrid');
    const skillDetails = document.getElementById('skillDetails');

    function getLevelText(level) {
        return level < 60 ? 'Iniciante' : level < 75 ? 'Intermediário' : 'Avançado';
    }

    function createSkillCard(skill, index) {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.style.animationDelay = `${0.1 + index * 0.1}s`;
        card.innerHTML = `
            <h3 class="skill-name hover-effect">${skill.name}</h3>
            <div class="skill-progress">
                <div class="skill-progress-bar" style="width: ${skill.level}%"></div>
            </div>
            <p class="skill-level">${getLevelText(skill.level)}</p>
        `;
        card.addEventListener('click', () => showSkillDetails(skill));
        return card;
    }

    function showSkillDetails(skill) {
        skillDetails.className = 'skill-details';
        skillDetails.innerHTML = `
            <div class="skill-details-header">
                <h3 class="skill-details-title hover-effect">${skill.name}</h3>
                <button class="close-btn" onclick="document.getElementById('skillDetails').className = 'skill-details hidden'">✕</button>
            </div>
            <p>${skill.description}</p>
        `;
    }

    function updateSkillsGrid() {
        skillsGrid.innerHTML = '';
        const filteredSkills = activeCategory === 'all' 
            ? skills 
            : skills.filter(skill => skill.category === activeCategory);
        
        filteredSkills.forEach((skill, index) => {
            skillsGrid.appendChild(createSkillCard(skill, index));
        });
    }

    // Category buttons functionality
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.category-btn.active').classList.remove('active');
            btn.classList.add('active');
            activeCategory = btn.dataset.category;
            updateSkillsGrid();
        });
    });

    // Initialize skills grid
    updateSkillsGrid();

    // Projects section functionality
    const taskForm = document.getElementById('taskForm');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const cancelTaskBtn = document.getElementById('cancelTaskBtn');
    const taskTableBody = document.getElementById('taskTableBody');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [
        { id: 1, title: 'Redesenho da Homepage', category: 'Design', status: 'Concluído', priority: 'Alta' },
        { id: 2, title: 'Implementar Dark Mode', category: 'Desenvolvimento', status: 'Em andamento', priority: 'Média' },
        { id: 3, title: 'Otimizar Performance', category: 'Desenvolvimento', status: 'Pendente', priority: 'Alta' }
    ];

    let editingTaskId = null;

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskTableBody.innerHTML = '';
        tasks.forEach(task => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${task.title}</td>
                <td>${task.category}</td>
                <td>${task.status}</td>
                <td>${task.priority}</td>
                <td class="task-actions">
                    <button class="action-btn edit" onclick="editTask(${task.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="action-btn delete" onclick="deleteTask(${task.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </td>
            `;
            taskTableBody.appendChild(tr);
        });
    }

    function showTaskForm() {
        taskForm.classList.remove('hidden');
        if (editingTaskId === null) {
            taskForm.reset();
        }
    }

    function hideTaskForm() {
        taskForm.classList.add('hidden');
        taskForm.reset();
        editingTaskId = null;
        const submitBtn = taskForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Adicionar';
    }

    function editTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            editingTaskId = id;
            const formInputs = taskForm.elements;
            formInputs.title.value = task.title;
            formInputs.category.value = task.category;
            formInputs.status.value = task.status;
            formInputs.priority.value = task.priority;
            showTaskForm();
            const submitBtn = taskForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Atualizar';
        }
    }

    function deleteTask(id) {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
        }
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(taskForm);
        const taskData = {
            title: formData.get('title'),
            category: formData.get('category'),
            status: formData.get('status'),
            priority: formData.get('priority')
        };

        if (editingTaskId === null) {
            taskData.id = Date.now();
            tasks.push(taskData);
        } else {
            const index = tasks.findIndex(t => t.id === editingTaskId);
            if (index !== -1) {
                tasks[index] = { ...tasks[index], ...taskData };
            }
        }

        saveTasks();
        renderTasks();
        hideTaskForm();
    });

    addTaskBtn.addEventListener('click', showTaskForm);
    cancelTaskBtn.addEventListener('click', hideTaskForm);

    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Initialize tasks table
    renderTasks();

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all section titles and content
    document.querySelectorAll('.section-title, .section > .container > *:not(.section-title)').forEach(el => {
        observer.observe(el);
    });
});
