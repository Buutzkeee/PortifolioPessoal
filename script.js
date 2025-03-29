window.tasks = JSON.parse(localStorage.getItem('tasks')) || [
    { id: 1, title: 'Redesenho da Homepage', category: 'Design', status: 'Concluído', priority: 'Alta' },
    { id: 2, title: 'Implementar Dark Mode', category: 'Desenvolvimento', status: 'Em andamento', priority: 'Média' },
    { id: 3, title: 'Otimizar Performance', category: 'Desenvolvimento', status: 'Pendente', priority: 'Alta' }
];

window.editingTaskId = null;

window.saveTasks = function() {
    localStorage.setItem('tasks', JSON.stringify(window.tasks));
}

window.renderTasks = function() {
    const taskTableBody = document.getElementById('taskTableBody');
    if (!taskTableBody) return;

    taskTableBody.innerHTML = '';
    window.tasks.forEach(task => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${task.title}</td>
            <td>${task.category}</td>
            <td>${task.status}</td>
            <td>${task.priority}</td>
            <td class="task-actions">
                <button class="action-btn edit" onclick="window.editTask(${task.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="action-btn delete" onclick="window.deleteTask(${task.id})">
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

window.showTaskForm = function() {
    const taskForm = document.getElementById('taskForm');
    if (!taskForm) return;
    
    taskForm.classList.remove('hidden');
    if (window.editingTaskId === null) {
        taskForm.reset();
    }
}

window.hideTaskForm = function() {
    const taskForm = document.getElementById('taskForm');
    if (!taskForm) return;
    
    taskForm.classList.add('hidden');
    taskForm.reset();
    window.editingTaskId = null;
    const submitBtn = taskForm.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.textContent = 'Adicionar';
    }
}

window.editTask = function(id) {
    const taskForm = document.getElementById('taskForm');
    if (!taskForm) return;
    
    const task = window.tasks.find(t => t.id === id);
    if (task) {
        window.editingTaskId = id;
        const formInputs = taskForm.elements;
        formInputs.title.value = task.title;
        formInputs.category.value = task.category;
        formInputs.status.value = task.status;
        formInputs.priority.value = task.priority;
        window.showTaskForm();
        const submitBtn = taskForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Atualizar';
        }
    }
}

window.deleteTask = function(id) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        window.tasks = window.tasks.filter(t => t.id !== id);
        window.saveTasks();
        window.renderTasks();
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

    initializeSkills();

    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

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

    const taskForm = document.getElementById('taskForm');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const cancelTaskBtn = document.getElementById('cancelTaskBtn');

    if (taskForm && addTaskBtn && cancelTaskBtn) {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(taskForm);
            const taskData = {
                title: formData.get('title'),
                category: formData.get('category'),
                status: formData.get('status'),
                priority: formData.get('priority')
            };

            if (window.editingTaskId === null) {
                taskData.id = Date.now();
                window.tasks.push(taskData);
            } else {
                const index = window.tasks.findIndex(t => t.id === window.editingTaskId);
                if (index !== -1) {
                    window.tasks[index] = { ...window.tasks[index], ...taskData };
                }
            }

            window.saveTasks();
            window.renderTasks();
            window.hideTaskForm();
        });

        addTaskBtn.addEventListener('click', window.showTaskForm);
        cancelTaskBtn.addEventListener('click', window.hideTaskForm);
    }

    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const targetElement = document.getElementById(targetTab);
            if (targetElement) {
                targetElement.classList.add('active');
            }
        });
    });

    window.renderTasks();

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

    document.querySelectorAll('.section-title, .section > .container > *:not(.section-title)').forEach(el => {
        observer.observe(el);
    });
});

const skills = [
    { 
        name: 'HTML', 
        level: 90, 
        category: 'frontend',
        description: 'Desenvolvimento de estruturas web semânticas e acessíveis, com foco em SEO e boas práticas.'
    },
    { 
        name: 'CSS', 
        level: 85, 
        category: 'frontend',
        description: 'Criação de layouts responsivos, animações e estilização moderna com Flexbox, Grid e preprocessadores.'
    },
    { 
        name: 'JavaScript', 
        level: 80, 
        category: 'frontend',
        description: 'Desenvolvimento de aplicações interativas, manipulação do DOM e integração com APIs.'
    },
    { 
        name: 'React', 
        level: 75, 
        category: 'frontend',
        description: 'Construção de interfaces componentizadas, gerenciamento de estado e roteamento.'
    },

    { 
        name: 'Node.js', 
        level: 70, 
        category: 'backend',
        description: 'Desenvolvimento de APIs RESTful, autenticação e integração com bancos de dados.'
    },
    { 
        name: 'Express', 
        level: 65, 
        category: 'backend',
        description: 'Criação de rotas, middlewares e APIs escaláveis.'
    },
    { 
        name: 'MongoDB', 
        level: 60, 
        category: 'backend',
        description: 'Modelagem de dados, queries e operações CRUD.'
    },

    { 
        name: 'Git', 
        level: 85, 
        category: 'tools',
        description: 'Controle de versão, branches, merges e colaboração em equipe.'
    },
    { 
        name: 'VS Code', 
        level: 90, 
        category: 'tools',
        description: 'Ambiente de desenvolvimento integrado com extensões e personalização.'
    },
    { 
        name: 'Webpack', 
        level: 70, 
        category: 'tools',
        description: 'Bundling, otimização e gerenciamento de assets.'
    },

    { 
        name: 'Clean Code', 
        level: 85, 
        category: 'concepts',
        description: 'Práticas de código limpo, princípios SOLID e padrões de projeto.'
    },
    { 
        name: 'Responsive Design', 
        level: 90, 
        category: 'concepts',
        description: 'Design adaptativo, mobile-first e media queries.'
    },
    { 
        name: 'UI/UX Design', 
        level: 80, 
        category: 'concepts',
        description: 'Princípios de design, usabilidade e experiência do usuário.'
    }
];

function initializeSkills() {
    const skillsGrid = document.querySelector('.skills-grid');
    const skillDetails = document.getElementById('skillDetails');
    const categoryBtns = document.querySelectorAll('.category-btn');
    let currentCategory = 'all';

    function updateSkills(category = 'all') {
        if (!skillsGrid) return;
        
        currentCategory = category;
        skillsGrid.innerHTML = '';

        const filteredSkills = skills.filter(skill => 
            category === 'all' || skill.category === category
        );

        filteredSkills.forEach(skill => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            skillCard.innerHTML = `
                <h3 class="skill-name">${skill.name}</h3>
                <div class="skill-progress">
                    <div class="skill-progress-bar" style="width: ${skill.level}%"></div>
                </div>
                <div class="skill-level">${skill.level}%</div>
            `;

            skillCard.addEventListener('click', () => showSkillDetails(skill));
            skillsGrid.appendChild(skillCard);
        });
    }

    function showSkillDetails(skill) {
        if (!skillDetails) return;

        const title = skillDetails.querySelector('.skill-details-title');
        const description = skillDetails.querySelector('.skill-details-description');
        const closeBtn = skillDetails.querySelector('.close-btn');

        if (title) title.textContent = skill.name;
        if (description) description.textContent = skill.description;

        skillDetails.classList.remove('hidden');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                skillDetails.classList.add('hidden');
            }, { once: true });
        }
    }

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateSkills(btn.dataset.category);
        });
    });

    updateSkills();
}
