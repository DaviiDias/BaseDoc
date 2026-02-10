/*==================== SHOW NAVBAR ====================*/
const showMenu = (headerToggle, navbarId) =>{
    const toggleBtn = document.getElementById(headerToggle),
    nav = document.getElementById(navbarId)
    
    // Validate that variables exist
    if(headerToggle && navbarId){
        toggleBtn.addEventListener('click', ()=>{
            // We add the show-menu class to the div tag with the nav__menu class
            nav.classList.toggle('show-menu')
            // change icon
            toggleBtn.classList.toggle('bx-x')
        })
    }
}
showMenu('header-toggle','navbar')

/*==================== LINK ACTIVE ====================*/
const linkColor = document.querySelectorAll('.nav__link')
const navPanel = document.querySelector('.nav__panel')

const panelData = {
    inicio: {
        title: 'Componentes GED',
        sections: [
            {
                items: [
                    { icon: 'bx-grid-alt', label: 'Todos os arquivos', active: true },
                    { icon: 'bx-transfer', label: 'Fluxo de trabalho' },
                    { icon: 'bx-pen', label: 'Assinatura digital' },
                    { icon: 'bx-hdd', label: 'Armazenamento digital' }
                ]
            },
        ]
    },
    perfil: {
        title: 'Perfil',
        sections: [
            {
                items: [
                    { icon: 'bx-id-card', label: 'Dados pessoais', active: true },
                    { icon: 'bx-lock-alt', label: 'Seguranca' },
                    { icon: 'bx-badge-check', label: 'Permissoes' }
                ]
            },
            {
                title: 'Preferencias',
                items: [
                    { icon: 'bx-cog', label: 'Configuracoes' },
                    { icon: 'bx-bell', label: 'Notificacoes' }
                ]
            }
        ]
    },
    pastas: {
        title: 'Pastas',
        sections: [
            {
                items: [
                    { icon: 'bx-folder', label: 'Todas as pastas', active: true },
                    { icon: 'bx-folder-open', label: 'Recentes' },
                    { icon: 'bx-folder-plus', label: 'Criar nova pasta' }
                ]
            }
        ]
    },
    mensagens: {
        title: 'Mensagens',
        sections: [
            {
                items: [
                    { icon: 'bx-chat', label: 'Caixa de entrada', active: true },
                    { icon: 'bx-send', label: 'Enviadas' },
                    { icon: 'bx-archive', label: 'Arquivadas' }
                ]
            }
        ]
    },
    alertas: {
        title: 'Alertas',
        sections: [
            {
                items: [
                    { icon: 'bx-error-alt', label: 'Pendencias', active: true },
                    { icon: 'bx-time-five', label: 'Vencimentos' },
                    { icon: 'bx-check-circle', label: 'Aprovacoes' }
                ]
            }
        ]
    },
    explorar: {
        title: 'Explorar',
        sections: [
            {
                items: [
                    { icon: 'bx-search-alt', label: 'Buscas recentes', active: true },
                    { icon: 'bx-layer', label: 'Colecoes' },
                    { icon: 'bx-folder-open', label: 'Pastas compartilhadas' }
                ]
            }
        ]
    },
    favoritos: {
        title: 'Favoritos',
        sections: [
            {
                items: [
                    { icon: 'bx-star', label: 'Documentos', active: true },
                    { icon: 'bx-pin', label: 'Fixados' },
                    { icon: 'bx-time', label: 'Recentes' }
                ]
            }
        ]
    }
}

function createPanelItem(item) {
    const link = document.createElement('a')
    link.href = '#'
    link.className = 'nav__panel-item'
    if (item.active) {
        link.classList.add('is-active')
    }

    const icon = document.createElement('i')
    icon.className = `bx ${item.icon}`
    const label = document.createElement('span')
    label.textContent = item.label

    link.appendChild(icon)
    link.appendChild(label)
    return link
}

function renderPanel(key) {
    if (!navPanel || !panelData[key]) {
        return
    }

    navPanel.innerHTML = ''

    const header = document.createElement('div')
    header.className = 'nav__panel-header'
    header.textContent = panelData[key].title
    navPanel.appendChild(header)

    panelData[key].sections.forEach((section) => {
        if (section.title) {
            const title = document.createElement('div')
            title.className = 'nav__panel-title'
            title.textContent = section.title
            navPanel.appendChild(title)
        }

        const list = document.createElement('div')
        list.className = 'nav__panel-list'
        section.items.forEach((item) => {
            list.appendChild(createPanelItem(item))
        })
        navPanel.appendChild(list)
    })
}

function colorLink(event){
    const panelKey = this.dataset.panel
    if (panelKey) {
        event.preventDefault()
    }
    linkColor.forEach(l => l.classList.remove('active'))
    this.classList.add('active')
    if (panelKey) {
        renderPanel(panelKey)
    }
}

linkColor.forEach(l => l.addEventListener('click', colorLink))

const initial = document.querySelector('.nav__link.active[data-panel]')
if (initial) {
    renderPanel(initial.dataset.panel)
}
