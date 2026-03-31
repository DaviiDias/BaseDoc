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

function setupHeaderUserMenu() {
    const profile = document.getElementById('header-profile')
    const trigger = document.getElementById('header-profile-trigger')
    const menu = document.getElementById('header-user-menu')

    if (!profile || !trigger || !menu) {
        return
    }

    function setMenuState(isOpen) {
        profile.classList.toggle('is-open', isOpen)
        trigger.setAttribute('aria-expanded', String(isOpen))
    }

    trigger.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        const shouldOpen = !profile.classList.contains('is-open')
        setMenuState(shouldOpen)
    })

    menu.addEventListener('click', (event) => {
        const disabledItem = event.target.closest('.header__user-item--disabled')
        if (disabledItem) {
            event.preventDefault()
            return
        }

        const clickedItem = event.target.closest('.header__user-item')
        if (clickedItem) {
            setMenuState(false)
        }
    })

    document.addEventListener('click', (event) => {
        if (!profile.contains(event.target)) {
            setMenuState(false)
        }
    })

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setMenuState(false)
        }
    })
}

setupHeaderUserMenu()

const appAlertState = {
    timeoutId: null,
    currentAlert: null
}

function ensureAppAlertLayer() {
    let layer = document.getElementById('app-alert-layer')
    if (layer) {
        return layer
    }

    layer = document.createElement('div')
    layer.id = 'app-alert-layer'
    layer.className = 'app-alert-layer'
    document.body.appendChild(layer)
    return layer
}

function getAppAlertMeta(type) {
    const key = String(type || 'info').toLowerCase()
    switch (key) {
    case 'success':
        return { typeClass: 'app-alert--success', iconClass: 'bx-check-circle', defaultTitle: 'Sucesso' }
    case 'danger':
    case 'error':
        return { typeClass: 'app-alert--danger', iconClass: 'bx-x-circle', defaultTitle: 'Falha' }
    case 'warning':
        return { typeClass: 'app-alert--warning', iconClass: 'bx-error', defaultTitle: 'Atenção' }
    default:
        return { typeClass: 'app-alert--info', iconClass: 'bx-info-circle', defaultTitle: 'Informação' }
    }
}

function dismissAppAlert() {
    if (appAlertState.timeoutId) {
        clearTimeout(appAlertState.timeoutId)
        appAlertState.timeoutId = null
    }

    const activeAlert = appAlertState.currentAlert
    if (!activeAlert) {
        return
    }

    activeAlert.classList.remove('is-visible')
    window.setTimeout(() => {
        if (activeAlert.parentElement) {
            activeAlert.parentElement.removeChild(activeAlert)
        }
    }, 180)

    appAlertState.currentAlert = null
}

function showAppAlert(options = {}) {
    const {
        type = 'info',
        title = '',
        message = '',
        duration = 4500
    } = options

    const safeMessage = String(message || '').trim()
    if (!safeMessage) {
        return
    }

    dismissAppAlert()

    const layer = ensureAppAlertLayer()
    const meta = getAppAlertMeta(type)

    const alertNode = document.createElement('article')
    alertNode.className = `app-alert ${meta.typeClass}`
    alertNode.setAttribute('role', 'alert')
    alertNode.setAttribute('aria-live', 'assertive')

    const header = document.createElement('div')
    header.className = 'app-alert__header'

    const titleWrap = document.createElement('div')
    titleWrap.className = 'app-alert__title-wrap'

    const icon = document.createElement('i')
    icon.className = `bx ${meta.iconClass} app-alert__icon`
    icon.setAttribute('aria-hidden', 'true')

    const heading = document.createElement('h4')
    heading.className = 'app-alert__title'
    heading.textContent = String(title || meta.defaultTitle)

    titleWrap.appendChild(icon)
    titleWrap.appendChild(heading)

    const closeButton = document.createElement('button')
    closeButton.type = 'button'
    closeButton.className = 'app-alert__close'
    closeButton.setAttribute('aria-label', 'Fechar alerta')
    closeButton.textContent = '×'
    closeButton.addEventListener('click', dismissAppAlert)

    header.appendChild(titleWrap)
    header.appendChild(closeButton)

    const body = document.createElement('p')
    body.className = 'app-alert__message'
    body.textContent = safeMessage

    alertNode.appendChild(header)
    alertNode.appendChild(body)

    layer.appendChild(alertNode)
    appAlertState.currentAlert = alertNode

    window.requestAnimationFrame(() => {
        alertNode.classList.add('is-visible')
    })

    if (duration > 0) {
        appAlertState.timeoutId = window.setTimeout(() => {
            dismissAppAlert()
        }, duration)
    }
}

/*==================== LINK ACTIVE ====================*/
const linkColor = document.querySelectorAll('.nav__link')
const navPanel = document.querySelector('.nav__panel')
const mobileNav = document.getElementById('navbar')
const headerToggleButton = document.getElementById('header-toggle')

function closeMobileNavMenu() {
    if (!mobileNav || !headerToggleButton) {
        return
    }

    if (mobileNav.classList.contains('show-menu')) {
        mobileNav.classList.remove('show-menu')
        headerToggleButton.classList.remove('bx-x')
    }
}

const panelData = {
    inicio: {
        title: 'GED • Templates e Documentos',
        sections: [
            {
                items: [
                    { icon: 'bx-grid-alt', label: 'Todos os arquivos', view: 'todos-arquivos', active: true },
                    { icon: 'bx bx-layer', label: 'Dashboard', view: 'dashboard' },
                    { icon: 'bx-transfer', label: 'Documentos pendentes', view: 'fluxo-trabalho' },
                    { icon: 'bx-shape-square', label: 'Templates de Documentos', view: 'fluxo-templates' },
                    { icon: 'bx-hdd', label: 'Armazenamento digital', view: 'armazenamento-digital' }
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
                    { icon: 'bx-pen', label: 'Assinaturas', view: 'assinaturas' },
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
    emails: {
        title: 'E-mails',
        sections: [
            {
                items: [
                    { icon: 'bx-envelope', label: 'Novo E-mail', view: 'novo-email', active: true },
                    { icon: 'bx-archive', label: 'Caixa de entrada' },
                    { icon: 'bx-send', label: 'Enviados' }
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

const mockTodosArquivosData = {
    accessOptions: ['Público', 'Restrito', 'Partilhado'],
    typeOptions: ['Pasta', 'Documento', 'Imagens', 'PDFs', 'Vídeos', 'Arquivos (.zip)', 'Áudio'],
    locationOptions: ['O meu disco', 'Área compartilhada', 'Favoritos', 'Lixeira'],
    modifiedOptions: ['Hoje', 'Últimos 7 dias', 'Últimos 30 dias', 'Personalizado'],
    folders: {
        'root': {
            id: 'root',
            name: 'Todos os arquivos',
            items: [
                {
                    id: 'folder-teste',
                    type: 'folder',
                    name: 'teste',
                    lastModified: 'Atualizado em • 03/02',
                    size: '1,2 GB',
                    itemCount: 3,
                    access: 'Partilhado',
                    location: 'Área compartilhada',
                    fileType: 'Pasta',
                    modifiedDate: new Date('2026-02-03'),
                    isRecent: true,
                    isFavorite: false,
                    isDeleted: false
                },
                {
                    id: 'item-2',
                    type: 'pdf',
                    name: 'Documento Exemplo B.pdf',
                    lastModified: 'Atualizado em • 13/02',
                    size: '2,8 MB',
                    access: 'Restrito',
                    location: 'O meu disco',
                    fileType: 'PDFs',
                    modifiedDate: new Date('2026-02-13'),
                    isRecent: true,
                    isFavorite: true,
                    isDeleted: false
                },
                {
                    id: 'item-3',
                    type: 'doc',
                    name: 'Relatório Exemplo C.doc',
                    lastModified: 'Atualizado em • 20/01',
                    size: '860 KB',
                    access: 'Partilhado',
                    location: 'Favoritos',
                    fileType: 'Documento',
                    modifiedDate: new Date('2026-01-20'),
                    isRecent: false,
                    isFavorite: true,
                    isDeleted: false
                },
                {
                    id: 'item-4',
                    type: 'pdf',
                    name: 'Arquivo Exemplo D.pdf',
                    lastModified: 'Atualizado em • 03/02',
                    size: '1,1 MB',
                    access: 'Partilhado',
                    location: 'Lixeira',
                    fileType: 'PDFs',
                    modifiedDate: new Date('2026-02-03'),
                    isRecent: false,
                    isFavorite: false,
                    isDeleted: false
                }
            ]
        },
        'folder-teste': {
            id: 'folder-teste',
            name: 'teste',
            items: [
                {
                    id: 'folder-teste-teste',
                    type: 'folder',
                    name: 'teste teste',
                    lastModified: 'Atualizado em • 15/02',
                    size: '850 MB',
                    itemCount: 12,
                    access: 'Partilhado',
                    location: 'Área compartilhada',
                    fileType: 'Pasta',
                    modifiedDate: new Date('2026-02-15'),
                    isRecent: true,
                    isFavorite: false,
                    isDeleted: false
                },
                {
                    id: 'file-teste-1',
                    type: 'pdf',
                    name: 'Documento Teste.pdf',
                    lastModified: 'Atualizado em • 10/02',
                    size: '540 KB',
                    access: 'Público',
                    location: 'Área compartilhada',
                    fileType: 'PDFs',
                    modifiedDate: new Date('2026-02-10'),
                    isRecent: true,
                    isFavorite: false,
                    isDeleted: false
                },
                {
                    id: 'file-teste-2',
                    type: 'doc',
                    name: 'Arquivo Teste.doc',
                    lastModified: 'Atualizado em • 08/02',
                    size: '230 KB',
                    access: 'Público',
                    location: 'Área compartilhada',
                    fileType: 'Documento',
                    modifiedDate: new Date('2026-02-08'),
                    isRecent: false,
                    isFavorite: false,
                    isDeleted: false
                },
                {
                    id: 'file-teste-deleted-1',
                    type: 'pdf',
                    name: 'Documento Excluído.pdf',
                    lastModified: 'Excluído em • 05/02',
                    size: '1,2 MB',
                    access: 'Público',
                    location: 'Área compartilhada',
                    fileType: 'PDFs',
                    modifiedDate: new Date('2026-02-05'),
                    isRecent: false,
                    isFavorite: false,
                    isDeleted: true
                },
                {
                    id: 'file-teste-deleted-2',
                    type: 'doc',
                    name: 'Relatório Antigo.doc',
                    lastModified: 'Excluído em • 01/02',
                    size: '450 KB',
                    access: 'Restrito',
                    location: 'Área compartilhada',
                    fileType: 'Documento',
                    modifiedDate: new Date('2026-02-01'),
                    isRecent: false,
                    isFavorite: false,
                    isDeleted: true
                }
            ]
        },
        'folder-teste-teste': {
            id: 'folder-teste-teste',
            name: 'teste teste',
            items: [
                {
                    id: 'file-teste-teste-1',
                    type: 'pdf',
                    name: 'Relatório Final.pdf',
                    lastModified: 'Atualizado em • 18/02',
                    size: '3,2 MB',
                    access: 'Restrito',
                    location: 'Área compartilhada',
                    fileType: 'PDFs',
                    modifiedDate: new Date('2026-02-18'),
                    isRecent: true,
                    isFavorite: true,
                    isDeleted: false
                },
                {
                    id: 'file-teste-teste-2',
                    type: 'doc',
                    name: 'Notas.doc',
                    lastModified: 'Atualizado em • 17/02',
                    size: '120 KB',
                    access: 'Público',
                    location: 'Área compartilhada',
                    fileType: 'Documento',
                    modifiedDate: new Date('2026-02-17'),
                    isRecent: true,
                    isFavorite: false,
                    isDeleted: false
                }
            ]
        }
    }
}

const quickFiltersState = {
    recent: false,
    favorites: false
}

const dateFilterState = {
    mode: '',
    customFrom: null,
    customTo: null
}

const selectedFiles = new Set()

const navigationState = {
    currentFolderId: 'root',
    breadcrumb: [],
    showDeletedFiles: false
}

const fileTypeIcon = {
    folder: 'bxs-folder',
    pdf: 'bxs-file-pdf',
    doc: 'bxs-file-doc',
    default: 'bxs-file'
}

function renderSelectOptions(selectElement, placeholder, options) {
    if (!selectElement) {
        return
    }

    selectElement.innerHTML = ''

    const defaultOption = document.createElement('option')
    defaultOption.value = ''
    defaultOption.textContent = placeholder
    selectElement.appendChild(defaultOption)

    options.forEach((option) => {
        const item = document.createElement('option')
        item.value = option
        item.textContent = option
        selectElement.appendChild(item)
    })
}

function createFileRow(file) {
    const row = document.createElement('div')
    row.className = 'files-list__row'
    row.setAttribute('role', 'row')
    
    // Adiciona classe especial para arquivos excluídos
    if (file.isDeleted) {
        row.classList.add('files-list__row--deleted')
    }
    
    if (file.type === 'folder') {
        row.setAttribute('data-folder-id', file.id)
        row.style.cursor = 'pointer'
    }

    const iconClass = fileTypeIcon[file.type] || fileTypeIcon.default
    const sizeLabel = file.type === 'folder' && file.itemCount
        ? `${file.size} (${file.itemCount} itens)`
        : file.size
    const checkedAttr = selectedFiles.has(file.id) ? 'checked' : ''
    
    // Não mostra checkbox para arquivos excluídos
    const checkboxHtml = file.isDeleted 
        ? '' 
        : `<input type="checkbox" class="files-list__checkbox" data-file-id="${file.id}" ${checkedAttr} aria-label="Selecionar ${file.name}" />`

    row.innerHTML = `
        <span class="files-list__select">
            ${checkboxHtml}
        </span>
        <span class="files-list__name"><i class='bx ${iconClass}'></i> ${file.name}</span>
        <span>${file.lastModified}</span>
        <span>${sizeLabel}</span>
        <span>${file.access}</span>
        <span>${file.location}</span>
    `
    
    // Adiciona click handler para pastas
    if (file.type === 'folder') {
        row.addEventListener('click', (e) => {
            // Não navega se clicou no checkbox
            if (e.target.classList.contains('files-list__checkbox')) {
                return
            }
            navigateToFolder(file.id)
        })
    }

    return row
}

function updateSelectionModeUI() {
    const quickFilters = document.querySelector('.files-quick-filters')
    const bulkActions = document.getElementById('files-bulk-actions')
    const filesList = document.querySelector('.files-list')
    const masterCheckbox = document.getElementById('select-all-files')
    const hasSelection = selectedFiles.size > 0

    if (quickFilters) {
        quickFilters.classList.toggle('is-hidden', hasSelection)
    }

    if (bulkActions) {
        bulkActions.classList.toggle('is-hidden', !hasSelection)
    }

    if (filesList) {
        filesList.classList.toggle('has-selection', hasSelection)
    }

    if (masterCheckbox) {
        // Conta apenas itens não excluídos
        const selectableItems = getCurrentFolderItems().filter(item => !item.isDeleted)
        const allItemsCount = selectableItems.length
        masterCheckbox.checked = hasSelection && selectedFiles.size === allItemsCount
        masterCheckbox.indeterminate = hasSelection && selectedFiles.size < allItemsCount
    }
}

function renderFilesList(items) {
    const filesBody = document.getElementById('files-list-body')
    if (!filesBody) {
        return
    }

    filesBody.innerHTML = ''

    if (!items.length) {
        const emptyRow = document.createElement('div')
        emptyRow.className = 'files-list__row files-list__row--empty'
        emptyRow.setAttribute('role', 'row')
        emptyRow.textContent = 'Nenhum item encontrado com os filtros selecionados.'
        filesBody.appendChild(emptyRow)
        return
    }

    items.forEach((file) => {
        filesBody.appendChild(createFileRow(file))
    })
}

function getCurrentFolderItems() {
    const currentFolder = mockTodosArquivosData.folders[navigationState.currentFolderId]
    if (!currentFolder) return []
    
    // Filtra arquivos excluídos se showDeletedFiles estiver false
    if (navigationState.showDeletedFiles) {
        return currentFolder.items
    } else {
        return currentFolder.items.filter(item => !item.isDeleted)
    }
}

function navigateToFolder(folderId) {
    if (!mockTodosArquivosData.folders[folderId]) {
        console.error('Pasta não encontrada:', folderId)
        return
    }

    const folder = mockTodosArquivosData.folders[folderId]

    // Atualiza o estado de navegação
    if (folderId === 'root') {
        navigationState.currentFolderId = 'root'
        navigationState.breadcrumb = []
    } else {
        navigationState.currentFolderId = folderId
        
        // Reconstrói o breadcrumb baseado no ID da pasta
        navigationState.breadcrumb = []
        
        // Exemplo: se folderId = 'folder-teste-teste', breadcrumb = ['folder-teste', 'folder-teste-teste']
        // Para simplificar, vamos manter uma lista apenas das pastas visitadas
        if (!navigationState.breadcrumb.includes(folderId)) {
            // Limpa o breadcrumb se estamos navegando para uma nova pasta raiz
            if (folderId.split('-').length === 2) { // folder-teste
                navigationState.breadcrumb = [folderId]
            } else if (folderId.includes('folder-teste-teste')) {
                navigationState.breadcrumb = ['folder-teste', 'folder-teste-teste']
            }
        }
    }

    // Limpa seleções
    selectedFiles.clear()
    
    // Reset do estado de arquivos excluídos
    navigationState.showDeletedFiles = false
    
    // Atualiza a view
    updatePageView()
    renderBreadcrumb()
    renderFilesList(getFilteredFiles())
    updateSelectionModeUI()
}

function renderBreadcrumb() {
    const breadcrumbContainer = document.getElementById('breadcrumb-container')
    const folderTitle = document.getElementById('folder-title')
    
    if (!breadcrumbContainer || !folderTitle) return

    const isRoot = navigationState.currentFolderId === 'root'

    if (isRoot) {
        breadcrumbContainer.innerHTML = ''
        folderTitle.textContent = ''
        return
    }

    // Constrói o breadcrumb
    const breadcrumbItems = ['root', ...navigationState.breadcrumb]
    const breadcrumbHTML = breadcrumbItems.map((folderId, index) => {
        const folder = mockTodosArquivosData.folders[folderId]
        const isLast = index === breadcrumbItems.length - 1
        
        if (isLast) {
            return `<span class="breadcrumb__item">${folder.name}</span>`
        } else {
            return `
                <span class="breadcrumb__item">
                    <a href="#" class="breadcrumb__link" data-folder-id="${folderId}">${folder.name}</a>
                    <span class="breadcrumb__separator">/</span>
                </span>
            `
        }
    }).join('')

    breadcrumbContainer.innerHTML = breadcrumbHTML

    // Atualiza o título da pasta
    const currentFolder = mockTodosArquivosData.folders[navigationState.currentFolderId]
    folderTitle.textContent = currentFolder.name

    // Adiciona event listeners aos links do breadcrumb
    breadcrumbContainer.querySelectorAll('.breadcrumb__link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault()
            const folderId = e.target.getAttribute('data-folder-id')
            navigateToFolder(folderId)
        })
    })
    
    // Torna o título editável
    makeEditableTitle()
    
    // Configura o menu de configurações da pasta
    setupFolderSettingsMenu()
}

function makeEditableTitle() {
    const folderTitle = document.getElementById('folder-title')
    if (!folderTitle) return
    
    // Remove event listener anterior se existir
    const newTitle = folderTitle.cloneNode(true)
    folderTitle.parentNode.replaceChild(newTitle, folderTitle)
    
    const titleElement = document.getElementById('folder-title')
    
    titleElement.addEventListener('click', function() {
        if (titleElement.querySelector('input')) return // Já está editando
        
        const currentName = titleElement.textContent
        
        // Cria input para edição
        const input = document.createElement('input')
        input.type = 'text'
        input.value = currentName
        input.className = 'page__folder-title-input'
        
        // Limpa o título e adiciona o input
        titleElement.textContent = ''
        titleElement.appendChild(input)
        
        // Foca no input e seleciona o texto
        input.focus()
        input.select()
        
        // Função para salvar o nome
        function saveName() {
            const newName = input.value.trim()
            
            if (newName && newName !== currentName) {
                // Atualiza o nome nos dados mockados
                const currentFolder = mockTodosArquivosData.folders[navigationState.currentFolderId]
                if (currentFolder) {
                    currentFolder.name = newName
                }
            }
            
            // Restaura o título (com o nome atualizado ou original)
            const folderToDisplay = mockTodosArquivosData.folders[navigationState.currentFolderId]
            titleElement.textContent = folderToDisplay ? folderToDisplay.name : currentName
            
            // Re-renderiza o breadcrumb para atualizar o nome lá também
            renderBreadcrumb()
        }
        
        // Salva ao clicar fora (blur)
        input.addEventListener('blur', saveName)
        
        // Salva ao pressionar Enter
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                input.blur()
            } else if (e.key === 'Escape') {
                titleElement.textContent = currentName
                renderBreadcrumb()
            }
        })
    })
}

function setupFolderSettingsMenu() {
    const settingsBtn = document.getElementById('folder-settings-btn')
    const settingsMenu = document.getElementById('folder-settings-menu')
    const menuTitle = document.getElementById('folder-settings-menu-title')
    
    if (!settingsBtn || !settingsMenu) return
    
    // Atualiza o título do menu com o nome da pasta atual
    const currentFolder = mockTodosArquivosData.folders[navigationState.currentFolderId]
    if (currentFolder && menuTitle) {
        menuTitle.textContent = currentFolder.name
    }
    
    // Remove event listeners anteriores
    const newBtn = settingsBtn.cloneNode(true)
    settingsBtn.parentNode.replaceChild(newBtn, settingsBtn)
    
    const btn = document.getElementById('folder-settings-btn')
    const menu = document.getElementById('folder-settings-menu')
    
    // Toggle menu ao clicar no botão
    btn.addEventListener('click', (e) => {
        e.stopPropagation()
        menu.classList.toggle('is-hidden')
    })
    
    // Fecha o menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
            menu.classList.add('is-hidden')
        }
    })
    
    // Handler para toggle de arquivos excluídos
    const toggleDeletedBtn = document.getElementById('toggle-deleted-files')
    const toggleDeletedText = document.getElementById('toggle-deleted-text')
    const toggleDeletedIcon = toggleDeletedBtn ? toggleDeletedBtn.querySelector('i') : null
    
    // Atualiza o texto e ícone baseado no estado atual
    function updateDeletedFilesToggle() {
        if (!toggleDeletedText || !toggleDeletedIcon) return
        
        if (navigationState.showDeletedFiles) {
            toggleDeletedText.textContent = 'Ocultar arquivos excluídos'
            toggleDeletedIcon.className = 'bx bx-hide'
        } else {
            toggleDeletedText.textContent = 'Mostrar arquivos excluídos'
            toggleDeletedIcon.className = 'bx bx-show'
        }
    }
    
    // Inicializa o estado do toggle
    updateDeletedFilesToggle()
    
    if (toggleDeletedBtn) {
        toggleDeletedBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            
            // Alterna o estado
            navigationState.showDeletedFiles = !navigationState.showDeletedFiles
            
            // Atualiza o texto e ícone
            updateDeletedFilesToggle()
            
            // Re-renderiza a lista de arquivos
            renderFilesList(getFilteredFiles())
            
            // Fecha o menu principal
            menu.classList.add('is-hidden')
        })
    }
    
    // Adiciona ação ao item "Renomear"
    const menuItems = menu.querySelectorAll('.folder-settings-menu__item')
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const text = item.querySelector('span').textContent
            
            if (text === 'Renomear') {
                menu.classList.add('is-hidden')
                const folderTitle = document.getElementById('folder-title')
                if (folderTitle) {
                    folderTitle.click()
                }
            }
            
            // Outras ações podem ser adicionadas aqui
            console.log('Item clicado:', text)
        })
    })
}

function updatePageView() {
    const isRoot = navigationState.currentFolderId === 'root'
    
    const rootToolbar = document.getElementById('root-toolbar')
    const folderNavigation = document.getElementById('folder-navigation')
    const filtersSection = document.querySelector('.filters')
    const quickFilters = document.querySelector('.files-quick-filters')

    if (rootToolbar) {
        rootToolbar.classList.toggle('is-hidden', !isRoot)
    }

    if (folderNavigation) {
        folderNavigation.classList.toggle('is-hidden', isRoot)
    }

    if (filtersSection) {
        filtersSection.classList.toggle('is-hidden', !isRoot)
    }

    if (quickFilters && !selectedFiles.size) {
        quickFilters.classList.toggle('is-hidden', !isRoot)
    }
}

function getFilteredFiles() {
    const searchInput = document.getElementById('files-search')
    const accessFilter = document.getElementById('filter-access')
    const typeFilter = document.getElementById('filter-type')
    const locationFilter = document.getElementById('filter-location')

    const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : ''
    const accessValue = accessFilter ? accessFilter.value : ''
    const typeValue = typeFilter ? typeFilter.value : ''
    const locationValue = locationFilter ? locationFilter.value : ''
    const recentEnabled = quickFiltersState.recent
    const favoritesEnabled = quickFiltersState.favorites

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return getCurrentFolderItems().filter((file) => {
        const matchesSearch = !searchValue || file.name.toLowerCase().includes(searchValue)
        const matchesAccess = !accessValue || file.access === accessValue
        const matchesType = !typeValue || file.fileType === typeValue
        const matchesLocation = !locationValue || file.location === locationValue
        const matchesRecent = !recentEnabled || file.isRecent
        const matchesFavorites = !favoritesEnabled || file.isFavorite

        let matchesDate = true
        if (dateFilterState.mode === 'Hoje') {
            const fileDate = new Date(file.modifiedDate)
            fileDate.setHours(0, 0, 0, 0)
            matchesDate = fileDate.getTime() === today.getTime()
        } else if (dateFilterState.mode === 'Últimos 7 dias') {
            const sevenDaysAgo = new Date(today)
            sevenDaysAgo.setDate(today.getDate() - 7)
            matchesDate = file.modifiedDate >= sevenDaysAgo
        } else if (dateFilterState.mode === 'Últimos 30 dias') {
            const thirtyDaysAgo = new Date(today)
            thirtyDaysAgo.setDate(today.getDate() - 30)
            matchesDate = file.modifiedDate >= thirtyDaysAgo
        } else if (dateFilterState.mode === 'custom' && (dateFilterState.customFrom || dateFilterState.customTo)) {
            if (dateFilterState.customFrom && dateFilterState.customTo) {
                matchesDate = file.modifiedDate >= dateFilterState.customFrom && file.modifiedDate <= dateFilterState.customTo
            } else if (dateFilterState.customFrom) {
                matchesDate = file.modifiedDate >= dateFilterState.customFrom
            } else if (dateFilterState.customTo) {
                matchesDate = file.modifiedDate <= dateFilterState.customTo
            }
        }

        return matchesSearch && matchesAccess && matchesType && matchesLocation && matchesRecent && matchesFavorites && matchesDate
    })
}

function updateQuickFilterButtons() {
    const recentButton = document.getElementById('filter-recent')
    const favoritesButton = document.getElementById('filter-favorites')

    if (recentButton) {
        recentButton.classList.toggle('is-active', quickFiltersState.recent)
        recentButton.setAttribute('aria-pressed', String(quickFiltersState.recent))
    }

    if (favoritesButton) {
        favoritesButton.classList.toggle('is-active', quickFiltersState.favorites)
        favoritesButton.setAttribute('aria-pressed', String(quickFiltersState.favorites))
    }
}

function initTodosArquivosMocks() {
    const searchInput = document.getElementById('files-search')
    const accessFilter = document.getElementById('filter-access')
    const typeFilter = document.getElementById('filter-type')
    const locationFilter = document.getElementById('filter-location')
    const modifiedFilter = document.getElementById('filter-modified')
    const dateRangePicker = document.getElementById('date-range-picker')
    const dateFrom = document.getElementById('date-from')
    const dateTo = document.getElementById('date-to')
    const dateRangeCancel = document.getElementById('date-range-cancel')
    const dateRangeApply = document.getElementById('date-range-apply')
    const recentButton = document.getElementById('filter-recent')
    const favoritesButton = document.getElementById('filter-favorites')
    const filesBody = document.getElementById('files-list-body')

    renderSelectOptions(accessFilter, 'Acesso', mockTodosArquivosData.accessOptions)
    renderSelectOptions(typeFilter, 'Tipo', mockTodosArquivosData.typeOptions)
    renderSelectOptions(locationFilter, 'Local', mockTodosArquivosData.locationOptions)
    renderSelectOptions(modifiedFilter, 'Modificado', mockTodosArquivosData.modifiedOptions)
    
    updatePageView()
    renderFilesList(getFilteredFiles())
    updateQuickFilterButtons()
    updateSelectionModeUI()

    ;[searchInput, accessFilter, typeFilter, locationFilter].forEach((element) => {
        if (!element) {
            return
        }

        element.addEventListener('input', () => {
            renderFilesList(getFilteredFiles())
        })

        element.addEventListener('change', () => {
            renderFilesList(getFilteredFiles())
        })
    })

    if (modifiedFilter) {
        modifiedFilter.addEventListener('change', (event) => {
            const value = event.target.value

            if (value === 'Personalizado') {
                if (dateRangePicker) {
                    dateRangePicker.classList.remove('is-hidden')
                }
            } else {
                if (dateRangePicker) {
                    dateRangePicker.classList.add('is-hidden')
                }
                dateFilterState.mode = value
                dateFilterState.customFrom = null
                dateFilterState.customTo = null
                renderFilesList(getFilteredFiles())
            }
        })
    }

    if (dateRangeCancel) {
        dateRangeCancel.addEventListener('click', () => {
            if (dateRangePicker) {
                dateRangePicker.classList.add('is-hidden')
            }
            if (modifiedFilter) {
                modifiedFilter.value = ''
            }
            if (dateFrom) {
                dateFrom.value = ''
            }
            if (dateTo) {
                dateTo.value = ''
            }
            dateFilterState.mode = ''
            dateFilterState.customFrom = null
            dateFilterState.customTo = null
            renderFilesList(getFilteredFiles())
        })
    }

    if (dateRangeApply) {
        dateRangeApply.addEventListener('click', () => {
            const fromValue = dateFrom ? dateFrom.value : ''
            const toValue = dateTo ? dateTo.value : ''

            dateFilterState.mode = 'custom'
            dateFilterState.customFrom = fromValue ? new Date(fromValue) : null
            dateFilterState.customTo = toValue ? new Date(toValue) : null

            if (dateRangePicker) {
                dateRangePicker.classList.add('is-hidden')
            }

            renderFilesList(getFilteredFiles())
        })
    }

    if (recentButton) {
        recentButton.addEventListener('click', () => {
            quickFiltersState.recent = !quickFiltersState.recent
            updateQuickFilterButtons()
            renderFilesList(getFilteredFiles())
        })
    }

    if (favoritesButton) {
        favoritesButton.addEventListener('click', () => {
            quickFiltersState.favorites = !quickFiltersState.favorites
            updateQuickFilterButtons()
            renderFilesList(getFilteredFiles())
        })
    }

    if (filesBody) {
        filesBody.addEventListener('change', (event) => {
            const checkbox = event.target.closest('.files-list__checkbox')
            if (!checkbox) {
                return
            }

            const fileId = checkbox.dataset.fileId
            if (!fileId) {
                return
            }

            if (checkbox.checked) {
                selectedFiles.add(fileId)
            } else {
                selectedFiles.delete(fileId)
            }

            updateSelectionModeUI()
        })
    }

    const masterCheckbox = document.getElementById('select-all-files')
    if (masterCheckbox) {
        masterCheckbox.addEventListener('change', (event) => {
            const isChecked = event.target.checked
            const currentItems = getCurrentFolderItems()

            if (isChecked) {
                // Seleciona apenas itens não excluídos
                currentItems.forEach((file) => {
                    if (!file.isDeleted) {
                        selectedFiles.add(file.id)
                    }
                })
            } else {
                selectedFiles.clear()
            }

            // Atualiza os checkboxes individuais visualmente
            const allCheckboxes = document.querySelectorAll('.files-list__checkbox[data-file-id]')
            allCheckboxes.forEach((checkbox) => {
                const fileId = checkbox.dataset.fileId
                checkbox.checked = selectedFiles.has(fileId)
            })

            updateSelectionModeUI()
        })
    }
}

function createPanelItem(item) {
    const link = document.createElement('a')
    link.href = '#'
    link.className = 'nav__panel-item'
    if (item.view) {
        link.dataset.view = item.view
    }
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

function showPage(viewKey) {
    const pages = document.querySelectorAll('.page')
    if (!pages.length) {
        return
    }

    pages.forEach((page) => {
        page.classList.toggle('is-active', page.dataset.view === viewKey)
    })

    // Carregar assinatura padrão quando abrir página de novo email
    if (viewKey === 'novo-email') {
        setTimeout(() => {
            const defaultSig = getDefaultSignature()
            if (defaultSig && document.getElementById('email-content')) {
                // Adiciona a assinatura ao rodapé do email
                const signatureDiv = `
                    <br><br>
                    <div style="border-top: 1px solid #ddd; padding-top: 1rem; margin-top: 1rem; font-size: 0.9rem; color: #666;">
                        <strong>${defaultSig.fullName}</strong><br>
                        ${defaultSig.jobTitle}<br>
                        ${defaultSig.department}<br>
                        <a href="mailto:${defaultSig.email}" style="color: #2563EB; text-decoration: none;">${defaultSig.email}</a><br>
                        ${defaultSig.phone}
                    </div>
                `
                const editor = document.getElementById('email-content')
                editor.innerHTML = signatureDiv
            }
        }, 100)
    }

    if (viewKey === 'fluxo-templates') {
        setWorkflowMode('template')
    } else if (viewKey === 'fluxo-trabalho') {
        setWorkflowMode('document')
    }
}

function selectPanelItem(viewKey) {
    const panelItems = document.querySelectorAll('.nav__panel-item')
    panelItems.forEach((item) => {
        if (item.dataset.view === viewKey) {
            item.classList.add('is-active')
        } else {
            item.classList.remove('is-active')
        }
    })
    showPage(viewKey)
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

if (navPanel) {
    navPanel.addEventListener('click', (event) => {
        const panelItem = event.target.closest('.nav__panel-item')
        if (!panelItem) {
            return
        }

        event.preventDefault()
        navPanel.querySelectorAll('.nav__panel-item').forEach((item) => item.classList.remove('is-active'))
        panelItem.classList.add('is-active')

        const viewKey = panelItem.dataset.view
        if (viewKey) {
            showPage(viewKey)
            closeMobileNavMenu()
        }
    })
}

const initial = document.querySelector('.nav__link.active[data-panel]')
if (initial) {
    renderPanel(initial.dataset.panel)
    showPage('todos-arquivos')
}

initTodosArquivosMocks()

/*==================== DASHBOARD MODAL FLUXO ====================*/
function setupDashboardModal() {
    const workflowModal = document.getElementById('workflow-modal')
    const workflowModalClose = document.getElementById('workflow-modal-close')
    const workflowModalCancel = document.getElementById('workflow-modal-cancel')
    const viewWorkflowButtons = document.querySelectorAll('.dashboard__view-workflow-btn')

    if (!workflowModal) return

    // Fecha a modal
    function closeWorkflowModal() {
        workflowModal.classList.add('is-hidden')
    }

    // Abre a modal
    function openWorkflowModal(docId) {
        workflowModal.classList.remove('is-hidden')
        // Aqui você poderia carregar dados específicos do documento se necessário
        // Por enquanto está com dados mockados
    }

    // Adiciona listeners aos botões "Visualizar Fluxo"
    viewWorkflowButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault()
            openWorkflowModal(btn.closest('.dashboard__document-item').dataset.docId)
        })
    })

    // Fecha ao clicar no botão de fechar
    if (workflowModalClose) {
        workflowModalClose.addEventListener('click', closeWorkflowModal)
    }

    // Fecha ao clicar em "Fechar"
    if (workflowModalCancel) {
        workflowModalCancel.addEventListener('click', closeWorkflowModal)
    }

    // Fecha ao clicar fora da modal
    workflowModal.addEventListener('click', (e) => {
        if (e.target === workflowModal) {
            closeWorkflowModal()
        }
    })

    // Fecha ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !workflowModal.classList.contains('is-hidden')) {
            closeWorkflowModal()
        }
    })
}

/*==================== DASHBOARD KPI CARDS ====================*/
function setupDashboardKPICards() {
    const pendingCard = document.querySelector('.dashboard__kpi-card--pending .dashboard__kpi-action')
    const expiredCard = document.querySelector('.dashboard__kpi-card--expired .dashboard__kpi-action')
    const expiringCard = document.querySelector('.dashboard__kpi-card--expiring .dashboard__kpi-action')
    
    const pendingValue = document.querySelector('.dashboard__kpi-card--pending .dashboard__kpi-value')
    const expiredValue = document.querySelector('.dashboard__kpi-card--expired .dashboard__kpi-value')
    const expiringValue = document.querySelector('.dashboard__kpi-card--expiring .dashboard__kpi-value')

    // Card Documentos Pendentes
    if (pendingCard && pendingValue) {
        const count = parseInt(pendingValue.textContent) || 0
        if (count > 0) {
            pendingCard.addEventListener('click', (e) => {
                e.preventDefault()
                // Redireciona para a página de documentos pendentes
                selectPanelItem('fluxo-trabalho')
                // Scroll para o topo
                window.scrollTo(0, 0)
            })
        } else {
            pendingCard.addEventListener('click', (e) => {
                e.preventDefault()
                showAppAlert({
                    type: 'info',
                    title: 'Documentos Pendentes',
                    message: 'Não há documentos pendentes para serem preenchidos no momento.',
                    duration: 4000
                })
            })
        }
    }

    // Card Documentos Vencidos
    if (expiredCard && expiredValue) {
        const count = parseInt(expiredValue.textContent) || 0
        if (count === 0) {
            expiredCard.addEventListener('click', (e) => {
                e.preventDefault()
                showAppAlert({
                    type: 'info',
                    title: 'Documentos Vencidos',
                    message: 'Não há documentos vencidos no momento.',
                    duration: 4000
                })
            })
        } else {
            expiredCard.addEventListener('click', (e) => {
                e.preventDefault()
                showAppAlert({
                    type: 'warning',
                    title: 'Documentos Vencidos',
                    message: `Você tem ${count} documento(s) com vigência expirada. Revise-os com urgência.`,
                    duration: 4000
                })
            })
        }
    }

    // Card Documentos a Vencer
    if (expiringCard && expiringValue) {
        const count = parseInt(expiringValue.textContent) || 0
        if (count === 0) {
            expiringCard.addEventListener('click', (e) => {
                e.preventDefault()
                showAppAlert({
                    type: 'info',
                    title: 'Documentos a Vencer',
                    message: 'Não há documentos para vencer nos próximos 30 dias.',
                    duration: 4000
                })
            })
        } else {
            expiringCard.addEventListener('click', (e) => {
                e.preventDefault()
                showAppAlert({
                    type: 'warning',
                    title: 'Documentos a Vencer',
                    message: `Você tem ${count} documento(s) vencendo nos próximos 30 dias. Fique atento às datas.`,
                    duration: 4000
                })
            })
        }
    }
}

/*==================== DASHBOARD VER TODOS OS DOCUMENTOS ====================*/
function setupDashboardViewAll() {
    const viewAllLinks = document.querySelectorAll('.dashboard__section-link')

    viewAllLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault()
            // Se for o link de "Ver todos os documentos" na seção de documentos aguardando
            const section = link.closest('.dashboard__section')
            if (section && section.querySelector('.dashboard__documents-list')) {
                showAppAlert({
                    type: 'info',
                    title: 'Documentos Aguardando Terceiros',
                    message: 'Exibindo todos os documentos que estão aguardando terceiros.',
                    duration: 3000
                })
                // Você pode expandir a seção ou abrir uma página de detalhes aqui
            }
        })
    })
}

setupDashboardModal()
setupDashboardKPICards()
setupDashboardViewAll()

/*==================== MODAL NOVA PASTA ====================*/
function setupNewFolderModal() {
    const modal = document.getElementById('new-folder-modal')
    const modalInput = document.getElementById('new-folder-input')
    const btnNavigation = document.getElementById('new-folder-btn-nav')
    const btnRoot = document.getElementById('new-folder-btn-root')
    const btnCancel = document.getElementById('cancel-folder-btn')
    const btnCreate = document.getElementById('create-folder-btn')

    if (!modal || !modalInput) return

    // Abre o modal
    function openModal() {
        modal.classList.remove('is-hidden')
        modalInput.value = ''
        modalInput.focus()
    }

    // Fecha o modal
    function closeModal() {
        modal.classList.add('is-hidden')
        modalInput.value = ''
    }

    // Cria a nova pasta
    function createFolder() {
        const folderName = modalInput.value.trim() || 'Pasta sem nome'
        const currentFolderId = navigationState.currentFolderId
        const currentFolder = mockTodosArquivosData.folders[currentFolderId]

        if (!currentFolder) return

        // Gera um ID único para a nova pasta
        const newFolderId = 'folder-' + Date.now()
        
        // Cria o objeto da nova pasta
        const newFolder = {
            id: newFolderId,
            type: 'folder',
            name: folderName,
            lastModified: 'Criado em • ' + new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            size: '0 KB',
            itemCount: 0,
            access: 'Público',
            location: currentFolderId === 'root' ? 'O meu disco' : 'Área compartilhada',
            fileType: 'Pasta',
            modifiedDate: new Date(),
            isRecent: true,
            isFavorite: false,
            isDeleted: false
        }

        // Adiciona a nova pasta à lista de itens da pasta atual
        currentFolder.items.unshift(newFolder)

        // Cria uma entrada vazia para a nova pasta no objeto folders
        mockTodosArquivosData.folders[newFolderId] = {
            id: newFolderId,
            name: folderName,
            items: []
        }

        // Atualiza a lista de arquivos
        renderFilesList(getCurrentFolderItems())
        
        // Fecha o modal
        closeModal()
    }

    // Event listeners para os botões
    if (btnNavigation) {
        btnNavigation.addEventListener('click', openModal)
    }

    if (btnRoot) {
        btnRoot.addEventListener('click', openModal)
    }

    if (btnCancel) {
        btnCancel.addEventListener('click', closeModal)
    }

    if (btnCreate) {
        btnCreate.addEventListener('click', createFolder)
    }

    // Fecha o modal ao clicar fora dele
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal()
        }
    })

    // Cria a pasta ao pressionar Enter
    modalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            createFolder()
        } else if (e.key === 'Escape') {
            closeModal()
        }
    })
}

setupNewFolderModal()

/*==================== FLUXO DE TRABALHO ====================*/
const workflowDefaultFlow = [
    { id: 1, nome: 'Solicitação / Início' },
    { id: 2, nome: 'Elaboração / Edição' },
    { id: 3, nome: 'Revisão Técnica / Validação' },
    { id: 4, nome: 'Revisão Jurídica' },
    { id: 5, nome: 'Aprovação Orçamentária' },
    { id: 6, nome: 'Aprovação Gerencial' },
    { id: 7, nome: 'Negociação / Ajustes' },
    { id: 8, nome: 'Assinatura Digital' },
    { id: 9, nome: 'Execução / Publicação' }
]

const workflowModels = {
    'prestacao-servicos': { skip: [] },
    franquia: { skip: [], extra: [{ pos: 2.1, nome: 'Due Diligence + COF' }] },
    nda: { skip: [3, 5, 7] },
    collab: { skip: [5] },
    comodato: { skip: [7] },
    'dist-internacional': { skip: [], extra: [{ pos: 2.1, nome: 'Due Diligence Internacional' }] },
    empreitada: { skip: [] },
    fornecimento: { skip: [7] },
    'franquia-internacional': { skip: [], extra: [{ pos: 2.1, nome: 'Due Diligence Internacional' }] },
    aditamento: { skip: [1, 3, 7] },
    'compra-venda-equip': { skip: [] },
    'locacao-equip': { skip: [] },
    'locacao-imovel': { skip: [], extra: [{ pos: 2.1, nome: 'Vistoria' }] },
    distrato: { skip: [1, 2, 3, 5, 7] },
    rescisao: { skip: [1, 2, 3, 5, 7] },
    'representacao-comercial': { skip: [] },
    transporte: { skip: [4, 5] },
    cessao: { skip: [3, 5, 7] },
    influencers: { skip: [5] }
}

const workflowModelFieldCatalog = {
    'prestacao-servicos': {
        displayName: 'Prestação de Serviços',
        volume: 581,
        fields: [
            'Cargo - Contratada', 'Cargo - Contratante', 'Cláusula de rescisão imotivada', 'CNPJ da Contratada', 'Data Início da Vigência',
            'Data Término da Vigência', 'Departamento - Contratada', 'Departamento - Contratante', 'Descrever a forma de pagamento', 'E-mail - Contratada',
            'E-mail - Contratante', 'Endereço - Contratada', 'Endereço - Contratante', 'Endereço da Contratada', 'Fax - Contratada',
            'Fax - Contratante', 'Multa Carta de Ética e Manual Anticorrupção', 'Multa no caso de atraso na entrega dos serviços', 'Multa no caso de descumprimento contratual',
            'Multa Política de Div de Ato ou Fato Relevante', 'Nome da Contratada', 'Nome do contato - Contratada', 'Nome do contato - Contratante',
            'Opções de Revisão da Minuta', 'Quantidade de parcelas do pagamento', 'Telefone - Contratada', 'Telefone - Contratante', 'Tipo de Serviços Contratados',
            'Tipo de Vigência', 'Valor Multa Diária: Obrigações Contratadas', 'Valor Multa: Obrigações Contratadas', 'Valor total a ser pago neste contrato'
        ]
    },
    franquia: {
        displayName: 'Franquia',
        volume: 337,
        fields: [
            'CNPJ Franqueado', 'CPF do Sócio Fiador 1', 'CPF do Sócio Fiador 2', 'CPF do Sócio Franqueado', 'CPF do Sócio Operador',
            'Data de recebimento e leitura da COF', 'Data do Início do Contrato Anterior', 'Data do Término do Contrato Anterior', 'Data Vigência Início', 'Data Vigência Término',
            'Descrição do raio', 'Endereço do Sócio Fiador 1', 'Endereço do Sócio Fiador 2', 'Endereço do Sócio Franqueado', 'Endereço do Sócio Operador',
            'Endereço Franqueado', 'Endereço Operação', 'Estado Civil do Sócio Fiador 1', 'Estado Civil do Sócio Fiador 2', 'Estado Civil do Sócio Franqueado',
            'Estado Civil do Sócio Operador', 'Inicio das atividades em até (em dias)', 'Lista de Produtos', 'Nacionalidade do Sócio Fiador 1', 'Nacionalidade do Sócio Fiador 2',
            'Nacionalidade do Sócio Franqueado', 'Nacionalidade do Sócio Operador', 'Nome Completo do Sócio Fiador 1', 'Nome Completo do Sócio Fiador 2',
            'Nome Completo do Sócio Franqueado', 'Nome Completo do Sócio Operador', 'Nome Operação', 'Opções de Revisão da Minuta', 'Pago em',
            'Profissão do Sócio Fiador 1', 'Profissão do Sócio Fiador 2', 'Profissão do Sócio Franqueado', 'Profissão do Sócio Operador', 'Razao Social Franqueado',
            'RG do Sócio Fiador 1', 'RG do Sócio Fiador 2', 'RG do Sócio Franqueado', 'RG do Sócio Operador', 'Taxa Inicial Franquia', 'Tipo de Contrato'
        ]
    },
    nda: {
        displayName: 'Acordo de Confidencialidade',
        volume: 653,
        fields: ['Cidade da Contratada', 'CNPJ', 'Endereço da Contratada', 'Estado da Contratada (Sigla)', 'Nome da Contratada', 'Nome Projeto', 'Opções de Revisão da Minuta', 'Selecione o Tipo de Documento']
    },
    collab: {
        displayName: 'Collab',
        volume: 8,
        fields: [
            'Agreement Date', 'Cidade - OtherSide', 'Company Description', 'CompanyType', 'Date as of the date of this Agreement', 'Date of official images',
            'Deseja exibir o item 1.14 (Term)?', 'Endereço - Other Side', 'Estado Sigla - OtherSide', 'Haverá Subsidiária?', 'Nome da Marca do Parceiro',
            'Opções de Revisão da Minuta', 'Other Side (Razão Social)', 'Penalty for Code of Conduct and Ethics', 'Porcentagem Royalties', 'Referred to as:'
        ]
    },
    comodato: {
        displayName: 'Comodato',
        volume: 18,
        fields: [
            'Cidade da Comodante', 'CNPJ da Comodante', 'Data de Utilização', 'Descrição dos equipamentos', 'Disponibilidade dos Equipamentos (em dias)',
            'Endereco da Comodante', 'Endereco de Entrega', 'Estado da Comodante (Sigla)', 'Finalidade dos Equipamentos', 'Início da Data de Vigência',
            'Multa da Carta de Ética e Manual Anticorrupção', 'Multa da Política de Div de Ato ou Fato Relevante', 'Nome da Comodante', 'Opções de Revisão da Minuta',
            'Quantidade de Equipamentos', 'Selecione o Tipo de Comodato', 'Término da Data de Vigência'
        ]
    },
    'dist-internacional': {
        displayName: 'Distribuição Internacional',
        volume: 30,
        fields: [
            'Atenção da Distribuidora', 'Data da Celebração', 'Data de Expiração', 'Definição de Território', 'Deseja incluir a Cláusula de Buy-out?',
            'Endereço completo da Distribuidora', 'Este Distribuidor possui lojas?', 'Existe contrato de distribuição anterior?', 'Multa por quebra de provisões',
            'Nacionalidade da Distribuidora', 'Nome do Distribuidor', 'O desenvolvimento de produtos especiais se aplica?', 'Opções de Revisão da Minuta', 'Prazo em anos',
            'Qual contrato será trabalhado?', 'Telefone Distribuidora', 'Tipo da Distribuidora'
        ]
    },
    empreitada: {
        displayName: 'Empreitada',
        volume: 16,
        fields: [
            'Atividades da Contratada', 'Cargo da Contratante', 'Cidade da Contratada', 'CNPJ da Contratada', 'Comunicação - Cargo', 'Comunicação - Departamento',
            'Comunicação - Email', 'Comunicação - Endereço', 'Comunicação - Nome', 'Comunicação - Telefone', 'Construção Contratante', 'Data do início da Vigência',
            'Data do término da Vigência', 'Departamento da Contrante', 'Deseja incluir política de SSMAC 009/00?', 'Deve contemplar o recolhimento de 11%?',
            'Email da Contratante', 'Endereço da Contratada', 'Endereço da Contratante', 'Estado da Contratada', 'Fins da Contratante', 'Forma Pagamento Valor',
            'Funcionamento da Contratante', 'Multa Carta de Ética e Manual Anticorrupção', 'Multa para recisão por motivo de atraso na obra', 'Nome da Contratante',
            'Objeto Data Proposta', 'Obrigatoriedade de abertura de matrícula CEI?', 'Opções de Revisão da Minuta', 'Programa Brasil Maior?', 'Razao Social da Contratada',
            'Regime da Contratante', 'Seguros de Risco de Engenharia e de Resp Civil?', 'Telefone da Contratante', 'Titular Marca', 'Valor da Indenização (Multa) - Numeral',
            'Valor Danos Materiais/Corporais', 'Valor Danos Morais', 'Valor Total Obra'
        ]
    },
    fornecimento: {
        displayName: 'Fornecimento',
        volume: 88,
        fields: [
            'Cargo Fornecedor', 'CNPJ da Contratada', 'Departamento Fornecedor', 'Dias de Indenização de Vigência e Rescisão', 'Email do Contato Fornecedor',
            'Endereço da Contratada', 'Endereço das Plantas da Alpargatas', 'Endereço do Contato Fornecedor', 'Fax do Contato Fornecedor', 'Início da Data de Vigência',
            'Nome do Contato Fornecedor', 'Opções de Revisão da Minuta', 'Outras Disposições Valor', 'Possui Condiçoes Comercias de Aviamento?',
            'Possui Fornecedor Terceiro Homologado?', 'Possui Matéria Prima Exclusiva?', 'Possui Substância Restritiva de Sustentabilidade?',
            'Possui Tipo de Foro de Arbitragem?', 'Prazo de Condições Comercias', 'Prazo Nota Fiscal', 'Quantidade de Dias Antecedência',
            'Razão Social Contratada', 'Telefone do Contato Fornecedor', 'Tipo de Fornecimento', 'Tipo de Produção',
            'Valor da Indenização de Vigência de Rescisão (%)', 'Valor da Multa de Exclusividade (%)', 'Valor da Multa de Quantidade Prazo Entrega (%)',
            'Valor Multa de Quantidade Prazo Entrega Diário (%)', 'Valor Multa Propriedade Intelectual (%)'
        ]
    },
    'franquia-internacional': {
        displayName: 'Franquia Internacional',
        volume: 1,
        fields: [
            'Agreement Day Creation', 'Cidade da Contratada', 'Compact Store', 'Distribuition Agreement', 'Email Franqueado', 'Endereço da Contratada',
            'Estado da Contratada', 'Fax Franqueado', 'Financial Guarantee', 'Financial Guarantee Value', 'Kiosk', 'Opções de Revisão da Minuta',
            'País da Contratada', 'Pop_up Structure', 'Razão Social da Contratada', 'Representante Franqueador', 'Store Adress', 'Telefone Franqueador',
            'Tipo de Contrato', 'Valor da Multa de Outras Disposições', 'Valor Multa de Confidencialidade'
        ]
    },
    aditamento: {
        displayName: 'Aditamento',
        volume: 715,
        fields: [
            'Cidade da Contratada', 'Cidade da Franqueada', 'CNPJ da Contratada', 'Com qual Aditamento pretende trabalhar?', 'CPF da Contratada',
            'Data da Celebração', 'Data da Vigência', 'Endereço da Contratada', 'Endereço do Franqueado', 'Estado Civil da Contratada', 'Loja / Franqueado',
            'Nacionalidade da Contratada', 'Nome Completo da Contratada', 'Nome do Contrato', 'Número Aditamento Contrato', 'Opções de Revisão da Minuta',
            'Profissão da Contratada', 'Razão Social da Contratada', 'RG da Contratada', 'Sede/Filial da Contratada', 'Tipo de Vigência',
            'UF da Contratada - Sigla', 'UF da Franqueada - Sigla'
        ]
    },
    'compra-venda-equip': {
        displayName: 'Compra e Venda de Equipamento',
        volume: 26,
        fields: [
            'Cargo da Compradora', 'Cargo da Vendedora', 'Cidade da Vendedora', 'CNPJ da Vendedora', 'Contato da Compradora', 'Data de Entrega', 'Data de Início',
            'Data de Término', 'Data de Venda', 'Departamento da Compradora', 'Departamento da Vendedora', 'Descricao Pagamento', 'Duracao do Serviço (Número)',
            'Email da Compradora', 'Email da Vendedora', 'Endereço da Compradora', 'Endereco da Vendedora', 'Endereço da Vendedora', 'Endereco de Entrega',
            'Estado da Vendedora (Sigla)', 'Nome da Compradora', 'Nome da Vendedora', 'Opções de Revisão da Minuta', 'Periodo de Garantia (Número)',
            'Porcentagem Limite Multa (Número)', 'Porcentagem Multas (Número)', 'Prazo do Contrato (Número)', 'Razao Social da Vendedora',
            'Telefone da Compradora', 'Telefone da Vendedora', 'Tipo de Comercialização', 'Valor da Multa Disposições Finais', 'Valor Preço de Pagamento'
        ]
    },
    'locacao-equip': {
        displayName: 'Locação de Equipamento',
        volume: 217,
        fields: [
            'Cargo da Locadora', 'Cargo da Locatária', 'Cidade da Locadora', 'CNPJ da Locadora', 'Data de Início', 'Data de Locação', 'Data de Término',
            'Departamento da Locadora', 'Departamento da Locatária', 'Descrição dos Equipamentos Locados', 'Descricao Pagamento', 'Email da Locadora',
            'Email da Locatária', 'Endereco da Locadora', 'Endereço da Locadora', 'Endereço da Locatária', 'Estado da Locadora (Sigla)',
            'Inserir política de SSMAC 009/00?', 'Nome da Locadora', 'Nome da Locatária', 'Opções de Revisão da Minuta', 'Razao Social da Locadora',
            'Telefone da Locadora', 'Telefone da Locatária', 'Tipo de Locação', 'Valor da Multa (Número)', 'Valor da Multa Disposições Finais (Número)',
            'Valor Mensal por Unidade (Caso de Prorrogação)', 'Valor Preço de Pagamento'
        ]
    },
    'locacao-imovel': {
        displayName: 'Locação de Imóvel',
        volume: 0,
        fields: [
            'Agência', 'Banco', 'Conta Corrente', 'CPF/CNPJ do Locador', 'Data Base para o Reajuste', 'Data do Fim da Locação', 'Data do Inicio da Locação',
            'E-mail do Locatário', 'Email do Locador', 'Endereço para Pagamento', 'Estado Civil do Locador', 'Matrícula do Imóvel', 'Nacionalidade do Locador',
            'Nome do Locador', 'Nome do Locatário', 'Nome Fantasia da Loja', 'Número do Cartório', 'Opções de Revisão da Minuta',
            'Prazo Locação Meses (Numeral)', 'Profissão do Locador', 'RG do Locador', 'Valor Mensal do Aluguel (Numeral)'
        ]
    },
    distrato: {
        displayName: 'Distrato',
        volume: 112,
        fields: ['CNPJ da Contratada', 'Data da Celebração', 'Data da Validade do Distrato', 'Endereço da Contratada', 'Inicio da Vigência', 'Nome do Contrato', 'Obrigação da Contratada', 'Opções de Revisão da Minuta', 'Razão Social da Contratada', 'Término Vigência', 'Termo de Cláusulas']
    },
    rescisao: {
        displayName: 'Termo de Rescisão',
        volume: 53,
        fields: ['CNPJ Contratada', 'Contrato Firmado', 'Data Contrato Firmado', 'Data de Inicio do Prazo', 'Data do Fim da Locação', 'Endereço da Contratada', 'Objeto', 'Opções de Revisão da Minuta', 'Outras Considerações', 'Prazo Duração em Anos', 'Prazo Duração em Meses', 'Razão Social da Contratada', 'Termo de Cláusulas', 'Tipo de Contrato']
    },
    'representacao-comercial': {
        displayName: 'Representação Comercial',
        volume: 7,
        fields: ['CNPJ do Representante', 'Endereço do Representante', 'Opções de Revisão da Minuta', 'Razão Social do Representante']
    },
    transporte: {
        displayName: 'Transporte',
        volume: 7,
        fields: [
            'Cargo da Compradora', 'Cargo da Vendedora', 'CNPJ da Contratada', 'Departamento da Compradora', 'Departamento da Vendedora', 'Email da Compradora',
            'Email da Vendedora', 'Endereço da Compradora', 'Endereço da Contratada', 'Endereço da Vendedora', 'Nível de Serviços - Numeral', 'Nome da Compradora',
            'Nome da Vendedora', 'Opções de Revisão da Minuta', 'Prazo Frete (Número)', 'Prazo Rescisão (Número)', 'Razão Social da Contratada',
            'Telefone da Compradora', 'Telefone da Vendedora', 'Valor Multa Disposições Finais - Numeral'
        ]
    },
    cessao: {
        displayName: 'Cessão',
        volume: 78,
        fields: [
            'CNPJ da Cedente', 'CPF/MF Sócio Cedente', 'CPF/MF Sócio Cessionária', 'CPNJ Cessionária', 'Data de Assinatura - Carta Fiança',
            'Data Formalização com a Cedente', 'Endereço Completo Cedente', 'Endereço Completo Cessionária', 'Endereço Completo da Cessionária',
            'Endereço Completo da Loja Havaianas', 'Endereço da Cedente', 'Estado Civil Cedente', 'Estado Civil Cessionária', 'Nacionalidade Cedente',
            'Nacionalidade Cessionária', 'Nome Completo Cedente', 'Nome Completo Cessionária', 'Opções de Revisão da Minuta', 'Profissão Cedente',
            'Profissão Cessionária', 'Razão Social da Cedente', 'Razão Social da Cessionária', 'RG Sócio Cedente', 'RG Sócio Cessionária',
            'Tipo de Contrato de Cessão', 'Tipo de Unidade', 'Tipo de Unidade da Cessionária', 'Valor dívida com a INTERVENIENTE'
        ]
    },
    influencers: {
        displayName: 'Influencers',
        volume: 12,
        fields: [
            'Descrição completa dos entregáveis', 'Descrição da campanha ou projeto', 'Descrição da forma de pagamento', 'Endereço do Influenciador',
            'Lista das redes sociais contempladas', 'Multa a ser aplicada caso as partes descumpram', 'Multa caso descumpra a Carta de Ética',
            'Opções de Revisão da Minuta', 'Período em que o conteúdo será utilizado', 'Prazo de vigência do Contrato',
            'Razão Social ou Nome do Influenciador', 'Território em que a Alpargatas irá usar o conteúdo', 'Tipo de pessoa', 'Valor total a ser pago ao influenciador'
        ]
    }
}

const workflowClauseCatalog = [
    {
        id: 'partes',
        title: 'Qualificação das partes',
        requiresForm: true,
        fields: [
            { name: 'contratante', label: 'Contratante', type: 'text', placeholder: 'Empresa contratante' },
            { name: 'contratada', label: 'Contratada', type: 'text', placeholder: 'Empresa contratada' },
            { name: 'representante', label: 'Representante legal', type: 'text', placeholder: 'Nome completo' }
        ]
    },
    {
        id: 'objeto-servico',
        title: 'Objeto do contrato / tipo de serviço',
        requiresForm: true,
        fields: [
            { name: 'tipoServico', label: 'Tipo de serviço', type: 'text', placeholder: 'Ex: Consultoria técnica' },
            { name: 'descricao', label: 'Descrição resumida', type: 'textarea', placeholder: 'Escopo principal do serviço' }
        ]
    },
    {
        id: 'enderecos',
        title: 'Endereços e dados de contato',
        requiresForm: true,
        fields: [
            { name: 'enderecoContratante', label: 'Endereço contratante', type: 'text', placeholder: 'Rua, número, cidade' },
            { name: 'enderecoContratada', label: 'Endereço contratada', type: 'text', placeholder: 'Rua, número, cidade' }
        ]
    },
    {
        id: 'vigencia',
        title: 'Prazo de vigência e renovação',
        requiresForm: true,
        fields: [
            { name: 'inicio', label: 'Início da vigência', type: 'date' },
            { name: 'fim', label: 'Fim da vigência', type: 'date' },
            { name: 'renovacao', label: 'Renovação automática', type: 'select', options: ['Sim', 'Não'] }
        ]
    },
    {
        id: 'confidencialidade',
        title: 'Confidencialidade e sigilo',
        requiresForm: false,
        fields: []
    },
    {
        id: 'assinatura',
        title: 'Assinatura digital',
        requiresForm: false,
        fields: []
    }
]

const workflowModelDefaultClauses = {
    'prestacao-servicos': ['partes', 'objeto-servico', 'enderecos', 'vigencia', 'confidencialidade', 'assinatura'],
    nda: ['partes', 'confidencialidade', 'assinatura'],
    franquia: ['partes', 'objeto-servico', 'enderecos', 'vigencia', 'confidencialidade', 'assinatura'],
    'locacao-imovel': ['partes', 'enderecos', 'vigencia', 'assinatura']
}

const workflowMockSeed = {
    documentsByModel: {
        'prestacao-servicos': [
            {
                id: 'doc-mock-ps-001',
                nome: 'Contrato Prestação • ACME',
                currentStep: 2,
                updatedAt: '2026-02-21T10:00:00.000Z'
            }
        ],
        nda: [
            {
                id: 'doc-mock-nda-001',
                nome: 'NDA • Projeto Orion',
                currentStep: 4,
                updatedAt: '2026-02-20T14:15:00.000Z'
            }
        ]
    },
    savedFlows: [
        {
            id: 'saved-flow-mock-001',
            model: 'prestacao-servicos',
            name: 'Fluxo padrão Prestação (Mock)',
            createdAt: '2026-02-18T09:00:00.000Z',
            stages: [
                { id: 1, nome: 'Solicitação / Início' },
                { id: 2, nome: 'Elaboração / Edição' },
                { id: 3, nome: 'Revisão Técnica / Validação' },
                { id: 4, nome: 'Revisão Jurídica' },
                { id: 5, nome: 'Aprovação Orçamentária' },
                { id: 6, nome: 'Aprovação Gerencial' },
                { id: 7, nome: 'Negociação / Ajustes' },
                { id: 8, nome: 'Assinatura Digital' },
                { id: 9, nome: 'Execução / Publicação' }
            ],
            customExtras: [],
            clauses: [
                { clauseId: 'partes', values: {} },
                { clauseId: 'objeto-servico', values: {} },
                { clauseId: 'assinatura', values: {} }
            ]
        }
    ]
}

const workflowState = {
    currentModel: 'prestacao-servicos',
    focusStep: null,
    focusOnlyMine: true,
    mode: 'document',
    templateStep: 1,
    templateFieldSearch: '',
    activeTemplateIdByModel: {},
    templateEditorModeByModel: {},
    templateNameByModel: {},
    templateNameErrorByModel: {},
    selectedTemplateStageIdsByModel: {},
    customExtrasByModel: {},
    documentsByModel: {},
    selectedTemplateFieldsByModel: {},
    selectedClausesByModel: {},
    activeClauseByModel: {},
    clauseFormEnabledByModel: {},
    clauseFormNoticeByModel: {},
    savedFlows: []
}

const workflowStorageKey = 'ged.workflow.savedFlows.v1'

const workflowMockService = {
    loadSavedFlows() {
        try {
            const rawValue = localStorage.getItem(workflowStorageKey)
            if (!rawValue) {
                return workflowMockSeed.savedFlows.map((flow) => ({ ...flow }))
            }

            const parsed = JSON.parse(rawValue)
            return Array.isArray(parsed) ? parsed : []
        } catch (error) {
            return workflowMockSeed.savedFlows.map((flow) => ({ ...flow }))
        }
    },
    saveSavedFlows(savedFlows) {
        localStorage.setItem(workflowStorageKey, JSON.stringify(savedFlows))
    },
    loadInitialDocuments(modelKey) {
        const documents = workflowMockSeed.documentsByModel[modelKey] || []
        return documents.map((doc) => ({
            ...doc,
            updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date()
        }))
    }
}

const workflowRefs = {
    modelSelect: null,
    templateModelSelect: null,
    myStepSelect: null,
    templateMyStepSelect: null,
    focusMode: null,
    workflowRoots: [],
    modeDocumentButton: null,
    modeTemplateButton: null,
    templateHub: null,
    templateSteps: null,
    templateContent: null,
    templateNewButton: null,
    board: null,
    library: null,
    selectedClauses: null,
    clauseForm: null,
    documentPreview: null,
    addExtraButton: null,
    addDocumentButton: null,
    saveFlowButton: null,
    savedList: null
}

function getTemplateEditorMode(modelKey) {
    return workflowState.templateEditorModeByModel[modelKey] || 'edit'
}

function setTemplateEditorMode(modelKey, mode) {
    workflowState.templateEditorModeByModel[modelKey] = mode === 'create' ? 'create' : 'edit'
}

function formatWorkflowModelLabel(modelKey) {
    const catalogItem = workflowModelFieldCatalog[modelKey]
    if (catalogItem && catalogItem.displayName) {
        return catalogItem.displayName
    }

    return modelKey
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
}

function formatTemplateNamePlaceholder(modelKey) {
    const modelLabel = formatWorkflowModelLabel(modelKey)
    const todayLabel = new Date().toLocaleDateString('pt-BR')
    return `${modelLabel} - ${todayLabel}`
}

function escapeHtmlAttr(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}

function formatStageNumber(value) {
    return String(value).replace('.', ',')
}

function getWorkflowStagesForModel(modelKey) {
    const config = workflowModels[modelKey] || { skip: [] }
    const skipList = config.skip || []
    const baseStages = workflowDefaultFlow
        .filter((stage) => !skipList.includes(Math.floor(stage.id)))
        .map((stage) => ({ id: Number(stage.id), nome: stage.nome }))

    const staticExtras = (config.extra || []).map((extra) => ({ id: Number(extra.pos), nome: extra.nome }))
    const customExtras = (workflowState.customExtrasByModel[modelKey] || []).map((extra) => ({ id: Number(extra.pos), nome: extra.nome }))

    const stages = [...baseStages, ...staticExtras, ...customExtras]
        .filter((stage) => Number.isFinite(stage.id))
        .sort((a, b) => a.id - b.id)

    return stages
}

function getWorkflowCurrentStages() {
    return getWorkflowStagesForModel(workflowState.currentModel)
}

function ensureWorkflowModelState(modelKey) {
    if (!workflowState.customExtrasByModel[modelKey]) {
        workflowState.customExtrasByModel[modelKey] = []
    }

    if (!workflowState.documentsByModel[modelKey]) {
        const seededDocuments = workflowMockService.loadInitialDocuments(modelKey)
        if (seededDocuments.length) {
            workflowState.documentsByModel[modelKey] = seededDocuments
        } else {
            const firstStage = getWorkflowStagesForModel(modelKey)[0]
            workflowState.documentsByModel[modelKey] = firstStage ? [
                {
                    id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    nome: `${formatWorkflowModelLabel(modelKey)} • Documento inicial`,
                    currentStep: firstStage.id,
                    templateVersion: '1.0',
                    status: 'rascunho',
                    updatedAt: new Date()
                }
            ] : []
        }
    }

    if (!workflowState.selectedTemplateFieldsByModel[modelKey]) {
        const catalogItem = workflowModelFieldCatalog[modelKey]
        const initialFields = catalogItem?.fields ? catalogItem.fields.slice(0, Math.min(8, catalogItem.fields.length)) : []
        workflowState.selectedTemplateFieldsByModel[modelKey] = new Set(initialFields)
    }

    if (!workflowState.selectedTemplateStageIdsByModel[modelKey]) {
        const defaultStages = getWorkflowStagesForModel(modelKey).map((stage) => stage.id)
        workflowState.selectedTemplateStageIdsByModel[modelKey] = new Set(defaultStages)
    }

    if (typeof workflowState.templateNameByModel[modelKey] !== 'string') {
        workflowState.templateNameByModel[modelKey] = formatWorkflowModelLabel(modelKey)
    }

    if (typeof workflowState.templateNameErrorByModel[modelKey] !== 'string') {
        workflowState.templateNameErrorByModel[modelKey] = ''
    }

    if (typeof workflowState.activeTemplateIdByModel[modelKey] !== 'string') {
        workflowState.activeTemplateIdByModel[modelKey] = ''
    }

    if (typeof workflowState.templateEditorModeByModel[modelKey] !== 'string') {
        workflowState.templateEditorModeByModel[modelKey] = 'edit'
    }

    if (!workflowState.selectedClausesByModel[modelKey]) {
        const defaults = workflowModelDefaultClauses[modelKey] || ['partes', 'assinatura']
        workflowState.selectedClausesByModel[modelKey] = defaults
            .map((clauseId) => {
                const clause = workflowClauseCatalog.find((item) => item.id === clauseId)
                if (!clause) return null
                return {
                    clauseId,
                    values: {}
                }
            })
            .filter(Boolean)
    }

    if (!workflowState.activeClauseByModel[modelKey]) {
        workflowState.activeClauseByModel[modelKey] = workflowState.selectedClausesByModel[modelKey][0]?.clauseId || null
    }

    if (typeof workflowState.clauseFormEnabledByModel[modelKey] !== 'boolean') {
        workflowState.clauseFormEnabledByModel[modelKey] = false
    }

    if (typeof workflowState.clauseFormNoticeByModel[modelKey] !== 'string') {
        workflowState.clauseFormNoticeByModel[modelKey] = ''
    }
}

function setWorkflowClauseFormEnabled(enabled) {
    workflowState.clauseFormEnabledByModel[workflowState.currentModel] = Boolean(enabled)
}

function setWorkflowClauseFormNotice(message) {
    workflowState.clauseFormNoticeByModel[workflowState.currentModel] = String(message || '')
}

function getWorkflowCurrentDocuments() {
    return workflowState.documentsByModel[workflowState.currentModel] || []
}

function renderWorkflowModelOptions() {
    const selects = [workflowRefs.modelSelect, workflowRefs.templateModelSelect].filter(Boolean)
    if (!selects.length) return

    const options = Object.keys(workflowModels).map((modelKey) => {
        const catalogItem = workflowModelFieldCatalog[modelKey]
        const label = formatWorkflowModelLabel(modelKey)
        return {
            value: modelKey,
            text: catalogItem ? `${label} (${catalogItem.volume})` : label
        }
    })

    selects.forEach((select) => {
        select.innerHTML = ''
        options.forEach((optionData) => {
            const option = document.createElement('option')
            option.value = optionData.value
            option.textContent = optionData.text
            option.selected = optionData.value === workflowState.currentModel
            select.appendChild(option)
        })
    })
}

function renderWorkflowStepOptions() {
    const selects = [workflowRefs.myStepSelect, workflowRefs.templateMyStepSelect].filter(Boolean)
    if (!selects.length) return

    const stages = getWorkflowCurrentStages()
    if (!stages.length) {
        selects.forEach((select) => {
            select.innerHTML = ''
        })
        workflowState.focusStep = null
        workflowState.templateStep = null
        return
    }

    if (!stages.some((stage) => stage.id === workflowState.focusStep)) {
        workflowState.focusStep = stages[0].id
    }
    if (!stages.some((stage) => stage.id === workflowState.templateStep)) {
        workflowState.templateStep = workflowState.focusStep
    }

    selects.forEach((select) => {
        const isTemplateSelect = select === workflowRefs.templateMyStepSelect
        select.innerHTML = ''
        stages.forEach((stage) => {
            const option = document.createElement('option')
            option.value = String(stage.id)
            option.textContent = `${formatStageNumber(stage.id)} - ${stage.nome}`
            option.selected = isTemplateSelect ? stage.id === workflowState.templateStep : stage.id === workflowState.focusStep
            select.appendChild(option)
        })
    })
}

function setWorkflowMode(mode) {
    workflowState.mode = mode === 'template' ? 'template' : 'document'

    workflowRefs.workflowRoots.forEach((root) => {
        root.classList.toggle('is-template-mode', workflowState.mode === 'template')
    })

    if (workflowRefs.modeDocumentButton) {
        const isActive = workflowState.mode === 'document'
        workflowRefs.modeDocumentButton.classList.toggle('is-active', isActive)
        workflowRefs.modeDocumentButton.setAttribute('aria-selected', String(isActive))
    }

    if (workflowRefs.modeTemplateButton) {
        const isActive = workflowState.mode === 'template'
        workflowRefs.modeTemplateButton.classList.toggle('is-active', isActive)
        workflowRefs.modeTemplateButton.setAttribute('aria-selected', String(isActive))
    }
}

function renderWorkflowTemplateSteps() {
    const container = workflowRefs.templateSteps
    if (!container) return

    const stages = getWorkflowCurrentStages()
    if (!stages.length) {
        container.innerHTML = ''
        return
    }

    container.innerHTML = stages.map((stage) => {
        const isActive = stage.id === workflowState.templateStep
        const className = isActive ? 'workflow__template-step is-active' : 'workflow__template-step'
        return `<button type="button" class="${className}" data-template-step="${stage.id}">${formatStageNumber(stage.id)} - ${stage.nome}</button>`
    }).join('')
}

function getWorkflowTemplateFieldList() {
    const catalogItem = workflowModelFieldCatalog[workflowState.currentModel]
    const allFields = catalogItem?.fields || []
    const searchValue = (workflowState.templateFieldSearch || '').trim().toLowerCase()

    if (!searchValue) {
        return allFields
    }

    return allFields.filter((fieldName) => fieldName.toLowerCase().includes(searchValue))
}

function renderWorkflowTemplateContent() {
    const container = workflowRefs.templateContent
    if (!container) return

    const modelKey = workflowState.currentModel
    const modelLabel = formatWorkflowModelLabel(modelKey)
    const catalogItem = workflowModelFieldCatalog[modelKey]
    const editorMode = getTemplateEditorMode(modelKey)
    const availableStages = getWorkflowStagesForModel(modelKey)
    const selectedStageIds = workflowState.selectedTemplateStageIdsByModel[modelKey] || new Set()
    const selectedClauses = getCurrentModelSelectedClauses()
    const templatesForModel = workflowState.savedFlows
        .filter((flow) => flow.model === modelKey)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const activeTemplateId = workflowState.activeTemplateIdByModel[modelKey] || ''
    const hasActiveTemplate = templatesForModel.some((flow) => flow.id === activeTemplateId)
    const placeholderSelected = hasActiveTemplate ? '' : 'selected'
    const templateOptions = [`<option value="" disabled ${placeholderSelected}>Selecione um template salvo</option>`, ...templatesForModel.map((flow) => {
        const selected = flow.id === activeTemplateId ? 'selected' : ''
        return `<option value="${flow.id}" ${selected}>${flow.name}</option>`
    })].join('')

    const stageList = availableStages.map((stage) => {
        const checked = selectedStageIds.has(stage.id) ? 'checked' : ''
        return `
            <label class="workflow__template-stage-item">
                <input type="checkbox" data-template-stage="${stage.id}" ${checked}>
                <span>${formatStageNumber(stage.id)} - ${stage.nome}</span>
            </label>
        `
    }).join('')

    const selectedStageTags = availableStages
        .filter((stage) => selectedStageIds.has(stage.id))
        .sort((a, b) => a.id - b.id)
        .map((stage) => `<span class="workflow__template-stage-tag">${formatStageNumber(stage.id)} - ${stage.nome}</span>`)
        .join('')

    const clausesHtml = selectedClauses.length
        ? selectedClauses.map((item) => {
            const clause = workflowClauseCatalog.find((catalogClause) => catalogClause.id === item.clauseId)
            if (!clause) return ''
            return `
                <div class="workflow__clause-item">
                    <p class="workflow__clause-item-title">${clause.title}</p>
                    <div class="workflow__clause-actions">
                        <button type="button" class="workflow__small-btn" data-remove-clause="${clause.id}">Remover</button>
                    </div>
                </div>
            `
        }).join('')
        : '<p class="workflow__hint">Nenhuma cláusula selecionada para este template.</p>'

    if (workflowRefs.templateNewButton) {
        workflowRefs.templateNewButton.textContent = editorMode === 'create' ? 'Cancelar criação' : 'Criar novo template'
    }

    const modeHint = editorMode === 'create'
        ? 'Modo criação: ajuste steps e cláusulas e depois salve.'
        : 'Modo edição: selecione um template salvo para ajustar steps e cláusulas.'

    const isCreating = editorMode === 'create'
    const templateSelectDisabled = isCreating ? 'disabled' : ''
    const templateNameValue = workflowState.templateNameByModel[modelKey] || ''
    const templateNameError = workflowState.templateNameErrorByModel[modelKey] || ''
    const templateNameInputClass = templateNameError ? 'workflow__template-input workflow__template-input--error' : 'workflow__template-input'

    container.innerHTML = `
        <div class="workflow__template-controls">
            <div class="workflow__template-control workflow__template-control--compact">
                <label class="workflow__template-label" for="workflow-template-model-control">Template de Documento</label>
                <select id="workflow-template-model-control" class="workflow__template-select">
                    ${Object.keys(workflowModels).map((key) => `<option value="${key}" ${key === modelKey ? 'selected' : ''}>${formatWorkflowModelLabel(key)}</option>`).join('')}
                </select>
            </div>
            <div class="workflow__template-control workflow__template-control--compact">
                <label class="workflow__template-label" for="workflow-template-select">Template salvo</label>
                <select id="workflow-template-select" class="workflow__template-select" ${templateSelectDisabled}>${templateOptions}</select>
            </div>
            <div class="workflow__template-control">
                ${isCreating ? `
                <label class="workflow__template-label" for="workflow-template-name-input">Nome do template</label>
                <input
                    type="text"
                    id="workflow-template-name-input"
                    class="${templateNameInputClass}"
                    value="${escapeHtmlAttr(templateNameValue)}"
                    placeholder="${templateNameError ? 'Informe um nome para o novo template' : 'Ex: modelo - dd/mm/yyyy'}"
                    maxlength="120"
                >
                ` : `
                <p class="workflow__template-note">${modeHint}</p>
                <p class="workflow__template-note">Modelo: <strong>${modelLabel}</strong> • Steps selecionados: <strong>${selectedStageIds.size}</strong> • Cláusulas: <strong>${selectedClauses.length}</strong> • Volume: <strong>${catalogItem?.volume ?? '-'}</strong></p>
                `}
            </div>
            <div class="workflow__template-control workflow__template-control--save">
                <button type="button" class="btn btn--save-highlight" id="workflow-save-flow">Finalizar e salvar fluxo</button>
            </div>
        </div>

        <div class="workflow__template-layout">
            <div class="workflow__template-stage-column">
                <div class="workflow__section-title">Steps do template (Minha caixa)</div>
                <p class="workflow__section-subtitle">Selecione as caixas que farão parte do wizard deste template.</p>
                <div class="workflow__template-stage-list">${stageList}</div>
                <div class="workflow__template-stage-tags">${selectedStageTags || '<span class="workflow__hint">Nenhum step selecionado.</span>'}</div>
            </div>

            <div class="workflow__template-selected-column">
                <div class="workflow__section-title">Cláusulas selecionadas no template</div>
                <p class="workflow__section-subtitle">Adicione ou remova cláusulas sem preencher dados do documento.</p>
                <div id="workflow-selected-clauses" class="workflow__selected">${clausesHtml}</div>
            </div>

            <div class="workflow__library workflow__right-column">
                <div class="workflow__section-title">Cláusulas do modelo</div>
                <p class="workflow__section-subtitle">Use esta biblioteca para compor o conteúdo do template.</p>
                <div id="workflow-clause-library" class="workflow__library-list"></div>
            </div>
        </div>
    `

    workflowRefs.selectedClauses = document.getElementById('workflow-selected-clauses')
    workflowRefs.library = document.getElementById('workflow-clause-library')
    renderWorkflowClauseLibrary()
}

function startCreateWorkflowTemplate() {
    const modelKey = workflowState.currentModel
    const isCreating = getTemplateEditorMode(modelKey) === 'create'

    if (isCreating) {
        setTemplateEditorMode(modelKey, 'edit')
        renderWorkflowTemplateContent()
        return
    }

    prepareCreateTemplateForModel(modelKey)

    renderWorkflowTemplateContent()
}

function prepareCreateTemplateForModel(modelKey) {
    ensureWorkflowModelState(modelKey)
    setTemplateEditorMode(modelKey, 'create')
    workflowState.activeTemplateIdByModel[modelKey] = ''
    workflowState.templateNameByModel[modelKey] = ''
    workflowState.templateNameErrorByModel[modelKey] = ''
    workflowState.selectedTemplateStageIdsByModel[modelKey] = new Set(getWorkflowStagesForModel(modelKey).map((stage) => stage.id))

    const defaults = workflowModelDefaultClauses[modelKey] || ['partes', 'assinatura']
    workflowState.selectedClausesByModel[modelKey] = defaults
        .map((clauseId) => workflowClauseCatalog.find((item) => item.id === clauseId))
        .filter(Boolean)
        .map((clause) => ({ clauseId: clause.id, values: {} }))
}

function moveWorkflowDocumentForward(documentId) {
    const documents = getWorkflowCurrentDocuments()
    const stages = getWorkflowCurrentStages()
    const documentItem = documents.find((item) => item.id === documentId)

    if (!documentItem || !stages.length) {
        return
    }

    const currentIndex = stages.findIndex((stage) => stage.id === documentItem.currentStep)
    if (currentIndex === -1) {
        documentItem.currentStep = stages[0].id
        documentItem.updatedAt = new Date()
        return
    }

    const nextStage = stages[currentIndex + 1]
    if (nextStage) {
        documentItem.currentStep = nextStage.id
        if (currentIndex >= 0) {
            documentItem.status = 'em_aprovacao'
        }
        documentItem.updatedAt = new Date()
    } else {
        documentItem.status = 'finalizado'
        documentItem.updatedAt = new Date()
    }
}

function renderWorkflowBoard() {
    const board = workflowRefs.board
    if (!board) return

    const stages = getWorkflowCurrentStages()
    const documents = getWorkflowCurrentDocuments()

    let visibleStages = stages
    if (workflowState.focusOnlyMine && workflowState.focusStep !== null) {
        visibleStages = stages.filter((stage) => stage.id === workflowState.focusStep)
    }

    board.innerHTML = ''

    visibleStages.forEach((stage) => {
        const stageDocuments = documents.filter((doc) => doc.currentStep === stage.id)
        const stageIndex = stages.findIndex((item) => item.id === stage.id)

        const box = document.createElement('article')
        box.className = 'workflow__box'
        if (stage.id === workflowState.focusStep) {
            box.classList.add('is-current')
        }

        const docsMarkup = stageDocuments.length
            ? stageDocuments.map((doc) => {
                const nextStage = stages[stageIndex + 1]
                const moveLabel = nextStage ? `Mover para ${formatStageNumber(nextStage.id)}` : 'Armazenado'
                const updatedAt = doc.updatedAt instanceof Date ? doc.updatedAt.toLocaleDateString('pt-BR') : '-'
                const statusLabel = doc.status || 'rascunho'
                const immutableLabel = statusLabel === 'rascunho' ? 'Editável' : 'Imutável'

                return `
                    <div class="workflow__doc">
                        <p class="workflow__doc-name">${doc.nome}</p>
                        <p class="workflow__doc-meta">Última atualização: ${updatedAt}</p>
                        <p class="workflow__doc-meta">Status: ${statusLabel} • ${immutableLabel}</p>
                        <p class="workflow__doc-meta">Template v${doc.templateVersion || '1.0'}</p>
                        <button class="workflow__doc-move" data-move-doc="${doc.id}" ${nextStage ? '' : 'disabled'}>${moveLabel}</button>
                    </div>
                `
            }).join('')
            : '<p class="workflow__box-empty">Nenhum documento nesta caixa.</p>'

        box.innerHTML = `
            <div class="workflow__box-header">
                <div>
                    <div class="workflow__box-id">Caixa ${formatStageNumber(stage.id)}</div>
                    <h3 class="workflow__box-name">${stage.nome}</h3>
                </div>
                <span class="workflow__box-counter">${stageDocuments.length}</span>
            </div>
            <div class="workflow__docs">${docsMarkup}</div>
        `

        board.appendChild(box)
    })
}

function getCurrentModelSelectedClauses() {
    return workflowState.selectedClausesByModel[workflowState.currentModel] || []
}

function renderWorkflowClauseLibrary() {
    const library = workflowRefs.library
    if (!library) return

    const selected = new Set(getCurrentModelSelectedClauses().map((item) => item.clauseId))
    library.innerHTML = ''

    workflowClauseCatalog.forEach((clause) => {
        const item = document.createElement('div')
        item.className = 'workflow__clause-item'

        const isSelected = selected.has(clause.id)
        item.innerHTML = `
            <p class="workflow__clause-item-title">${clause.title}</p>
            <div class="workflow__clause-actions">
                <button type="button" class="workflow__small-btn" data-add-clause="${clause.id}" ${isSelected ? 'disabled' : ''}>${isSelected ? 'Adicionada' : 'Adicionar'}</button>
            </div>
        `

        library.appendChild(item)
    })
}

function renderWorkflowSelectedClauses() {
    const container = workflowRefs.selectedClauses
    if (!container) return

    const selectedClauses = getCurrentModelSelectedClauses()
    if (!selectedClauses.length) {
        container.innerHTML = '<p class="workflow__hint">Nenhuma cláusula selecionada para este modelo.</p>'
        return
    }

    container.innerHTML = selectedClauses.map((selectedClause) => {
        const clause = workflowClauseCatalog.find((item) => item.id === selectedClause.clauseId)
        if (!clause) return ''

        return `
            <div class="workflow__clause-item">
                <p class="workflow__clause-item-title">${clause.title}</p>
                <div class="workflow__clause-actions">
                    <button type="button" class="workflow__small-btn" data-remove-clause="${clause.id}">Remover</button>
                </div>
            </div>
        `
    }).join('')
}

function renderWorkflowClauseForm() {
    const formContainer = workflowRefs.clauseForm
    if (!formContainer) return

    const isEnabled = Boolean(workflowState.clauseFormEnabledByModel[workflowState.currentModel])
    if (!isEnabled) {
        formContainer.classList.add('workflow__form--disabled')
        const notice = workflowState.clauseFormNoticeByModel[workflowState.currentModel] || 'Formulário desativado. Clique em "Preencher dados" para habilitar a edição da cláusula.'
        formContainer.innerHTML = `<p class="workflow__hint">${notice}</p>`
        return
    }

    formContainer.classList.remove('workflow__form--disabled')

    const activeClauseId = workflowState.activeClauseByModel[workflowState.currentModel]
    const selectedClause = getCurrentModelSelectedClauses().find((item) => item.clauseId === activeClauseId)
    if (!selectedClause) {
        formContainer.innerHTML = '<p class="workflow__hint">Selecione uma cláusula para preencher os metadados.</p>'
        return
    }

    const clauseDefinition = workflowClauseCatalog.find((item) => item.id === selectedClause.clauseId)
    if (!clauseDefinition) {
        formContainer.innerHTML = ''
        return
    }

    if (!clauseDefinition.requiresForm || !clauseDefinition.fields.length) {
        formContainer.innerHTML = `
            <div class="workflow__form-row">
                <label>${clauseDefinition.title}</label>
                <p class="workflow__hint">Esta cláusula é padrão e não exige formulário. Basta mantê-la no modelo.</p>
            </div>
            <div class="workflow__form-actions">
                <button type="button" class="workflow__form-save" data-save-clause>Salvar dados da cláusula</button>
                <p class="workflow__form-status">Clique em salvar para concluir esta etapa.</p>
            </div>
        `
        return
    }

    const fieldsHtml = clauseDefinition.fields.map((field) => {
        const value = selectedClause.values[field.name] || ''

        if (field.type === 'textarea') {
            return `
                <div class="workflow__form-row">
                    <label for="clause-field-${field.name}">${field.label}</label>
                    <textarea id="clause-field-${field.name}" data-clause-field="${field.name}" placeholder="${field.placeholder || ''}">${value}</textarea>
                </div>
            `
        }

        if (field.type === 'select') {
            const options = (field.options || []).map((option) => `<option value="${option}" ${value === option ? 'selected' : ''}>${option}</option>`).join('')
            return `
                <div class="workflow__form-row">
                    <label for="clause-field-${field.name}">${field.label}</label>
                    <select id="clause-field-${field.name}" data-clause-field="${field.name}">
                        <option value="">Selecione</option>
                        ${options}
                    </select>
                </div>
            `
        }

        return `
            <div class="workflow__form-row">
                <label for="clause-field-${field.name}">${field.label}</label>
                <input id="clause-field-${field.name}" type="${field.type || 'text'}" data-clause-field="${field.name}" value="${value}" placeholder="${field.placeholder || ''}" />
            </div>
        `
    }).join('')

    formContainer.innerHTML = `
        <div class="workflow__form-row">
            <label>Cláusula ativa</label>
            <strong>${clauseDefinition.title}</strong>
        </div>
        ${fieldsHtml}
        <div class="workflow__form-actions">
            <button type="button" class="workflow__form-save" data-save-clause>Salvar dados da cláusula</button>
            <p class="workflow__form-status">Após salvar, você pode seguir para a próxima cláusula.</p>
        </div>
    `
}

function getWorkflowDefaultPreviewText(clauseId) {
    if (clauseId === 'confidencialidade') {
        return 'As partes se comprometem a manter sigilo sobre todas as informações confidenciais relacionadas a este contrato.'
    }

    if (clauseId === 'assinatura') {
        return 'As partes concordam com assinatura digital deste instrumento, com validade jurídica e integridade do documento.'
    }

    return 'Cláusula adicionada ao documento. Preencha os dados para detalhar este trecho.'
}

function renderWorkflowDocumentPreview() {
    const previewContainer = workflowRefs.documentPreview
    if (!previewContainer) return

    const selectedClauses = getCurrentModelSelectedClauses()
    if (!selectedClauses.length) {
        previewContainer.innerHTML = '<p class="workflow__preview-empty">Nenhuma cláusula selecionada para pré-visualização.</p>'
        return
    }

    const sections = selectedClauses.map((selectedClause) => {
        const clauseDefinition = workflowClauseCatalog.find((item) => item.id === selectedClause.clauseId)
        if (!clauseDefinition) return ''

        if (!clauseDefinition.requiresForm || !clauseDefinition.fields.length) {
            return `
                <div class="workflow__preview-section">
                    <strong>${clauseDefinition.title}</strong>
                    <p class="workflow__preview-line">${getWorkflowDefaultPreviewText(clauseDefinition.id)}</p>
                </div>
            `
        }

        const fieldLines = clauseDefinition.fields.map((field) => {
            const rawValue = selectedClause.values[field.name]
            const value = rawValue && String(rawValue).trim() ? String(rawValue).trim() : 'Nao informado'
            return `<p class="workflow__preview-line"><strong>${field.label}:</strong> ${value}</p>`
        }).join('')

        return `
            <div class="workflow__preview-section">
                <strong>${clauseDefinition.title}</strong>
                ${fieldLines}
            </div>
        `
    }).join('')

    previewContainer.innerHTML = `
        <p class="workflow__preview-title">Pré-visualização do documento</p>
        ${sections}
    `
}

function loadWorkflowSavedFlows() {
    workflowState.savedFlows = workflowMockService.loadSavedFlows()
}

function persistWorkflowSavedFlows() {
    workflowMockService.saveSavedFlows(workflowState.savedFlows)
}

function buildWorkflowSnapshot() {
    const modelKey = workflowState.currentModel
    const selectedStageIds = Array.from(workflowState.selectedTemplateStageIdsByModel[modelKey] || [])
    const stages = getWorkflowStagesForModel(modelKey)
        .filter((stage) => selectedStageIds.includes(stage.id))
        .map((stage) => ({ id: stage.id, nome: stage.nome }))
    const clauses = getCurrentModelSelectedClauses().map((item) => ({
        clauseId: item.clauseId,
        values: { ...item.values }
    }))
    const customExtras = (workflowState.customExtrasByModel[modelKey] || []).map((item) => ({ ...item }))
    const selectedFields = Array.from(workflowState.selectedTemplateFieldsByModel[modelKey] || [])

    return {
        id: `saved-flow-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        model: modelKey,
        name: '',
        createdAt: new Date().toISOString(),
        stages,
        customExtras,
        selectedFields,
        clauses
    }
}

function renderWorkflowSavedFlows() {
    const savedList = workflowRefs.savedList
    if (!savedList) return

    const modelSavedFlows = workflowState.savedFlows
        .filter((flow) => flow.model === workflowState.currentModel)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    if (!modelSavedFlows.length) {
        savedList.innerHTML = '<p class="workflow__hint">Nenhum fluxo salvo para este modelo.</p>'
        return
    }

    savedList.innerHTML = modelSavedFlows.map((flow) => {
        const created = new Date(flow.createdAt)
        const createdLabel = Number.isNaN(created.getTime()) ? '-' : created.toLocaleString('pt-BR')
        const stagesCount = Array.isArray(flow.stages) ? flow.stages.length : 0

        return `
            <div class="workflow__saved-item">
                <div class="workflow__saved-info">
                    <p class="workflow__saved-name">${flow.name}</p>
                    <p class="workflow__saved-meta">${stagesCount} caixas • Salvo em ${createdLabel}</p>
                </div>
                <div class="workflow__saved-actions">
                    <button type="button" class="workflow__small-btn" data-load-flow="${flow.id}">Carregar</button>
                    <button type="button" class="workflow__small-btn" data-delete-flow="${flow.id}">Excluir</button>
                </div>
            </div>
        `
    }).join('')
}

function saveCurrentWorkflowSnapshot() {
    const modelKey = workflowState.currentModel
    const rawTemplateName = (workflowState.templateNameByModel[modelKey] || '').trim()
    const isCreating = getTemplateEditorMode(modelKey) === 'create'

    if (isCreating && !rawTemplateName) {
        workflowState.templateNameErrorByModel[modelKey] = 'Informe um nome para o novo template.'
        renderWorkflowTemplateContent()
        showAppAlert({
            type: 'warning',
            title: 'Nome obrigatório',
            message: 'Para salvar um novo template, informe um nome.'
        })
        return
    }

    const templateName = rawTemplateName || formatWorkflowModelLabel(modelKey)
    workflowState.templateNameErrorByModel[modelKey] = ''

    const selectedStages = workflowState.selectedTemplateStageIdsByModel[modelKey] || new Set()
    if (!selectedStages.size) {
        showAppAlert({
            type: 'danger',
            title: 'Não foi possível salvar',
            message: 'Selecione ao menos uma caixa (step) para o template.'
        })
        return
    }

    try {
        const snapshot = buildWorkflowSnapshot()
        snapshot.name = templateName

        const activeId = workflowState.activeTemplateIdByModel[modelKey]
        if (activeId) {
            const index = workflowState.savedFlows.findIndex((flow) => flow.id === activeId)
            if (index !== -1) {
                workflowState.savedFlows[index] = {
                    ...workflowState.savedFlows[index],
                    ...snapshot,
                    id: activeId,
                    createdAt: workflowState.savedFlows[index].createdAt || snapshot.createdAt
                }
            } else {
                snapshot.id = activeId
                workflowState.savedFlows.unshift(snapshot)
            }
        } else {
            workflowState.savedFlows.unshift(snapshot)
            workflowState.activeTemplateIdByModel[modelKey] = snapshot.id
        }

        setTemplateEditorMode(modelKey, 'edit')
        persistWorkflowSavedFlows()
        renderWorkflowAll()

        showAppAlert({
            type: 'success',
            title: 'Template salvo',
            message: 'Fluxo finalizado e salvo com sucesso.'
        })
    } catch (error) {
        showAppAlert({
            type: 'danger',
            title: 'Erro ao salvar',
            message: 'Ocorreu uma falha ao salvar o fluxo. Tente novamente.'
        })
    }
}

function closeWorkflowSaveFlowModal() {
    const modal = document.getElementById('workflow-save-flow-modal')
    if (modal) {
        modal.classList.add('is-hidden')
    }
}

function submitWorkflowSaveFlow() {
    const input = document.getElementById('workflow-save-input')
    
    if (!input) return
    
    const flowName = input.value.trim()
    if (!flowName) {
        showAppAlert({
            type: 'warning',
            title: 'Nome obrigatório',
            message: 'Por favor, insira um nome para o fluxo.'
        })
        return
    }

    const snapshot = buildWorkflowSnapshot()
    snapshot.name = flowName

    workflowState.savedFlows.unshift(snapshot)
    persistWorkflowSavedFlows()
    renderWorkflowSavedFlows()
    closeWorkflowSaveFlowModal()
    showAppAlert({
        type: 'success',
        title: 'Fluxo salvo',
        message: 'O fluxo foi salvo com sucesso.'
    })
}

function loadSavedWorkflowById(flowId) {
    const flow = workflowState.savedFlows.find((item) => item.id === flowId)
    if (!flow) return

    workflowState.currentModel = flow.model
    workflowState.customExtrasByModel[flow.model] = Array.isArray(flow.customExtras) ? flow.customExtras.map((item) => ({ ...item })) : []
    workflowState.selectedClausesByModel[flow.model] = Array.isArray(flow.clauses)
        ? flow.clauses.map((item) => ({ clauseId: item.clauseId, values: { ...(item.values || {}) } }))
        : []
    workflowState.selectedTemplateFieldsByModel[flow.model] = new Set(Array.isArray(flow.selectedFields) ? flow.selectedFields : [])

    ensureWorkflowModelState(flow.model)
    const stages = getWorkflowCurrentStages()
    workflowState.focusStep = stages[0]?.id || null
    workflowState.activeClauseByModel[flow.model] = workflowState.selectedClausesByModel[flow.model][0]?.clauseId || null
    workflowState.clauseFormEnabledByModel[flow.model] = false
    workflowState.clauseFormNoticeByModel[flow.model] = ''

    renderWorkflowAll()
}

function deleteSavedWorkflowById(flowId) {
    const index = workflowState.savedFlows.findIndex((item) => item.id === flowId)
    if (index === -1) return

    workflowState.savedFlows.splice(index, 1)
    persistWorkflowSavedFlows()
    renderWorkflowSavedFlows()
}

function renderWorkflowAll() {
    renderWorkflowTemplateSteps()
    renderWorkflowTemplateContent()
    renderWorkflowModelOptions()
    renderWorkflowStepOptions()
    renderWorkflowBoard()
    renderWorkflowClauseLibrary()
    renderWorkflowSelectedClauses()
    renderWorkflowClauseForm()
    renderWorkflowDocumentPreview()
    renderWorkflowSavedFlows()
}

function addWorkflowClause(clauseId) {
    const selectedClauses = getCurrentModelSelectedClauses()
    if (selectedClauses.some((item) => item.clauseId === clauseId)) {
        return
    }

    selectedClauses.push({
        clauseId,
        values: {}
    })

    workflowState.activeClauseByModel[workflowState.currentModel] = clauseId
    setWorkflowClauseFormNotice('')
    setWorkflowClauseFormEnabled(false)
}

function removeWorkflowClause(clauseId) {
    const selectedClauses = getCurrentModelSelectedClauses()
    const index = selectedClauses.findIndex((item) => item.clauseId === clauseId)
    if (index === -1) return

    selectedClauses.splice(index, 1)

    if (workflowState.activeClauseByModel[workflowState.currentModel] === clauseId) {
        workflowState.activeClauseByModel[workflowState.currentModel] = selectedClauses[0]?.clauseId || null
        setWorkflowClauseFormNotice('Cláusula removida. Clique em "Preencher dados" para editar a próxima.')
        setWorkflowClauseFormEnabled(false)
    }
}

function saveWorkflowActiveClause() {
    const selectedClauses = getCurrentModelSelectedClauses()
    const activeClauseId = workflowState.activeClauseByModel[workflowState.currentModel]
    const clause = selectedClauses.find((item) => item.clauseId === activeClauseId)
    if (!clause) return

    setWorkflowClauseFormNotice('Dados da cláusula salvos. Agora você pode clicar em "Preencher dados" na próxima cláusula.')
    setWorkflowClauseFormEnabled(false)
    renderWorkflowSelectedClauses()
    renderWorkflowClauseForm()
    renderWorkflowDocumentPreview()
}

function createWorkflowDocument() {
    const modal = document.getElementById('workflow-new-document-modal')
    const input = document.getElementById('workflow-document-input')
    
    if (!modal || !input) return

    const info = document.getElementById('workflow-document-template-info')
    if (info) {
        const selectedFields = workflowState.selectedTemplateFieldsByModel[workflowState.currentModel] || new Set()
        info.textContent = `Template: ${formatWorkflowModelLabel(workflowState.currentModel)} • versão 1.0 • ${selectedFields.size} campo(s) selecionado(s)`
    }
    
    input.value = ''
    modal.classList.remove('is-hidden')
    input.focus()
}

function closeWorkflowNewDocumentModal() {
    const modal = document.getElementById('workflow-new-document-modal')
    if (modal) {
        modal.classList.add('is-hidden')
    }
}

function submitWorkflowNewDocument() {
    const input = document.getElementById('workflow-document-input')
    const stages = getWorkflowCurrentStages()
    
    if (!input || !stages.length) {
        return
    }

    const safeName = input.value.trim() || `Novo ${formatWorkflowModelLabel(workflowState.currentModel)}`
    const documents = getWorkflowCurrentDocuments()
    
    documents.unshift({
        id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        nome: safeName,
        currentStep: stages[0].id,
        templateModel: workflowState.currentModel,
        templateVersion: '1.0',
        selectedFields: Array.from(workflowState.selectedTemplateFieldsByModel[workflowState.currentModel] || []),
        status: 'rascunho',
        updatedAt: new Date()
    })
    
    closeWorkflowNewDocumentModal()
    renderWorkflowBoard()
}

function addWorkflowExtraStep() {
    const modal = document.getElementById('workflow-extra-stage-modal')
    const nameInput = document.getElementById('workflow-stage-name')
    const posInput = document.getElementById('workflow-stage-position')
    
    if (!modal || !nameInput || !posInput) return
    
    nameInput.value = ''
    posInput.value = ''
    modal.classList.remove('is-hidden')
    nameInput.focus()
}

function closeWorkflowExtraStageModal() {
    const modal = document.getElementById('workflow-extra-stage-modal')
    if (modal) {
        modal.classList.add('is-hidden')
    }
}

function submitWorkflowExtraStage() {
    const nameInput = document.getElementById('workflow-stage-name')
    const posInput = document.getElementById('workflow-stage-position')
    
    if (!nameInput || !posInput) return
    
    const cleanName = nameInput.value.trim()
    if (!cleanName) {
        showAppAlert({
            type: 'warning',
            title: 'Nome obrigatório',
            message: 'Por favor, insira um nome para a etapa.'
        })
        return
    }

    const normalized = posInput.value.replace(',', '.').trim()
    const decimalValue = Number(normalized)

    if (!Number.isFinite(decimalValue)) {
        showAppAlert({
            type: 'danger',
            title: 'Posição inválida',
            message: 'Use um número válido para posição, por exemplo: 2,5.'
        })
        return
    }

    const extras = workflowState.customExtrasByModel[workflowState.currentModel]
    const duplicated = extras.some((extra) => Number(extra.pos) === decimalValue)
    if (duplicated) {
        showAppAlert({
            type: 'danger',
            title: 'Posição duplicada',
            message: 'Já existe uma etapa nessa posição para este modelo.'
        })
        return
    }

    extras.push({ pos: decimalValue, nome: cleanName })

    const stages = getWorkflowCurrentStages()
    if (!stages.some((stage) => stage.id === workflowState.focusStep)) {
        workflowState.focusStep = stages[0]?.id || null
    }
    
    closeWorkflowExtraStageModal()
    renderWorkflowStepOptions()
    renderWorkflowBoard()
}

function bindWorkflowEvents() {
    if (workflowRefs.modeDocumentButton) {
        workflowRefs.modeDocumentButton.addEventListener('click', () => {
            setWorkflowMode('document')
        })
    }

    if (workflowRefs.modeTemplateButton) {
        workflowRefs.modeTemplateButton.addEventListener('click', () => {
            setWorkflowMode('template')
            renderWorkflowTemplateSteps()
            renderWorkflowTemplateContent()
        })
    }

    if (workflowRefs.templateContent) {
        workflowRefs.templateContent.addEventListener('click', (event) => {
            const saveButton = event.target.closest('#workflow-save-flow')
            if (saveButton) {
                saveCurrentWorkflowSnapshot()
                return
            }

            const addButton = event.target.closest('[data-add-clause]')
            if (addButton) {
                const clauseId = addButton.getAttribute('data-add-clause')
                if (clauseId) {
                    addWorkflowClause(clauseId)
                    renderWorkflowTemplateContent()
                }
                return
            }

            const removeButton = event.target.closest('[data-remove-clause]')
            if (removeButton) {
                const clauseId = removeButton.getAttribute('data-remove-clause')
                if (clauseId) {
                    removeWorkflowClause(clauseId)
                    renderWorkflowTemplateContent()
                }
            }
        })

        workflowRefs.templateContent.addEventListener('change', (event) => {
            const modelControl = event.target.closest('#workflow-template-model-control')
            if (modelControl) {
                const nextModel = modelControl.value
                const previousModel = workflowState.currentModel
                const wasCreating = getTemplateEditorMode(previousModel) === 'create'
                workflowState.currentModel = nextModel
                ensureWorkflowModelState(nextModel)

                if (wasCreating) {
                    prepareCreateTemplateForModel(nextModel)
                }

                const currentStages = getWorkflowCurrentStages()
                workflowState.focusStep = currentStages[0]?.id || null
                workflowState.templateStep = workflowState.focusStep
                renderWorkflowAll()
                return
            }

            const templateSelect = event.target.closest('#workflow-template-select')
            if (templateSelect) {
                const selectedId = templateSelect.value
                const modelKey = workflowState.currentModel
                workflowState.activeTemplateIdByModel[modelKey] = selectedId
                setTemplateEditorMode(modelKey, 'edit')

                if (!selectedId) {
                    workflowState.templateNameByModel[modelKey] = formatWorkflowModelLabel(modelKey)
                    workflowState.templateNameErrorByModel[modelKey] = ''
                    workflowState.selectedTemplateStageIdsByModel[modelKey] = new Set(getWorkflowStagesForModel(modelKey).map((stage) => stage.id))
                    workflowState.selectedClausesByModel[modelKey] = []
                    renderWorkflowAll()
                    return
                }

                const loadedTemplate = workflowState.savedFlows.find((flow) => flow.id === selectedId)
                if (loadedTemplate) {
                    workflowState.templateNameByModel[modelKey] = loadedTemplate.name || formatWorkflowModelLabel(modelKey)
                    workflowState.templateNameErrorByModel[modelKey] = ''
                    workflowState.selectedTemplateStageIdsByModel[modelKey] = new Set((loadedTemplate.stages || []).map((stage) => stage.id))
                    workflowState.selectedClausesByModel[modelKey] = (loadedTemplate.clauses || []).map((item) => ({ clauseId: item.clauseId, values: {} }))
                    renderWorkflowAll()
                }
                return
            }

            const stageCheckbox = event.target.closest('[data-template-stage]')
            if (stageCheckbox) {
                const modelKey = workflowState.currentModel
                const stageId = Number(stageCheckbox.getAttribute('data-template-stage'))
                const selectedStages = workflowState.selectedTemplateStageIdsByModel[modelKey] || new Set()

                if (stageCheckbox.checked) {
                    selectedStages.add(stageId)
                } else {
                    selectedStages.delete(stageId)
                }

                workflowState.selectedTemplateStageIdsByModel[modelKey] = selectedStages
                renderWorkflowTemplateContent()
                return
            }

            const fieldCheckbox = event.target.closest('[data-template-field]')
            if (!fieldCheckbox) return

            const modelKey = workflowState.currentModel
            const selectedFields = workflowState.selectedTemplateFieldsByModel[modelKey] || new Set()
            const fieldName = fieldCheckbox.getAttribute('data-template-field')
            if (!fieldName) return

            if (fieldCheckbox.checked) {
                selectedFields.add(fieldName)
            } else {
                selectedFields.delete(fieldName)
            }

            workflowState.selectedTemplateFieldsByModel[modelKey] = selectedFields
            renderWorkflowTemplateContent()
        })

        workflowRefs.templateContent.addEventListener('input', (event) => {
            const templateNameInput = event.target.closest('#workflow-template-name-input')
            if (!templateNameInput) {
                return
            }

            const modelKey = workflowState.currentModel
            workflowState.templateNameByModel[modelKey] = templateNameInput.value
            
            if (workflowState.templateNameErrorByModel[modelKey] && templateNameInput.value.trim()) {
                workflowState.templateNameErrorByModel[modelKey] = ''
                renderWorkflowTemplateContent()
            }
        })

    }

    const handleModelChange = (nextModel) => {
        workflowState.currentModel = nextModel
        ensureWorkflowModelState(workflowState.currentModel)
        setWorkflowClauseFormNotice('')
        setWorkflowClauseFormEnabled(false)

        const currentStages = getWorkflowCurrentStages()
        workflowState.focusStep = currentStages[0]?.id || null
        workflowState.templateStep = workflowState.focusStep
        workflowState.templateFieldSearch = ''

        renderWorkflowAll()
    }

    if (workflowRefs.modelSelect) {
        workflowRefs.modelSelect.addEventListener('change', (event) => {
            handleModelChange(event.target.value)
        })
    }

    if (workflowRefs.myStepSelect) {
        workflowRefs.myStepSelect.addEventListener('change', (event) => {
            workflowState.focusStep = Number(event.target.value)
            renderWorkflowBoard()
        })
    }

    if (workflowRefs.templateNewButton) {
        workflowRefs.templateNewButton.addEventListener('click', () => {
            startCreateWorkflowTemplate()
        })
    }

    if (workflowRefs.saveFlowButton) {
        workflowRefs.saveFlowButton.addEventListener('click', () => {
            saveCurrentWorkflowSnapshot()
        })
    }

    if (workflowRefs.board) {
        workflowRefs.board.addEventListener('click', (event) => {
            const button = event.target.closest('[data-move-doc]')
            if (!button) return

            const documentId = button.getAttribute('data-move-doc')
            if (!documentId) return

            moveWorkflowDocumentForward(documentId)
            renderWorkflowBoard()
        })
    }

    if (workflowRefs.clauseForm) {
        workflowRefs.clauseForm.addEventListener('click', (event) => {
            const saveButton = event.target.closest('[data-save-clause]')
            if (!saveButton) return

            saveWorkflowActiveClause()
        })

        workflowRefs.clauseForm.addEventListener('input', (event) => {
            const field = event.target.closest('[data-clause-field]')
            if (!field) return

            const fieldName = field.getAttribute('data-clause-field')
            if (!fieldName) return

            const selectedClauses = getCurrentModelSelectedClauses()
            const activeClauseId = workflowState.activeClauseByModel[workflowState.currentModel]
            const clause = selectedClauses.find((item) => item.clauseId === activeClauseId)

            if (!clause) return
            clause.values[fieldName] = field.value
            renderWorkflowDocumentPreview()
        })
    }

    if (workflowRefs.savedList) {
        workflowRefs.savedList.addEventListener('click', (event) => {
            const loadButton = event.target.closest('[data-load-flow]')
            if (loadButton) {
                const flowId = loadButton.getAttribute('data-load-flow')
                if (flowId) {
                    loadSavedWorkflowById(flowId)
                }
                return
            }

            const deleteButton = event.target.closest('[data-delete-flow]')
            if (deleteButton) {
                const flowId = deleteButton.getAttribute('data-delete-flow')
                if (flowId) {
                    deleteSavedWorkflowById(flowId)
                }
            }
        })
    }

    const newDocModal = document.getElementById('workflow-new-document-modal')
    if (newDocModal) {
        const createBtn = document.getElementById('workflow-document-create')
        const cancelBtn = document.getElementById('workflow-document-cancel')
        const input = document.getElementById('workflow-document-input')

        if (createBtn) {
            createBtn.addEventListener('click', submitWorkflowNewDocument)
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeWorkflowNewDocumentModal)
        }
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') submitWorkflowNewDocument()
                else if (e.key === 'Escape') closeWorkflowNewDocumentModal()
            })
        }
        newDocModal.addEventListener('click', (e) => {
            if (e.target === newDocModal) closeWorkflowNewDocumentModal()
        })
    }

    const extraStageModal = document.getElementById('workflow-extra-stage-modal')
    if (extraStageModal) {
        const createBtn = document.getElementById('workflow-stage-create')
        const cancelBtn = document.getElementById('workflow-stage-cancel')
        const nameInput = document.getElementById('workflow-stage-name')
        const posInput = document.getElementById('workflow-stage-position')

        if (createBtn) {
            createBtn.addEventListener('click', submitWorkflowExtraStage)
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeWorkflowExtraStageModal)
        }
        if (nameInput) {
            nameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') posInput?.focus()
                else if (e.key === 'Escape') closeWorkflowExtraStageModal()
            })
        }
        if (posInput) {
            posInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') submitWorkflowExtraStage()
                else if (e.key === 'Escape') closeWorkflowExtraStageModal()
            })
        }
        extraStageModal.addEventListener('click', (e) => {
            if (e.target === extraStageModal) closeWorkflowExtraStageModal()
        })
    }

    const saveFlowModal = document.getElementById('workflow-save-flow-modal')
    if (saveFlowModal) {
        const createBtn = document.getElementById('workflow-save-create')
        const cancelBtn = document.getElementById('workflow-save-cancel')
        const input = document.getElementById('workflow-save-input')

        if (createBtn) {
            createBtn.addEventListener('click', submitWorkflowSaveFlow)
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeWorkflowSaveFlowModal)
        }
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') submitWorkflowSaveFlow()
                else if (e.key === 'Escape') closeWorkflowSaveFlowModal()
            })
        }
        saveFlowModal.addEventListener('click', (e) => {
            if (e.target === saveFlowModal) closeWorkflowSaveFlowModal()
        })
    }
}

function initWorkflowEngine() {
    workflowRefs.workflowRoots = Array.from(document.querySelectorAll('.workflow'))
    workflowRefs.modelSelect = document.getElementById('workflow-model')
    workflowRefs.templateModelSelect = document.getElementById('workflow-template-model')
    workflowRefs.myStepSelect = document.getElementById('workflow-my-step')
    workflowRefs.templateMyStepSelect = document.getElementById('workflow-template-my-step')
    workflowRefs.focusMode = document.getElementById('workflow-focus-mode')
    workflowRefs.modeDocumentButton = document.getElementById('workflow-mode-document')
    workflowRefs.modeTemplateButton = document.getElementById('workflow-mode-template')
    workflowRefs.templateHub = document.getElementById('workflow-template-hub')
    workflowRefs.templateSteps = document.getElementById('workflow-template-steps')
    workflowRefs.templateContent = document.getElementById('workflow-template-content')
    workflowRefs.templateNewButton = document.getElementById('workflow-template-new-btn')
    workflowRefs.board = document.getElementById('workflow-board')
    workflowRefs.library = document.getElementById('workflow-clause-library')
    workflowRefs.selectedClauses = document.getElementById('workflow-selected-clauses')
    workflowRefs.clauseForm = document.getElementById('workflow-clause-form')
    workflowRefs.documentPreview = document.getElementById('workflow-document-preview')
    workflowRefs.addExtraButton = document.getElementById('workflow-new-extra')
    workflowRefs.addDocumentButton = document.getElementById('workflow-new-document')
    workflowRefs.saveFlowButton = document.getElementById('workflow-save-flow')
    workflowRefs.savedList = document.getElementById('workflow-saved-list')

    if (!workflowRefs.modelSelect && !workflowRefs.templateContent) {
        return
    }

    loadWorkflowSavedFlows()
    ensureWorkflowModelState(workflowState.currentModel)
    workflowState.focusStep = getWorkflowCurrentStages()[0]?.id || null
    workflowState.templateStep = workflowState.focusStep
    setWorkflowMode(workflowState.mode)
    if (workflowRefs.focusMode) {
        workflowRefs.focusMode.checked = workflowState.focusOnlyMine
    }

    renderWorkflowAll()
    bindWorkflowEvents()
}

/*==================== SIGNATURES / ASSINATURAS ====================*/
// Dados mockados de assinaturas
let signatures = [
    {
        id: 'sig-1',
        name: 'Assinatura Profissional',
        fullName: 'João Silva',
        jobTitle: 'Desenvolvedor Senior',
        department: 'Tecnologia',
        email: 'joao.silva@empresa.com.br',
        phone: '+55 (11) 98765-4321',
        image: null,
        isDefault: true
    },
    {
        id: 'sig-2',
        name: 'Assinatura Casual',
        fullName: 'João Silva',
        jobTitle: 'Dev',
        department: 'Tech',
        email: 'joao@empresa.com.br',
        phone: '+55 (11) 98765-4321',
        image: null,
        isDefault: false
    }
]

let currentSignatures = JSON.parse(localStorage.getItem('gediasSignatures')) || signatures
const MAX_SIGNATURES = 10
let pendingNewSignatureId = (currentSignatures.find(sig => sig.isDraft) || {}).id || null

function isSignatureComplete(sig) {
    if (!sig) return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return Boolean(
        sig.name && sig.name.trim() &&
        sig.fullName && sig.fullName.trim() &&
        sig.jobTitle && sig.jobTitle.trim() &&
        sig.department && sig.department.trim() &&
        sig.email && sig.email.trim() && emailRegex.test(sig.email.trim()) &&
        sig.phone && sig.phone.trim()
    )
}

// Renderizar lista de assinaturas
function renderSignaturesList() {
    const list = document.getElementById('signatures-list')
    if (!list) return

    // Ordena com padrão sempre primeiro
    const sorted = [...currentSignatures].sort((a, b) => {
        if (a.isDefault) return -1
        if (b.isDefault) return 1
        return 0
    })

    list.innerHTML = sorted.map(sig => `
        <div class="signature-item ${sig.isDefault ? 'is-active' : ''}" data-sig-id="${sig.id}">
            <div class="signature-item__content">
                <div class="signature-item__name">${sig.name}</div>
                <div class="signature-item__meta">${sig.fullName}</div>
            </div>
            ${sig.isDefault ? '<div class="signature-item__badge"><span class="signature-item__badge-text">Padrão</span></div>' : ''}
        </div>
    `).join('')

    document.querySelectorAll('.signature-item').forEach(item => {
        item.addEventListener('click', () => loadSignature(item.dataset.sigId))
    })
}

// Carregar assinatura para edição
function loadSignature(sigId) {
    const sig = currentSignatures.find(s => s.id === sigId)
    if (!sig) return

    window.currentSignatureId = sigId

    // Atualizar campos
    document.getElementById('signature-name').value = sig.name
    document.getElementById('signature-full-name').value = sig.fullName
    document.getElementById('signature-job-title').value = sig.jobTitle
    document.getElementById('signature-department').value = sig.department
    document.getElementById('signature-email').value = sig.email
    document.getElementById('signature-phone').value = sig.phone
    document.getElementById('signature-default').checked = sig.isDefault

    // Atualizar título
    document.querySelector('.signature-editor-title').textContent = `Editando: ${sig.name}`

    // Mostrar/esconder botão deletar (não pode deletar se é padrão)
    const deleteBtn = document.getElementById('btn-delete-signature')
    if (sig.isDefault) {
        deleteBtn.classList.add('is-hidden')
    } else {
        deleteBtn.classList.remove('is-hidden')
    }

    // Atualizar vizualização
    updateSignaturePreview(sig)

    // Marcar como ativo
    document.querySelectorAll('.signature-item').forEach(item => {
        item.classList.toggle('is-active', item.dataset.sigId === sigId)
    })
}

// Atualizar preview da assinatura
function updateSignaturePreview(sig) {
    const preview = document.getElementById('signature-preview-card')
    if (!preview) return

    const imageHtml = sig.image ? `<div class="signature-preview-image"><img src="${sig.image}" alt="Logo"></div>` : ''

    preview.innerHTML = `
        <div style="display: flex; gap: 0.75rem;">
            ${imageHtml}
            <div class="signature-preview-info">
                <div class="signature-preview-name">${sig.fullName}</div>
                <div class="signature-preview-job">${sig.jobTitle}</div>
                <div class="signature-preview-department">${sig.department}</div>
                <div class="signature-preview-contact">
                    <div class="signature-preview-email"><a href="mailto:${sig.email}">${sig.email}</a></div>
                    <div class="signature-preview-phone">${sig.phone}</div>
                </div>
            </div>
        </div>
    `
}

// Salvar assinatura
function saveSignature() {
    const sigId = window.currentSignatureId
    if (!sigId) return

    const nameInput = document.getElementById('signature-name')
    const fullNameInput = document.getElementById('signature-full-name')
    const jobTitleInput = document.getElementById('signature-job-title')
    const departmentInput = document.getElementById('signature-department')
    const emailInput = document.getElementById('signature-email')
    const phoneInput = document.getElementById('signature-phone')
    const isDefault = document.getElementById('signature-default').checked

    // Limpar erros anteriores
    const inputs = [nameInput, fullNameInput, jobTitleInput, departmentInput, emailInput, phoneInput]
    inputs.forEach(input => input.classList.remove('signature-form-input--error'))

    // Validar campos
    let errors = []
    
    if (!nameInput.value.trim()) {
        errors.push('Nome da assinatura')
        nameInput.classList.add('signature-form-input--error')
    }
    
    if (!fullNameInput.value.trim()) {
        errors.push('Nome completo')
        fullNameInput.classList.add('signature-form-input--error')
    }
    
    if (!jobTitleInput.value.trim()) {
        errors.push('Cargo')
        jobTitleInput.classList.add('signature-form-input--error')
    }
    
    if (!departmentInput.value.trim()) {
        errors.push('Departamento')
        departmentInput.classList.add('signature-form-input--error')
    }
    
    if (!emailInput.value.trim()) {
        errors.push('E-mail')
        emailInput.classList.add('signature-form-input--error')
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(emailInput.value)) {
            errors.push('E-mail inválido')
            emailInput.classList.add('signature-form-input--error')
        }
    }
    
    if (!phoneInput.value.trim()) {
        errors.push('Telefone')
        phoneInput.classList.add('signature-form-input--error')
    }

    if (errors.length > 0) {
        showAlert(`Por favor, preencha: ${errors.join(', ')}`, 'error')
        return
    }

    const sigIndex = currentSignatures.findIndex(s => s.id === sigId)
    if (sigIndex >= 0) {
        // Se marcar como padrão, desmarcar outras
        if (isDefault) {
            currentSignatures.forEach((s, i) => {
                if (i !== sigIndex) s.isDefault = false
            })
        }

        currentSignatures[sigIndex] = {
            ...currentSignatures[sigIndex],
            name: nameInput.value,
            fullName: fullNameInput.value,
            jobTitle: jobTitleInput.value,
            department: departmentInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            isDraft: false,
            isDefault
        }

        if (pendingNewSignatureId === sigId) {
            pendingNewSignatureId = null
        }

        localStorage.setItem('gediasSignatures', JSON.stringify(currentSignatures))
        renderSignaturesList()
        loadSignature(sigId)
        showAlert('Assinatura salva com sucesso', 'success')
    }

    // Remover erro ao digitar
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('signature-form-input--error')
        })
    })
}

// Deletar assinatura
function deleteSignature() {
    const sigId = window.currentSignatureId
    if (!sigId) return

    showConfirmModal('Confirmar exclusão', 'Tem certeza que deseja deletar esta assinatura?', () => {
        if (pendingNewSignatureId === sigId) {
            pendingNewSignatureId = null
        }
        currentSignatures = currentSignatures.filter(s => s.id !== sigId)
        localStorage.setItem('gediasSignatures', JSON.stringify(currentSignatures))
        window.currentSignatureId = null
        document.querySelector('.signature-editor-title').textContent = 'Selecione uma assinatura'
        renderSignaturesList()
        hideConfirmModal()
        showAlert('Assinatura deletada', 'success')
    })
}

// Cancelar edição
function cancelSignatureEdit() {
    window.currentSignatureId = null
    document.querySelector('.signature-editor-title').textContent = 'Selecione uma assinatura'
    document.getElementById('signature-editor-form').reset()
    document.getElementById('btn-delete-signature').classList.add('is-hidden')
    renderSignaturesList()
}

// Criar nova assinatura
function createNewSignature() {
    if (pendingNewSignatureId) {
        const pendingSignature = currentSignatures.find(sig => sig.id === pendingNewSignatureId)
        if (pendingSignature && (pendingSignature.isDraft || !isSignatureComplete(pendingSignature))) {
            showAlert('Salve a nova assinatura com os dados corretos antes de criar outra.', 'error')
            loadSignature(pendingNewSignatureId)
            return
        }
        pendingNewSignatureId = null
    }

    if (currentSignatures.length >= MAX_SIGNATURES) {
        showAlert(`Limite máximo de ${MAX_SIGNATURES} assinaturas atingido.`, 'error')
        return
    }

    const newId = 'sig-' + Date.now()
    const newSig = {
        id: newId,
        name: 'Nova Assinatura',
        fullName: '',
        jobTitle: '',
        department: '',
        email: '',
        phone: '',
        image: null,
        isDraft: true,
        isDefault: false
    }
    
    currentSignatures.push(newSig)
    pendingNewSignatureId = newId
    localStorage.setItem('gediasSignatures', JSON.stringify(currentSignatures))
    renderSignaturesList()
    loadSignature(newId)
    
    // Scroll suave até o editor
    const editorPanel = document.getElementById('signature-editor-panel')
    if (editorPanel) {
        const contentScroller = document.querySelector('.content')
        if (contentScroller) {
            const scrollerRect = contentScroller.getBoundingClientRect()
            const panelRect = editorPanel.getBoundingClientRect()
            const targetTop = contentScroller.scrollTop + (panelRect.top - scrollerRect.top) - 12
            contentScroller.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
        } else {
            editorPanel.scrollIntoView({ behavior: 'smooth', block: 'start' })
            window.scrollBy({ top: -12, left: 0, behavior: 'smooth' })
        }
    }
}

// Obter assinatura padrão
function getDefaultSignature() {
    return currentSignatures.find(s => s.isDefault)
}

// Inicializar eventos das assinaturas
function setupSignaturesEvents() {
    const newBtn = document.getElementById('btn-new-signature')
    const saveBtn = document.getElementById('btn-save-signature')
    const deleteBtn = document.getElementById('btn-delete-signature')
    const cancelBtn = document.getElementById('btn-cancel-signature')

    if (newBtn) newBtn.addEventListener('click', createNewSignature)
    if (saveBtn) saveBtn.addEventListener('click', saveSignature)
    if (deleteBtn) deleteBtn.addEventListener('click', deleteSignature)
    if (cancelBtn) cancelBtn.addEventListener('click', cancelSignatureEdit)

    renderSignaturesList()
}

// Quando página de assinaturas for carregada
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('signatures-list')) {
        setupSignaturesEvents()
    }
})

// Função para mostrar alerta
function showAlert(message, type = 'info') {
    const alertBox = document.createElement('div')
    alertBox.className = `alert alert--${type}`
    alertBox.textContent = message
    alertBox.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'error' ? '#dc2626' : type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.45rem;
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `
    document.body.appendChild(alertBox)
    
    setTimeout(() => {
        alertBox.style.animation = 'slideOut 0.3s ease-out'
        setTimeout(() => alertBox.remove(), 300)
    }, 3000)
}

// Funções de Modal de Confirmação
function showConfirmModal(title, message, onConfirm) {
    const modal = document.getElementById('confirm-modal')
    const titleEl = document.getElementById('confirm-modal-title')
    const messageEl = document.getElementById('confirm-modal-message')
    const confirmBtn = document.getElementById('confirm-modal-confirm')
    const cancelBtn = document.getElementById('confirm-modal-cancel')
    const closeBtn = document.getElementById('confirm-modal-close')

    titleEl.textContent = title
    messageEl.textContent = message

    const handleConfirm = () => {
        onConfirm()
        cleanup()
    }

    const cleanup = () => {
        confirmBtn.removeEventListener('click', handleConfirm)
        cancelBtn.removeEventListener('click', cleanup)
        closeBtn.removeEventListener('click', cleanup)
        modal.classList.add('is-hidden')
    }

    confirmBtn.addEventListener('click', handleConfirm)
    cancelBtn.addEventListener('click', cleanup)
    closeBtn.addEventListener('click', cleanup)

    modal.classList.remove('is-hidden')
}

function hideConfirmModal() {
    const modal = document.getElementById('confirm-modal')
    modal.classList.add('is-hidden')
}

initWorkflowEngine()

/*==================== ATTACHMENT MODAL FUNCTIONALITY ====================*/

/**
 * Attachment Modal Module
 * Handles file selection with navigation, filters, and multiple selections
 */
const AttachmentModal = (() => {
    // State
    const state = {
        currentFolderId: 'root',
        selectedFiles: new Set(),
        showDeletedFiles: false,
        quickFilters: {
            recent: false,
            favorites: false
        },
        dateFilter: {
            mode: '',
            customFrom: null,
            customTo: null
        },
        breadcrumb: []
    }

    // File type icons
    const fileTypeIcon = {
        folder: 'bxs-folder',
        pdf: 'bxs-file-pdf',
        doc: 'bxs-file-doc',
        default: 'bxs-file'
    }

    let attachmentCallback
    let closeCallback

    /**
     * Initialize the attachment modal
     */
    function init(onAddCallback, onCloseCallback) {
        attachmentCallback = onAddCallback
        closeCallback = onCloseCallback

        // Reset state
        state.currentFolderId = 'root'
        state.selectedFiles.clear()
        state.showDeletedFiles = false
        state.breadcrumb = []
        state.quickFilters = { recent: false, favorites: false }
        state.dateFilter = { mode: '', customFrom: null, customTo: null }

        // Initialize UI
        setupFilters()
        updatePageView()
        renderFilesList(getFilteredFiles())
        setupEventListeners()
        updateQuickFilterButtons()

        console.log('Attachment Modal initialized')
    }

    /**
     * Setup filter select options
     */
    function setupFilters() {
        const accessFilter = document.getElementById('attachment-filter-access')
        const typeFilter = document.getElementById('attachment-filter-type')
        const locationFilter = document.getElementById('attachment-filter-location')
        const modifiedFilter = document.getElementById('attachment-filter-modified')

        renderSelectOptions(accessFilter, 'Acesso', mockTodosArquivosData.accessOptions)
        renderSelectOptions(typeFilter, 'Tipo', mockTodosArquivosData.typeOptions)
        renderSelectOptions(locationFilter, 'Local', mockTodosArquivosData.locationOptions)
        renderSelectOptions(modifiedFilter, 'Modificado', mockTodosArquivosData.modifiedOptions)
    }

    /**
     * Render select options
     */
    function renderSelectOptions(selectElement, placeholder, options) {
        if (!selectElement) return

        selectElement.innerHTML = ''
        const defaultOption = document.createElement('option')
        defaultOption.value = ''
        defaultOption.textContent = placeholder
        selectElement.appendChild(defaultOption)

        options.forEach((option) => {
            const item = document.createElement('option')
            item.value = option
            item.textContent = option
            selectElement.appendChild(item)
        })
    }

    /**
     * Get current folder items
     */
    function getCurrentFolderItems() {
        const currentFolder = mockTodosArquivosData.folders[state.currentFolderId]
        if (!currentFolder) return []
        if (state.showDeletedFiles) return currentFolder.items
        return currentFolder.items.filter(item => !item.isDeleted)
    }

    /**
     * Create file row element
     */
    function createFileRow(file) {
        const row = document.createElement('div')
        row.className = 'files-list__row'
        row.setAttribute('role', 'row')
        row.setAttribute('data-file-id', file.id)

        if (file.type === 'folder') {
            row.setAttribute('data-folder-id', file.id)
            row.style.cursor = 'pointer'
        }

        const iconClass = file.type === 'folder' ? fileTypeIcon.folder : (fileTypeIcon[file.type] || fileTypeIcon.default)

        const checkedAttr = state.selectedFiles.has(file.id) ? 'checked' : ''
        const isFolder = file.type === 'folder'

        row.innerHTML = `
            <span class="files-list__select">
                ${isFolder ? '<div style="width: 24px;"></div>' : `<input type="checkbox" class="files-list__checkbox attachment-file-checkbox" data-file-id="${file.id}" ${checkedAttr} aria-label="Selecionar ${file.name}" />`}
            </span>
            <span class="files-list__name"><i class='bx ${iconClass}'></i> ${file.name}</span>
            <span>${file.lastModified}</span>
            <span>${file.size}${file.itemCount ? ' (' + file.itemCount + ' itens)' : ''}</span>
            <span>${file.access}</span>
            <span>${file.location}</span>
        `

        return row
    }

    /**
     * Render files list
     */
    function renderFilesList(items) {
        const filesBody = document.getElementById('attachment-files-list-body')
        if (!filesBody) return

        filesBody.innerHTML = ''

        if (!items.length) {
            const emptyRow = document.createElement('div')
            emptyRow.className = 'files-list__row files-list__row--empty'
            emptyRow.setAttribute('role', 'row')
            emptyRow.textContent = 'Nenhum item encontrado com os filtros selecionados.'
            filesBody.appendChild(emptyRow)
            return
        }

        items.forEach((file) => {
            filesBody.appendChild(createFileRow(file))
        })

        // Add event listeners
        addFileRowListeners()
    }

    /**
     * Add event listeners to file rows
     */
    function addFileRowListeners() {
        const filesBody = document.getElementById('attachment-files-list-body')
        if (!filesBody) return

        // Folder navigation
        filesBody.addEventListener('click', (e) => {
            const folderRow = e.target.closest('.files-list__row[data-folder-id]')
            if (folderRow && !e.target.closest('.files-list__select')) {
                const folderId = folderRow.dataset.folderId
                navigateToFolder(folderId)
            }
        })

        // File row checkbox activation (click anywhere on the row to toggle checkbox)
        filesBody.addEventListener('click', (e) => {
            const fileRow = e.target.closest('.files-list__row')
            if (!fileRow) return

            // Skip if it's a folder row or clicking on select/checkbox area
            if (fileRow.hasAttribute('data-folder-id') || e.target.closest('.files-list__select')) {
                return
            }

            // Skip if clicking directly on the checkbox (it will handle itself)
            if (e.target.closest('.attachment-file-checkbox')) {
                return
            }

            // Toggle the checkbox for file rows
            const checkbox = fileRow.querySelector('.attachment-file-checkbox')
            if (checkbox) {
                checkbox.checked = !checkbox.checked
                checkbox.dispatchEvent(new Event('change', { bubbles: true }))
            }
        })

        // Checkbox handling
        filesBody.addEventListener('change', (e) => {
            const checkbox = e.target.closest('.attachment-file-checkbox')
            if (!checkbox) return

            const fileId = checkbox.dataset.fileId
            if (checkbox.checked) {
                state.selectedFiles.add(fileId)
            } else {
                state.selectedFiles.delete(fileId)
            }
            updateSelectionModeUI()
        })
    }

    /**
     * Navigate to folder
     */
    function navigateToFolder(folderId) {
        if (!mockTodosArquivosData.folders[folderId]) return

        state.currentFolderId = folderId
        state.selectedFiles.clear()
        state.showDeletedFiles = false

        // Update breadcrumb
        if (folderId === 'root') {
            state.breadcrumb = []
        } else {
            if (folderId.split('-').length === 2) {
                state.breadcrumb = [folderId]
            } else if (folderId.includes('folder-teste-teste')) {
                state.breadcrumb = ['folder-teste', 'folder-teste-teste']
            }
        }

        updatePageView()
        renderBreadcrumb()
        renderFilesList(getFilteredFiles())
        updateSelectionModeUI()
    }

    /**
     * Render breadcrumb
     */
    function renderBreadcrumb() {
        const breadcrumbContainer = document.getElementById('attachment-breadcrumb-container')
        const folderTitle = document.getElementById('attachment-folder-title')
        if (!breadcrumbContainer || !folderTitle) return

        const isRoot = state.currentFolderId === 'root'
        if (isRoot) {
            breadcrumbContainer.innerHTML = ''
            folderTitle.textContent = ''
            return
        }

        const breadcrumbItems = ['root', ...state.breadcrumb]
        const breadcrumbHTML = breadcrumbItems.map((folderId, index) => {
            const folder = mockTodosArquivosData.folders[folderId]
            const isLast = index === breadcrumbItems.length - 1
            if (isLast) {
                return `<span class="breadcrumb__item">${folder.name}</span>`
            }
            return `
                <span class="breadcrumb__item">
                    <a href="#" class="breadcrumb__link" data-folder-id="${folderId}">${folder.name}</a>
                    <span class="breadcrumb__separator">/</span>
                </span>
            `
        }).join('')

        breadcrumbContainer.innerHTML = breadcrumbHTML
        const currentFolder = mockTodosArquivosData.folders[state.currentFolderId]
        folderTitle.textContent = currentFolder.name

        breadcrumbContainer.querySelectorAll('.breadcrumb__link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault()
                const folderId = e.target.getAttribute('data-folder-id')
                navigateToFolder(folderId)
            })
        })
    }

    /**
     * Update page view (show/hide elements based on current location)
     */
    function updatePageView() {
        const isRoot = state.currentFolderId === 'root'
        const rootToolbar = document.getElementById('attachment-root-toolbar')
        const folderNavigation = document.getElementById('attachment-folder-navigation')
        const filtersSection = document.querySelector('#attachment-modal .filters')
        const quickFilters = document.querySelector('#attachment-modal .files-quick-filters')

        if (rootToolbar) rootToolbar.classList.toggle('is-hidden', !isRoot)
        if (folderNavigation) folderNavigation.classList.toggle('is-hidden', isRoot)
        if (filtersSection) filtersSection.classList.toggle('is-hidden', !isRoot)
        if (quickFilters && state.selectedFiles.size === 0) {
            quickFilters.classList.toggle('is-hidden', !isRoot)
        }
    }

    /**
     * Get filtered files based on search and filters
     */
    function getFilteredFiles() {
        const searchInput = document.getElementById('attachment-files-search')
        const accessFilter = document.getElementById('attachment-filter-access')
        const typeFilter = document.getElementById('attachment-filter-type')
        const locationFilter = document.getElementById('attachment-filter-location')

        const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : ''
        const accessValue = accessFilter ? accessFilter.value : ''
        const typeValue = typeFilter ? typeFilter.value : ''
        const locationValue = locationFilter ? locationFilter.value : ''
        const recentEnabled = state.quickFilters.recent
        const favoritesEnabled = state.quickFilters.favorites

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return getCurrentFolderItems().filter((file) => {
            const matchesSearch = !searchValue || file.name.toLowerCase().includes(searchValue)
            const matchesAccess = !accessValue || file.access === accessValue
            const matchesType = !typeValue || file.fileType === typeValue
            const matchesLocation = !locationValue || file.location === locationValue
            const matchesRecent = !recentEnabled || file.isRecent
            const matchesFavorites = !favoritesEnabled || file.isFavorite

            let matchesDate = true
            if (state.dateFilter.mode === 'Hoje') {
                const fileDate = new Date(file.modifiedDate)
                fileDate.setHours(0, 0, 0, 0)
                matchesDate = fileDate.getTime() === today.getTime()
            } else if (state.dateFilter.mode === 'Últimos 7 dias') {
                const sevenDaysAgo = new Date(today)
                sevenDaysAgo.setDate(today.getDate() - 7)
                matchesDate = file.modifiedDate >= sevenDaysAgo
            } else if (state.dateFilter.mode === 'Últimos 30 dias') {
                const thirtyDaysAgo = new Date(today)
                thirtyDaysAgo.setDate(today.getDate() - 30)
                matchesDate = file.modifiedDate >= thirtyDaysAgo
            } else if (state.dateFilter.mode === 'custom' && (state.dateFilter.customFrom || state.dateFilter.customTo)) {
                if (state.dateFilter.customFrom && state.dateFilter.customTo) {
                    matchesDate = file.modifiedDate >= state.dateFilter.customFrom && file.modifiedDate <= state.dateFilter.customTo
                } else if (state.dateFilter.customFrom) {
                    matchesDate = file.modifiedDate >= state.dateFilter.customFrom
                } else if (state.dateFilter.customTo) {
                    matchesDate = file.modifiedDate <= state.dateFilter.customTo
                }
            }

            return matchesSearch && matchesAccess && matchesType && matchesLocation && matchesRecent && matchesFavorites && matchesDate
        })
    }

    /**
     * Update selection mode UI (enable/disable buttons, update checkboxes)
     */
    function updateSelectionModeUI() {
        const attachmentModalAdd = document.getElementById('attachment-modal-add')
        const masterCheckbox = document.getElementById('attachment-select-all-files')
        const filesList = document.querySelector('#attachment-modal .files-list')

        const hasSelection = state.selectedFiles.size > 0
        if (attachmentModalAdd) {
            attachmentModalAdd.disabled = !hasSelection
        }

        if (filesList) {
            filesList.classList.toggle('has-selection', hasSelection)
        }

        if (masterCheckbox) {
            const selectableItems = getCurrentFolderItems().filter(item => !item.isDeleted && item.type !== 'folder')
            const allItemsCount = selectableItems.length
            masterCheckbox.checked = hasSelection && state.selectedFiles.size === allItemsCount
            masterCheckbox.indeterminate = hasSelection && state.selectedFiles.size < allItemsCount
        }
    }

    /**
     * Update quick filter buttons state
     */
    function updateQuickFilterButtons() {
        const recentButton = document.getElementById('attachment-filter-recent')
        const favoritesButton = document.getElementById('attachment-filter-favorites')

        if (recentButton) {
            recentButton.classList.toggle('is-active', state.quickFilters.recent)
            recentButton.setAttribute('aria-pressed', String(state.quickFilters.recent))
        }
        if (favoritesButton) {
            favoritesButton.classList.toggle('is-active', state.quickFilters.favorites)
            favoritesButton.setAttribute('aria-pressed', String(state.quickFilters.favorites))
        }
    }

    /**
     * Setup all event listeners
     */
    function setupEventListeners() {
        // Close button
        const closeBtn = document.getElementById('attachment-modal-close')
        const cancelBtn = document.getElementById('attachment-modal-cancel')
        const addBtn = document.getElementById('attachment-modal-add')

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal)
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeModal)
        }
        if (addBtn) {
            addBtn.addEventListener('click', handleAddAttachments)
        }

        // Close on escape
        document.addEventListener('keydown', (e) => {
            const attachmentModal = document.getElementById('attachment-modal')
            if (e.key === 'Escape' && attachmentModal && attachmentModal.classList.contains('is-open')) {
                closeModal()
            }
        })

        // Search and filters
        const searchInput = document.getElementById('attachment-files-search')
        const accessFilter = document.getElementById('attachment-filter-access')
        const typeFilter = document.getElementById('attachment-filter-type')
        const locationFilter = document.getElementById('attachment-filter-location')
        const modifiedFilter = document.getElementById('attachment-filter-modified')

        ;[searchInput, accessFilter, typeFilter, locationFilter].forEach((element) => {
            if (!element) return
            element.addEventListener('input', () => {
                renderFilesList(getFilteredFiles())
            })
            element.addEventListener('change', () => {
                renderFilesList(getFilteredFiles())
            })
        })

        if (modifiedFilter) {
            modifiedFilter.addEventListener('change', (event) => {
                const value = event.target.value
                const dateRangePicker = document.getElementById('attachment-date-range-picker')

                if (value === 'Personalizado') {
                    if (dateRangePicker) dateRangePicker.classList.remove('is-hidden')
                } else {
                    if (dateRangePicker) dateRangePicker.classList.add('is-hidden')
                    state.dateFilter.mode = value
                    state.dateFilter.customFrom = null
                    state.dateFilter.customTo = null
                    renderFilesList(getFilteredFiles())
                }
            })
        }

        // Date range
        const dateRangeCancel = document.getElementById('attachment-date-range-cancel')
        const dateRangeApply = document.getElementById('attachment-date-range-apply')
        const dateFrom = document.getElementById('attachment-date-from')
        const dateTo = document.getElementById('attachment-date-to')
        const dateRangePicker = document.getElementById('attachment-date-range-picker')

        if (dateRangeCancel) {
            dateRangeCancel.addEventListener('click', () => {
                if (dateRangePicker) dateRangePicker.classList.add('is-hidden')
                if (modifiedFilter) modifiedFilter.value = ''
                if (dateFrom) dateFrom.value = ''
                if (dateTo) dateTo.value = ''
                state.dateFilter.mode = ''
                state.dateFilter.customFrom = null
                state.dateFilter.customTo = null
                renderFilesList(getFilteredFiles())
            })
        }

        if (dateRangeApply) {
            dateRangeApply.addEventListener('click', () => {
                const fromValue = dateFrom ? dateFrom.value : ''
                const toValue = dateTo ? dateTo.value : ''

                state.dateFilter.mode = 'custom'
                state.dateFilter.customFrom = fromValue ? new Date(fromValue) : null
                state.dateFilter.customTo = toValue ? new Date(toValue) : null

                if (dateRangePicker) dateRangePicker.classList.add('is-hidden')
                renderFilesList(getFilteredFiles())
            })
        }

        // Quick filters
        const recentBtn = document.getElementById('attachment-filter-recent')
        const favoritesBtn = document.getElementById('attachment-filter-favorites')

        if (recentBtn) {
            recentBtn.addEventListener('click', () => {
                state.quickFilters.recent = !state.quickFilters.recent
                updateQuickFilterButtons()
                renderFilesList(getFilteredFiles())
            })
        }
        if (favoritesBtn) {
            favoritesBtn.addEventListener('click', () => {
                state.quickFilters.favorites = !state.quickFilters.favorites
                updateQuickFilterButtons()
                renderFilesList(getFilteredFiles())
            })
        }

        // Master checkbox
        const masterCheckbox = document.getElementById('attachment-select-all-files')
        if (masterCheckbox) {
            masterCheckbox.addEventListener('change', (event) => {
                const isChecked = event.target.checked
                const currentItems = getCurrentFolderItems().filter(item => item.type !== 'folder')

                if (isChecked) {
                    currentItems.forEach((file) => {
                        if (!file.isDeleted) {
                            state.selectedFiles.add(file.id)
                        }
                    })
                } else {
                    state.selectedFiles.clear()
                }

                const allCheckboxes = document.querySelectorAll('#attachment-modal .attachment-file-checkbox')
                allCheckboxes.forEach((checkbox) => {
                    const fileId = checkbox.dataset.fileId
                    checkbox.checked = state.selectedFiles.has(fileId)
                })

                updateSelectionModeUI()
            })
        }
    }

    /**
     * Handle add attachments
     */
    function handleAddAttachments() {
        if (state.selectedFiles.size === 0) return

        // Get selected files data
        const currentFolder = mockTodosArquivosData.folders[state.currentFolderId]
        if (!currentFolder) return

        state.selectedFiles.forEach(fileId => {
            const file = currentFolder.items.find(item => item.id === fileId)
            if (file && file.type !== 'folder') {
                attachmentCallback({
                    id: file.id,
                    name: file.name,
                    size: parseSize(file.size)
                })
            }
        })

        closeModal()
    }

    /**
     * Parse size string to bytes
     */
    function parseSize(sizeStr) {
        const parts = sizeStr.trim().split(' ')
        const value = parseFloat(parts[0])
        const unit = parts[1] || 'B'
        const units = { 'B': 1, 'KB': 1024, 'MB': 1024 * 1024, 'GB': 1024 * 1024 * 1024 }
        return value * (units[unit] || 1)
    }

    /**
     * Close modal
     */
    function closeModal() {
        const attachmentModal = document.getElementById('attachment-modal')
        if (attachmentModal) {
            attachmentModal.classList.remove('is-open')
        }
        if (closeCallback) closeCallback()
    }

    return {
        init
    }
})()


/*==================== MERGED: workflow-documents-page.js ====================*/
const docWorkflowModels = {
    'prestacao-servicos': { skip: [] },
    franquia: { skip: [], extra: [{ pos: 2.1, nome: 'Due Diligence + COF' }] },
    nda: { skip: [3, 5, 7] },
    collab: { skip: [5] },
    comodato: { skip: [7] },
    'dist-internacional': { skip: [], extra: [{ pos: 2.1, nome: 'Due Diligence Internacional' }] },
    empreitada: { skip: [] },
    fornecimento: { skip: [7] },
    'franquia-internacional': { skip: [], extra: [{ pos: 2.1, nome: 'Due Diligence Internacional' }] },
    aditamento: { skip: [1, 3, 7] },
    'compra-venda-equip': { skip: [] },
    'locacao-equip': { skip: [] },
    'locacao-imovel': { skip: [], extra: [{ pos: 2.1, nome: 'Vistoria' }] },
    distrato: { skip: [1, 2, 3, 5, 7] },
    rescisao: { skip: [1, 2, 3, 5, 7] },
    'representacao-comercial': { skip: [] },
    transporte: { skip: [4, 5] },
    cessao: { skip: [3, 5, 7] },
    influencers: { skip: [5] }
}

const docWorkflowDefaultSteps = [
    { id: 1, nome: 'Solicitacao / Inicio' },
    { id: 2, nome: 'Elaboracao / Edicao' },
    { id: 3, nome: 'Revisao Tecnica / Validacao' },
    { id: 4, nome: 'Revisao Juridica' },
    { id: 5, nome: 'Aprovacao Orcamentaria' },
    { id: 6, nome: 'Aprovacao Gerencial' },
    { id: 7, nome: 'Negociacao / Ajustes' },
    { id: 8, nome: 'Assinatura Digital' },
    { id: 9, nome: 'Execucao / Publicacao' }
]

const docWorkflowAccessProfiles = {
    colaborador: { label: 'Colaborador', allowedBaseSteps: [1, 2, 3, 7], fieldLimit: 3 },
    gerente: { label: 'Gerente', allowedBaseSteps: [2, 3, 4, 6, 7, 8], fieldLimit: 5 },
    gestor: { label: 'Gestor', allowedBaseSteps: 'all', fieldLimit: 7 }
}

const docWorkflowState = {
    selectedAccess: 'gestor',
    selectedDocumentId: '',
    currentStepIndex: 0,
    stepValuesByDocument: {},
    stepStatusByDocument: {},
    datePickerMonthByField: {},
    initialized: false
}

const docWorkflowScenariosByAccess = {
    colaborador: [
        {
            id: 'doc-col-001',
            model: 'nda',
            nome: 'NDA - Projeto Orion',
            status: 'Pendente',
            prazo: 'Hoje',
            pessoas: [
                { nome: 'Ana Costa', perfil: 'Colaborador', dados: ['Nome da Contratada', 'CNPJ', 'Nome do Projeto'] },
                { nome: 'Bruno Silva', perfil: 'Gerente', dados: ['Aprovacao de escopo'] }
            ]
        },
        {
            id: 'doc-col-002',
            model: 'prestacao-servicos',
            nome: 'Prestacao de Servicos - ACME',
            status: 'Aguardando inicio',
            prazo: 'Amanha',
            pessoas: [
                { nome: 'Ana Costa', perfil: 'Colaborador', dados: ['Dados da Contratada', 'Tipo de Servico'] },
                { nome: 'Carla Souza', perfil: 'Gestor', dados: ['Aprovacao final'] }
            ]
        }
    ],
    gerente: [
        {
            id: 'doc-ger-001',
            model: 'franquia',
            nome: 'Franquia - Unidade Centro',
            status: 'Pendente',
            prazo: 'Hoje',
            pessoas: [
                { nome: 'Bruno Silva', perfil: 'Gerente', dados: ['Due Diligence', 'Dados societarios', 'Taxa inicial'] },
                { nome: 'Carla Souza', perfil: 'Gestor', dados: ['Aprovacao gerencial'] }
            ]
        },
        {
            id: 'doc-ger-002',
            model: 'fornecimento',
            nome: 'Fornecimento - Temporada Q2',
            status: 'Pendente',
            prazo: 'Em 2 dias',
            pessoas: [
                { nome: 'Bruno Silva', perfil: 'Gerente', dados: ['Condicoes comerciais', 'Prazo de entrega'] },
                { nome: 'Diego Almeida', perfil: 'Colaborador', dados: ['Cadastro de fornecedor'] }
            ]
        }
    ],
    gestor: [
        {
            id: 'doc-ges-001',
            model: 'prestacao-servicos',
            nome: 'Prestacao de Servicos - Consultoria Global',
            status: 'Pendente',
            prazo: 'Hoje',
            pessoas: [
                { nome: 'Carla Souza', perfil: 'Gestor', dados: ['Escopo final', 'Valor total', 'Aprovacao executiva'] },
                { nome: 'Bruno Silva', perfil: 'Gerente', dados: ['Validacao juridica'] }
            ]
        },
        {
            id: 'doc-ges-002',
            model: 'locacao-imovel',
            nome: 'Locacao de Imovel - Loja Sul',
            status: 'Aguardando inicio',
            prazo: 'Em 3 dias',
            pessoas: [
                { nome: 'Carla Souza', perfil: 'Gestor', dados: ['Prazo de locacao', 'Valor mensal', 'Dados do locador'] },
                { nome: 'Elaine Martins', perfil: 'Gestor', dados: ['Validacao financeira'] }
            ]
        }
    ]
}

function formatDocWorkflowModelLabel(modelKey) {
    return modelKey
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
}

function getDocWorkflowModelFields(modelKey) {
    try {
        if (typeof workflowModelFieldCatalog !== 'undefined' && workflowModelFieldCatalog[modelKey]?.fields) {
            return workflowModelFieldCatalog[modelKey].fields
        }
    } catch (error) {
    }

    return ['Nome', 'Documento', 'Dados contratuais', 'Aprovacao interna', 'Representante', 'Data de vigencia']
}

function escapeDocHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

function getDocWorkflowStepsForModel(modelKey) {
    const model = docWorkflowModels[modelKey] || { skip: [] }
    const steps = docWorkflowDefaultSteps.filter((step) => !(model.skip || []).includes(step.id))

    if (Array.isArray(model.extra)) {
        model.extra.forEach((extra) => {
            const [beforeId] = String(extra.pos).split('.')
            const idx = steps.findIndex((step) => String(step.id) === beforeId)
            if (idx !== -1) {
                steps.splice(idx + 1, 0, { id: Number(extra.pos), nome: extra.nome })
            }
        })
    }

    return steps.sort((a, b) => Number(a.id) - Number(b.id))
}

function getDocWorkflowStepsForAccess(modelKey, accessKey) {
    const profile = docWorkflowAccessProfiles[accessKey] || docWorkflowAccessProfiles.gestor
    const modelSteps = getDocWorkflowStepsForModel(modelKey)

    if (profile.allowedBaseSteps === 'all') {
        return modelSteps
    }

    const allowed = new Set(profile.allowedBaseSteps.map(Number))
    return modelSteps.filter((step) => allowed.has(Math.floor(Number(step.id))))
}

function getDocWorkflowPendingDocuments(accessKey) {
    const source = docWorkflowScenariosByAccess[accessKey] || docWorkflowScenariosByAccess.gestor
    return source.map((item) => ({ ...item, pessoas: item.pessoas.map((person) => ({ ...person, dados: [...person.dados] })) }))
}

function getDocFieldKey(documentId, stepId, fieldName) {
    return `${documentId}::${stepId}::${fieldName}`
}

function formatDisplayDate(isoDate) {
    const value = String(isoDate || '').trim()
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return ''
    }

    const [year, month, day] = value.split('-')
    return `${day}/${month}/${year}`
}

function getDatePickerViewDate(documentId, stepId, fieldName, selectedValue) {
    const fieldKey = getDocFieldKey(documentId, stepId, fieldName)
    const storedValue = docWorkflowState.datePickerMonthByField[fieldKey]
    if (storedValue instanceof Date) {
        return storedValue
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(String(selectedValue || ''))) {
        const date = new Date(`${selectedValue}T00:00:00`)
        return new Date(date.getFullYear(), date.getMonth(), 1)
    }

    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
}

function getMonthLabel(date) {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

function getCalendarCells(date) {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startWeekDay = (firstDay.getDay() + 6) % 7

    const cells = []
    for (let index = 0; index < startWeekDay; index += 1) {
        cells.push({ day: '', iso: '', isCurrentMonth: false })
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        cells.push({ day: String(day), iso, isCurrentMonth: true })
    }

    while (cells.length % 7 !== 0) {
        cells.push({ day: '', iso: '', isCurrentMonth: false })
    }

    return cells
}

function buildDatePickerPopover(documentId, stepId, fieldName, selectedValue) {
    const viewDate = getDatePickerViewDate(documentId, stepId, fieldName, selectedValue)
    const monthLabel = getMonthLabel(viewDate)
    const cells = getCalendarCells(viewDate)

    const daysHeader = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']
        .map((label) => `<span class="workflow__datepicker-weekday">${label}</span>`)
        .join('')

    const daysGrid = cells.map((cell) => {
        if (!cell.isCurrentMonth) {
            return '<span class="workflow__datepicker-day is-empty"></span>'
        }

        const isSelected = cell.iso === selectedValue
        return `<button type="button" class="workflow__datepicker-day ${isSelected ? 'is-selected' : ''}" data-doc-date-day="${cell.iso}" data-doc-field="${fieldName}" data-step-id="${stepId}">${cell.day}</button>`
    }).join('')

    return `
        <div class="workflow__datepicker-popover is-hidden" data-doc-date-popover data-doc-field="${fieldName}" data-step-id="${stepId}">
            <div class="workflow__datepicker-header">
                <button type="button" class="workflow__datepicker-nav" data-doc-date-nav="prev" data-doc-field="${fieldName}" data-step-id="${stepId}">◀</button>
                <span class="workflow__datepicker-month">${monthLabel}</span>
                <button type="button" class="workflow__datepicker-nav" data-doc-date-nav="next" data-doc-field="${fieldName}" data-step-id="${stepId}">▶</button>
            </div>
            <div class="workflow__datepicker-grid">${daysHeader}${daysGrid}</div>
        </div>
    `
}

function getDocStepFieldDefinitions(step, documentItem) {
    const stepId = Math.floor(Number(step?.id || 0))
    const modelLabel = formatDocWorkflowModelLabel(documentItem?.model || 'documento')

    if (stepId === 1) {
        return [
            { name: 'titulo', label: `Titulo do ${modelLabel}`, type: 'text', required: true, placeholder: 'Informe o titulo do documento' },
            { name: 'dataSolicitacao', label: 'Data da solicitacao', type: 'date', required: true }
        ]
    }

    if (stepId === 2) {
        return [
            { name: 'resumo', label: 'Resumo da elaboracao', type: 'textarea', required: true, placeholder: 'Descreva o que foi elaborado nesta etapa' },
            { name: 'responsavel', label: 'Responsavel da etapa', type: 'text', required: true, placeholder: 'Nome do responsavel' }
        ]
    }

    if (stepId === 3 || stepId === 4 || stepId === 7) {
        return [
            { name: 'analise', label: 'Analise da etapa', type: 'textarea', required: true, placeholder: 'Detalhe validacoes, ajustes ou negociacoes' }
        ]
    }

    if (stepId === 5) {
        return [
            { name: 'valorAprovado', label: 'Valor aprovado (R$)', type: 'number', required: true, min: 0.01, step: '0.01', placeholder: '0,00' },
            { name: 'centroCusto', label: 'Centro de custo', type: 'text', required: true, placeholder: 'Ex: CC-2026-01' }
        ]
    }

    if (stepId === 6) {
        return [
            { name: 'decisaoGerencial', label: 'Decisao gerencial', type: 'select', required: true, options: ['Aprovado', 'Aprovado com ressalvas', 'Reprovado'] },
            { name: 'dataDecisao', label: 'Data da decisao', type: 'date', required: true }
        ]
    }

    if (stepId === 8) {
        return [
            { name: 'metodoAssinatura', label: 'Metodo de assinatura', type: 'select', required: true, options: ['Assinatura eletrônica', 'Assinatura digital ICP-Brasil'] },
            { name: 'dataAssinatura', label: 'Data prevista da assinatura', type: 'date', required: true }
        ]
    }

    if (stepId === 9) {
        return [
            { name: 'dataPublicacao', label: 'Data de execucao/publicacao', type: 'date', required: true },
            { name: 'observacoesFinais', label: 'Observacoes finais', type: 'textarea', required: false, placeholder: 'Observacoes de encerramento' }
        ]
    }

    return [
        { name: 'observacao', label: 'Informacoes da etapa', type: 'textarea', required: true, placeholder: 'Registre as informacoes desta etapa' }
    ]
}

function renderDocStepField(field, value, stepId, documentId) {
    const safeValue = escapeDocHtml(value)
    const commonAttrs = `data-doc-field="${field.name}" data-step-id="${stepId}" ${field.required ? 'data-required="true"' : ''}`

    if (field.type === 'textarea') {
        return `
            <div class="workflow__wizard-form-field">
                <label class="workflow__template-label" for="field-${field.name}">${field.label}</label>
                <textarea id="field-${field.name}" class="workflow__wizard-textarea" ${commonAttrs} placeholder="${escapeDocHtml(field.placeholder || '')}">${safeValue}</textarea>
            </div>
        `
    }

    if (field.type === 'select') {
        const options = ['<option value="">Selecione</option>', ...(field.options || []).map((option) => `<option value="${escapeDocHtml(option)}" ${option === value ? 'selected' : ''}>${escapeDocHtml(option)}</option>`)].join('')
        return `
            <div class="workflow__wizard-form-field">
                <label class="workflow__template-label" for="field-${field.name}">${field.label}</label>
                <select id="field-${field.name}" class="workflow__wizard-input" ${commonAttrs}>${options}</select>
            </div>
        `
    }

    if (field.type === 'date') {
        const displayValue = formatDisplayDate(value)
        return `
            <div class="workflow__wizard-form-field">
                <label class="workflow__template-label" for="field-${field.name}">${field.label}</label>
                <div class="workflow__datepicker-wrap">
                    <input id="field-${field.name}" class="workflow__wizard-input workflow__wizard-input--date" type="text" ${commonAttrs} data-doc-date-input data-doc-field="${field.name}" data-step-id="${stepId}" value="${escapeDocHtml(displayValue)}" placeholder="Selecione uma data" readonly>
                    ${buildDatePickerPopover(documentId, stepId, field.name, String(value || ''))}
                </div>
            </div>
        `
    }

    const type = field.type === 'number' ? 'number' : 'text'
    const minAttr = field.min !== undefined ? `min="${field.min}"` : ''
    const stepAttr = field.step ? `step="${field.step}"` : ''
    return `
        <div class="workflow__wizard-form-field">
            <label class="workflow__template-label" for="field-${field.name}">${field.label}</label>
            <input id="field-${field.name}" class="workflow__wizard-input" type="${type}" ${commonAttrs} value="${safeValue}" placeholder="${escapeDocHtml(field.placeholder || '')}" ${minAttr} ${stepAttr}>
        </div>
    `
}

function getDocStepValues(documentId, stepId) {
    const stepData = docWorkflowState.stepValuesByDocument[documentId]?.[stepId]
    if (!stepData || typeof stepData !== 'object') {
        return {}
    }

    return stepData
}

function setDocStepFieldValue(documentId, stepId, fieldName, value) {
    if (!docWorkflowState.stepValuesByDocument[documentId]) {
        docWorkflowState.stepValuesByDocument[documentId] = {}
    }

    if (!docWorkflowState.stepValuesByDocument[documentId][stepId] || typeof docWorkflowState.stepValuesByDocument[documentId][stepId] !== 'object') {
        docWorkflowState.stepValuesByDocument[documentId][stepId] = {}
    }

    docWorkflowState.stepValuesByDocument[documentId][stepId][fieldName] = value
}

function getDocStepStatus(documentId, stepId) {
    return docWorkflowState.stepStatusByDocument[documentId]?.[stepId] || 'pending'
}

function setDocStepStatus(documentId, stepId, status) {
    if (!docWorkflowState.stepStatusByDocument[documentId]) {
        docWorkflowState.stepStatusByDocument[documentId] = {}
    }

    docWorkflowState.stepStatusByDocument[documentId][stepId] = status
}

function evaluateFieldValue(field, value) {
    const normalized = String(value || '').trim()

    if (!normalized) {
        return field.required ? 'empty' : 'valid'
    }

    if (field.type === 'date') {
        return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? 'valid' : 'invalid'
    }

    if (field.type === 'number') {
        const numeric = Number(normalized)
        if (!Number.isFinite(numeric)) return 'invalid'
        if (field.min !== undefined && numeric < field.min) return 'invalid'
        return 'valid'
    }

    if (field.type === 'select') {
        return normalized ? 'valid' : (field.required ? 'empty' : 'valid')
    }

    if (field.type === 'textarea') {
        return normalized.length >= 10 ? 'valid' : 'invalid'
    }

    return normalized.length >= 3 ? 'valid' : 'invalid'
}

function evaluateStepFields(step, documentItem, values) {
    const fields = getDocStepFieldDefinitions(step, documentItem)
    let hasInvalid = false
    let hasEmpty = false

    fields.forEach((field) => {
        const status = evaluateFieldValue(field, values[field.name])
        if (status === 'invalid') hasInvalid = true
        if (status === 'empty') hasEmpty = true
    })

    if (hasInvalid) return 'invalid'
    if (hasEmpty) return 'empty'
    return 'valid'
}

function showDocWorkflowAlert(type, title, message) {
    if (typeof showAppAlert === 'function') {
        showAppAlert({ type, title, message, duration: 2800 })
        return
    }

    console.log(`${title}: ${message}`)
}

function scrollToDocWizardCard() {
    const card = document.querySelector('.workflow__wizard-card')
    if (!card) return

    card.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    })
}

function renderDocWorkflowPage() {
    const container = document.getElementById('workflow-wizard-container')
    if (!container) return

    const accessKey = docWorkflowState.selectedAccess

    const profile = docWorkflowAccessProfiles[accessKey] || docWorkflowAccessProfiles.gestor
    const documents = getDocWorkflowPendingDocuments(accessKey)
    const activeDocument = documents.find((item) => item.id === docWorkflowState.selectedDocumentId) || null
    const modelKey = activeDocument?.model || documents[0]?.model || 'prestacao-servicos'
    const steps = getDocWorkflowStepsForAccess(modelKey, accessKey)
    const currentStep = activeDocument ? steps[docWorkflowState.currentStepIndex] : null

    const tableRows = documents.map((documentItem) => {
        const pessoas = documentItem.pessoas
            .map((person) => `<p class="workflow__pending-line"><strong>${person.nome}</strong> <span>(${person.perfil})</span></p>`)
            .join('')

        const dados = documentItem.pessoas
            .map((person) => `<p class="workflow__pending-line"><strong>${person.nome}:</strong> ${person.dados.join(', ') || '-'}</p>`)
            .join('')

        const isActiveDocument = docWorkflowState.selectedDocumentId === documentItem.id
        const actionLabel = isActiveDocument ? 'Dados sendo preenchidos' : 'Preencher dados'
        const actionClass = isActiveDocument ? 'workflow__pending-action is-active' : 'workflow__pending-action'

        return `
            <tr>
                <td>${escapeDocHtml(documentItem.nome)}</td>
                <td>${pessoas}</td>
                <td>${dados}</td>
                <td>${escapeDocHtml(documentItem.status)}</td>
                <td>${escapeDocHtml(documentItem.prazo)}</td>
                <td><button type="button" class="btn btn--primary ${actionClass}" data-open-doc-wizard="${documentItem.id}">${actionLabel}</button></td>
            </tr>
        `
    }).join('')

    const stepDots = steps.length
        ? steps.map((step, index) => {
            const isActive = activeDocument && index === docWorkflowState.currentStepIndex
            const stepStatus = activeDocument ? getDocStepStatus(activeDocument.id, step.id) : 'pending'
            const classes = [
                'workflow__wizard-step',
                isActive ? 'is-active' : '',
                stepStatus === 'valid' ? 'is-valid' : '',
                stepStatus === 'skipped' ? 'is-skipped' : '',
                stepStatus === 'invalid' ? 'is-error' : ''
            ].filter(Boolean).join(' ')

            return `<button type="button" class="${classes}" data-doc-step-index="${index}" ${activeDocument ? '' : 'disabled'}><span class="workflow__wizard-step-circle">${index + 1}</span><span class="workflow__wizard-step-label">${escapeDocHtml(step.nome)}</span></button>`
        }).join('')
        : '<p class="workflow__hint">Nao ha etapas para esse perfil no modelo selecionado.</p>'

    const wizardCard = (!activeDocument || !currentStep)
        ? ''
        : `
            <div class="workflow__wizard-card">
                <div class="workflow__wizard-step-meta">Etapa ${docWorkflowState.currentStepIndex + 1} de ${steps.length}</div>
                <h3 class="workflow__section-title">${escapeDocHtml(activeDocument.nome)}</h3>
                <p class="workflow__section-subtitle">Step atual: ${escapeDocHtml(currentStep.nome)} (${formatDocWorkflowModelLabel(modelKey)})</p>
                ${getDocStepFieldDefinitions(currentStep, activeDocument).map((field) => renderDocStepField(field, getDocStepValues(activeDocument.id, currentStep.id)[field.name] || '', currentStep.id, activeDocument.id)).join('')}
                <div class="workflow__wizard-actions">
                    <button type="button" class="btn btn--secondary" data-doc-wizard-prev ${docWorkflowState.currentStepIndex === 0 ? 'disabled' : ''}>Anterior</button>
                    <button type="button" class="btn btn--secondary" data-doc-wizard-save>Salvar etapa</button>
                    <button type="button" class="btn btn--primary" data-doc-wizard-next>${docWorkflowState.currentStepIndex === steps.length - 1 ? 'Finalizar e enviar' : 'Proxima etapa'}</button>
                </div>
            </div>
        `

    const wizardShellHtml = `
        <div class="workflow__document-content">
            ${activeDocument ? `
                <div class="workflow__pending-block">
                    <div class="workflow__section-title">Documentos pendentes para preenchimento</div>
                    <p class="workflow__section-subtitle">Cenario: <strong>${profile.label}</strong>. Veja quem preenche cada dado e inicie o wizard do documento correspondente.</p>
                    <div class="workflow__pending-table-wrap">
                        <table class="workflow__pending-table">
                            <thead>
                                <tr>
                                    <th>Documento</th>
                                    <th>Quem vai preencher</th>
                                    <th>Dados requisitados</th>
                                    <th>Status</th>
                                    <th>Prazo</th>
                                    <th>Acao</th>
                                </tr>
                            </thead>
                            <tbody>${tableRows}</tbody>
                        </table>
                    </div>
                </div>
                <div class="workflow__wizard-shell">
                    <div class="workflow__section-title">${activeDocument ? `Documento selecionado: ${escapeDocHtml(activeDocument.nome)}` : `Etapas do seu fluxo (${profile.label})`}</div>
                    <p class="workflow__section-subtitle">As bolinhas mostram as caixas que precisam ser preenchidas para o seu perfil.</p>
                    <div class="workflow__wizard-steps">${stepDots}</div>
                    ${wizardCard}
                </div>
            ` : `
                <div class="workflow__pending-block">
                    <div class="workflow__section-title">Documentos pendentes para preenchimento</div>
                    <p class="workflow__section-subtitle">Cenario: <strong>${profile.label}</strong>. Clique em <strong>Preencher dados</strong> para abrir o wizard do documento.</p>
                    <div class="workflow__pending-table-wrap">
                        <table class="workflow__pending-table">
                            <thead>
                                <tr>
                                    <th>Documento</th>
                                    <th>Quem vai preencher</th>
                                    <th>Dados requisitados</th>
                                    <th>Status</th>
                                    <th>Prazo</th>
                                    <th>Acao</th>
                                </tr>
                            </thead>
                            <tbody>${tableRows}</tbody>
                        </table>
                    </div>
                </div>
            `}
        </div>
    `

    container.innerHTML = wizardShellHtml
}

function initDocWorkflowPage() {
    const accessSelect = document.getElementById('workflow-user-access')
    const container = document.getElementById('workflow-wizard-container')
    if (!accessSelect || !container) return

    if (!docWorkflowState.initialized) {
        accessSelect.innerHTML = ''
        Object.entries(docWorkflowAccessProfiles).forEach(([key, profile]) => {
            const option = document.createElement('option')
            option.value = key
            option.textContent = profile.label
            if (key === docWorkflowState.selectedAccess) {
                option.selected = true
            }
            accessSelect.appendChild(option)
        })

        accessSelect.addEventListener('change', (event) => {
            docWorkflowState.selectedAccess = event.target.value
            docWorkflowState.selectedDocumentId = ''
            docWorkflowState.currentStepIndex = 0
            renderDocWorkflowPage()
        })

        container.addEventListener('click', (event) => {
            const openButton = event.target.closest('[data-open-doc-wizard]')
            if (openButton) {
                docWorkflowState.selectedDocumentId = openButton.getAttribute('data-open-doc-wizard') || ''
                docWorkflowState.currentStepIndex = 0
                renderDocWorkflowPage()
                requestAnimationFrame(() => {
                    scrollToDocWizardCard()
                })
                return
            }

            const dateInput = event.target.closest('[data-doc-date-input]')
            if (dateInput && docWorkflowState.selectedDocumentId) {
                const stepId = Number(dateInput.getAttribute('data-step-id'))
                const fieldName = dateInput.getAttribute('data-doc-field')
                if (!fieldName) return

                const popover = container.querySelector(`[data-doc-date-popover][data-step-id="${stepId}"][data-doc-field="${fieldName}"]`)
                if (!popover) return

                container.querySelectorAll('[data-doc-date-popover]').forEach((node) => {
                    if (node !== popover) {
                        node.classList.add('is-hidden')
                    }
                })

                popover.classList.toggle('is-hidden')
                return
            }

            const dateNav = event.target.closest('[data-doc-date-nav]')
            if (dateNav && docWorkflowState.selectedDocumentId) {
                const direction = dateNav.getAttribute('data-doc-date-nav')
                const stepId = Number(dateNav.getAttribute('data-step-id'))
                const fieldName = dateNav.getAttribute('data-doc-field')
                if (!fieldName) return

                const currentValues = getDocStepValues(docWorkflowState.selectedDocumentId, stepId)
                const currentValue = currentValues[fieldName] || ''
                const currentDate = getDatePickerViewDate(docWorkflowState.selectedDocumentId, stepId, fieldName, currentValue)
                const nextDate = new Date(currentDate)
                nextDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1))

                docWorkflowState.datePickerMonthByField[getDocFieldKey(docWorkflowState.selectedDocumentId, stepId, fieldName)] = new Date(nextDate.getFullYear(), nextDate.getMonth(), 1)
                renderDocWorkflowPage()

                requestAnimationFrame(() => {
                    const popover = container.querySelector(`[data-doc-date-popover][data-step-id="${stepId}"][data-doc-field="${fieldName}"]`)
                    if (popover) {
                        popover.classList.remove('is-hidden')
                    }
                })
                return
            }

            const dateDay = event.target.closest('[data-doc-date-day]')
            if (dateDay && docWorkflowState.selectedDocumentId) {
                const isoDate = dateDay.getAttribute('data-doc-date-day')
                const stepId = Number(dateDay.getAttribute('data-step-id'))
                const fieldName = dateDay.getAttribute('data-doc-field')
                if (!fieldName || !isoDate) return

                setDocStepFieldValue(docWorkflowState.selectedDocumentId, stepId, fieldName, isoDate)

                const documents = getDocWorkflowPendingDocuments(docWorkflowState.selectedAccess)
                const selected = documents.find((item) => item.id === docWorkflowState.selectedDocumentId)
                const steps = getDocWorkflowStepsForAccess(selected?.model || 'prestacao-servicos', docWorkflowState.selectedAccess)
                const currentStep = steps.find((step) => Number(step.id) === Number(stepId))

                if (currentStep) {
                    const values = getDocStepValues(docWorkflowState.selectedDocumentId, stepId)
                    const check = evaluateStepFields(currentStep, selected, values)
                    setDocStepStatus(docWorkflowState.selectedDocumentId, stepId, check === 'valid' ? 'valid' : (check === 'invalid' ? 'invalid' : 'pending'))
                }

                renderDocWorkflowPage()

                requestAnimationFrame(() => {
                    const card = container.querySelector('.workflow__wizard-card')
                    if (card) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                })
                return
            }

            const stepButton = event.target.closest('[data-doc-step-index]')
            if (stepButton && docWorkflowState.selectedDocumentId) {
                const nextIndex = Number(stepButton.getAttribute('data-doc-step-index'))
                if (!Number.isNaN(nextIndex)) {
                    const documents = getDocWorkflowPendingDocuments(docWorkflowState.selectedAccess)
                    const selected = documents.find((item) => item.id === docWorkflowState.selectedDocumentId)
                    const steps = getDocWorkflowStepsForAccess(selected?.model || 'prestacao-servicos', docWorkflowState.selectedAccess)

                    if (nextIndex > docWorkflowState.currentStepIndex) {
                        for (let idx = docWorkflowState.currentStepIndex; idx < nextIndex; idx += 1) {
                            const step = steps[idx]
                            if (!step) continue
                            const currentStatus = getDocStepStatus(docWorkflowState.selectedDocumentId, step.id)
                            const values = getDocStepValues(docWorkflowState.selectedDocumentId, step.id)
                            const check = evaluateStepFields(step, selected, values)
                            if (check === 'empty' && currentStatus === 'pending') {
                                setDocStepStatus(docWorkflowState.selectedDocumentId, step.id, 'skipped')
                            }
                        }
                    }

                    docWorkflowState.currentStepIndex = Math.max(0, Math.min(nextIndex, steps.length - 1))
                    renderDocWorkflowPage()
                }
                return
            }

            const prevButton = event.target.closest('[data-doc-wizard-prev]')
            if (prevButton) {
                docWorkflowState.currentStepIndex = Math.max(0, docWorkflowState.currentStepIndex - 1)
                renderDocWorkflowPage()
                return
            }

            const saveButton = event.target.closest('[data-doc-wizard-save]')
            if (saveButton) {
                const documents = getDocWorkflowPendingDocuments(docWorkflowState.selectedAccess)
                const selected = documents.find((item) => item.id === docWorkflowState.selectedDocumentId)
                const steps = getDocWorkflowStepsForAccess(selected?.model || 'prestacao-servicos', docWorkflowState.selectedAccess)
                const currentStep = steps[docWorkflowState.currentStepIndex]
                const values = getDocStepValues(docWorkflowState.selectedDocumentId, currentStep?.id)
                const check = currentStep ? evaluateStepFields(currentStep, selected, values) : 'empty'
                if (currentStep) {
                    setDocStepStatus(docWorkflowState.selectedDocumentId, currentStep.id, check === 'valid' ? 'valid' : (check === 'invalid' ? 'invalid' : 'skipped'))
                }
                renderDocWorkflowPage()
                showDocWorkflowAlert('info', 'Etapa salva', 'Os dados desta etapa foram salvos localmente.')
                return
            }

            const nextButton = event.target.closest('[data-doc-wizard-next]')
            if (nextButton) {
                const documents = getDocWorkflowPendingDocuments(docWorkflowState.selectedAccess)
                const selected = documents.find((item) => item.id === docWorkflowState.selectedDocumentId)
                const steps = getDocWorkflowStepsForAccess(selected?.model || 'prestacao-servicos', docWorkflowState.selectedAccess)
                const currentStep = steps[docWorkflowState.currentStepIndex]
                const currentValues = getDocStepValues(docWorkflowState.selectedDocumentId, currentStep?.id)
                const evaluation = currentStep ? evaluateStepFields(currentStep, selected, currentValues) : 'empty'

                if (currentStep) {
                    if (evaluation === 'valid') {
                        setDocStepStatus(docWorkflowState.selectedDocumentId, currentStep.id, 'valid')
                    } else if (evaluation === 'empty') {
                        setDocStepStatus(docWorkflowState.selectedDocumentId, currentStep.id, 'skipped')
                    } else {
                        setDocStepStatus(docWorkflowState.selectedDocumentId, currentStep.id, 'invalid')
                    }
                }

                if (docWorkflowState.currentStepIndex < steps.length - 1) {
                    docWorkflowState.currentStepIndex += 1
                    renderDocWorkflowPage()
                } else {
                    let hasError = false
                    steps.forEach((step) => {
                        const values = getDocStepValues(docWorkflowState.selectedDocumentId, step.id)
                        const check = evaluateStepFields(step, selected, values)
                        if (check !== 'valid') {
                            hasError = true
                            setDocStepStatus(docWorkflowState.selectedDocumentId, step.id, 'invalid')
                        }
                    })

                    renderDocWorkflowPage()
                    if (hasError) {
                        showDocWorkflowAlert('danger', 'Validacao pendente', 'Existem etapas sem dados validos. Corrija os steps em vermelho para finalizar.')
                    } else {
                        showDocWorkflowAlert('success', 'Documento finalizado', 'Dados finalizados e prontos para envio ao sistema.')
                    }
                }
            }
        })

        const persistFieldValueOnly = (event) => {
            const fieldInput = event.target.closest('[data-doc-field]')
            if (!fieldInput || !docWorkflowState.selectedDocumentId) {
                return
            }

            const stepId = Number(fieldInput.getAttribute('data-step-id'))
            const fieldName = fieldInput.getAttribute('data-doc-field')
            const nextValue = fieldInput.value
            if (!fieldName) return

            setDocStepFieldValue(docWorkflowState.selectedDocumentId, stepId, fieldName, nextValue)
        }

        const evaluateAndUpdateField = (event) => {
            const fieldInput = event.target.closest('[data-doc-field]')
            if (!fieldInput || !docWorkflowState.selectedDocumentId) {
                return
            }

            const stepId = Number(fieldInput.getAttribute('data-step-id'))
            const fieldName = fieldInput.getAttribute('data-doc-field')
            const nextValue = fieldInput.value
            if (!fieldName) return

            setDocStepFieldValue(docWorkflowState.selectedDocumentId, stepId, fieldName, nextValue)

            const documents = getDocWorkflowPendingDocuments(docWorkflowState.selectedAccess)
            const selected = documents.find((item) => item.id === docWorkflowState.selectedDocumentId)
            const steps = getDocWorkflowStepsForAccess(selected?.model || 'prestacao-servicos', docWorkflowState.selectedAccess)
            const currentStep = steps.find((step) => Number(step.id) === Number(stepId))
            if (!currentStep) return

            const stepValues = getDocStepValues(docWorkflowState.selectedDocumentId, stepId)
            const result = evaluateStepFields(currentStep, selected, stepValues)
            if (result === 'valid') {
                setDocStepStatus(docWorkflowState.selectedDocumentId, stepId, 'valid')
            } else if (result === 'invalid') {
                setDocStepStatus(docWorkflowState.selectedDocumentId, stepId, 'invalid')
            } else if (getDocStepStatus(docWorkflowState.selectedDocumentId, stepId) !== 'skipped') {
                setDocStepStatus(docWorkflowState.selectedDocumentId, stepId, 'pending')
            }

            const stepButton = container.querySelector(`[data-doc-step-index="${steps.findIndex((step) => Number(step.id) === Number(stepId))}"]`)
            if (stepButton) {
                stepButton.classList.remove('is-valid', 'is-skipped', 'is-error')
                const currentStatus = getDocStepStatus(docWorkflowState.selectedDocumentId, stepId)
                if (currentStatus === 'valid') stepButton.classList.add('is-valid')
                if (currentStatus === 'skipped') stepButton.classList.add('is-skipped')
                if (currentStatus === 'invalid') stepButton.classList.add('is-error')
            }
        }

        container.addEventListener('input', persistFieldValueOnly)
        container.addEventListener('change', evaluateAndUpdateField)

        document.addEventListener('click', (event) => {
            const insideWorkflow = event.target.closest('#workflow-wizard-container')
            if (insideWorkflow) {
                return
            }

            document.querySelectorAll('[data-doc-date-popover]').forEach((popover) => {
                popover.classList.add('is-hidden')
            })
        })

        docWorkflowState.initialized = true
    }

    accessSelect.value = docWorkflowState.selectedAccess
    renderDocWorkflowPage()
}

document.addEventListener('DOMContentLoaded', () => {
    initDocWorkflowPage()

    const docPage = document.querySelector('.page[data-view="fluxo-trabalho"]')
    if (!docPage) return

    const observer = new MutationObserver(() => {
        if (docPage.classList.contains('is-active')) {
            initDocWorkflowPage()
        }
    })

    observer.observe(docPage, { attributes: true, attributeFilter: ['class'] })
})



/*==================== MERGED: email-composer.js ====================*/
/*==================== EMAIL COMPOSER FUNCTIONALITY ====================*/

/**
 * Email Composer Module
 * Handles email composition, formatting, attachments, and submission
 */

const EmailComposer = (() => {
    // State
    const state = {
        attachments: [],
        selectedSignature: null,
        isSignatureModalOpen: false,
        selectedFileForAttachment: null
    }

    // DOM Elements
    let emailForm
    let emailToInput
    let emailCcInput
    let emailSubjectInput
    let emailContentEditor
    let attachmentsListElement
    let attachmentsModalButton
    let signatureButton
    let cancelButton
    let editorToolbarButtons

    /**
     * Initialize the email composer
     */
    function init() {
        // Get DOM elements
        emailForm = document.getElementById('email-form')
        emailToInput = document.getElementById('email-to')
        emailCcInput = document.getElementById('email-cc')
        emailSubjectInput = document.getElementById('email-subject')
        emailContentEditor = document.getElementById('email-content')
        attachmentsListElement = document.getElementById('attachments-list')
        attachmentsModalButton = document.getElementById('btn-add-attachments')
        signatureButton = document.getElementById('btn-signature')
        cancelButton = document.getElementById('btn-cancel-email')
        editorToolbarButtons = document.querySelectorAll('.email-editor-btn')

        // Event listeners
        if (emailForm) {
            emailForm.addEventListener('submit', handleFormSubmit)
        }

        if (cancelButton) {
            cancelButton.addEventListener('click', handleCancel)
        }

        if (attachmentsModalButton) {
            attachmentsModalButton.addEventListener('click', handleAddAttachments)
        }

        if (signatureButton) {
            signatureButton.addEventListener('click', handleSignatureClick)
        }

        // Setup editor toolbar
        setupEditorToolbar()

        // Setup field error listeners
        setupFieldErrorListeners()

        // Initialize empty attachments display
        updateAttachmentsDisplay()

        console.log('Email Composer initialized')
    }

    /**
     * Setup editor toolbar buttons
     */
    function setupEditorToolbar() {
        editorToolbarButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault()
                const format = btn.dataset.format
                applyFormat(format)
            })
        })
    }

    /**
     * Apply text formatting to editor content
     */
    function applyFormat(format) {
        // Focus the editor first
        emailContentEditor.focus()

        // Apply the formatting command
        document.execCommand(format, false, null)
    }

    /**
     * Handle form submission
     */
    function handleFormSubmit(e) {
        e.preventDefault()

        // Validation
        if (!validateForm()) {
            return
        }

        // Get form data
        const formData = {
            to: emailToInput.value.trim(),
            cc: emailCcInput.value.trim(),
            subject: emailSubjectInput.value.trim(),
            content: emailContentEditor.innerHTML,
            attachments: state.attachments,
            signature: state.selectedSignature
        }

        // Log (in production, this would send to a server)
        console.log('Email to be sent:', formData)

        // Show success message
        showAppAlert({
            type: 'success',
            message: 'E-mail enviado com sucesso!',
            duration: 4500
        })

        // Reset form
        resetForm()
    }

    /**
     * Validate form inputs
     */
    function validateForm() {
        const to = emailToInput.value.trim()
        const subject = emailSubjectInput.value.trim()
        const content = emailContentEditor.innerText.trim()
        let hasError = false
        let firstErrorField = null

        // Clear previous error states
        clearFieldErrors()

        if (!to) {
            addFieldError(emailToInput, 'Por favor, insira um e-mail de destinatário')
            hasError = true
            if (!firstErrorField) firstErrorField = emailToInput
        } else {
            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(to)) {
                addFieldError(emailToInput, 'Por favor, insira um e-mail válido')
                hasError = true
                if (!firstErrorField) firstErrorField = emailToInput
            }
        }

        if (!subject) {
            addFieldError(emailSubjectInput, 'Por favor, insira um assunto')
            hasError = true
            if (!firstErrorField) firstErrorField = emailSubjectInput
        }

        if (!content) {
            addFieldError(emailContentEditor, 'Por favor, escreva uma mensagem')
            hasError = true
            if (!firstErrorField) firstErrorField = emailContentEditor
        }

        if (hasError) {
            showAppAlert({
                type: 'error',
                message: 'Por favor, preencha todos os campos corretamente',
                duration: 4500
            })
            // Scroll to the first field with error
            if (firstErrorField) {
                setTimeout(() => {
                    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }, 100)
            }
            return false
        }

        return true
    }

    /**
     * Add error state to a field
     */
    function addFieldError(field, message) {
        const container = field.closest('.email-form__group')
        if (container) {
            container.classList.add('email-form__group--error')
        }
        field.classList.add('is-error')
    }

    /**
     * Clear error states from all fields
     */
    function clearFieldErrors() {
        document.querySelectorAll('.email-form__group--error').forEach(group => {
            group.classList.remove('email-form__group--error')
        })
        document.querySelectorAll('input.is-error, textarea.is-error, [contenteditable].is-error').forEach(field => {
            field.classList.remove('is-error')
        })
    }

    /**
     * Setup field error removal listeners
     */
    function setupFieldErrorListeners() {
        [emailToInput, emailCcInput, emailSubjectInput, emailContentEditor].forEach(field => {
            if (field) {
                field.addEventListener('input', () => {
                    const container = field.closest('.email-form__group')
                    if (container && container.classList.contains('email-form__group--error')) {
                        container.classList.remove('email-form__group--error')
                    }
                    field.classList.remove('is-error')
                })
            }
        })
    }

    /**
     * Handle cancel button click
     */
    function handleCancel(e) {
        e.preventDefault()

        if (confirm('Deseja cancelar? As alterações serão perdidas.')) {
            resetForm()
        }
    }

    /**
     * Handle add attachments button click
     */
    function handleAddAttachments(e) {
        e.preventDefault()

        // This will open a modal with file browser
        // The modal will modify state.attachments
        openAttachmentsModal()
    }

    /**
     * Handle signature button click
     */
    function handleSignatureClick(e) {
        e.preventDefault()

        // This will be a future feature
        showAppAlert({
            type: 'info',
            message: 'Funcionalidade de criação de assinatura em desenvolvimento',
            duration: 4500
        })

        // In the future, this will open a modal to create/select signatures
        // openSignatureModal()
    }

    /**
     * Add attachment to email
     */
    function addAttachment(file) {
        // Check if file already exists
        const exists = state.attachments.some(att => att.id === file.id)
        if (exists) {
            showAppAlert({
                type: 'warning',
                message: 'Este arquivo já foi adicionado',
                duration: 4500
            })
            return
        }

        state.attachments.push(file)
        updateAttachmentsDisplay()
        showAppAlert({
            type: 'success',
            message: `Anexo "${file.name}" adicionado com sucesso`,
            duration: 3500
        })
    }

    /**
     * Remove attachment from email
     */
    function removeAttachment(fileId) {
        state.attachments = state.attachments.filter(att => att.id !== fileId)
        updateAttachmentsDisplay()
    }

    /**
     * Update attachments display in the UI
     */
    function updateAttachmentsDisplay() {
        if (state.attachments.length === 0) {
            attachmentsListElement.innerHTML = '<div class="email-attachments__empty">Nenhum anexo adicionado</div>'
            return
        }

        attachmentsListElement.innerHTML = state.attachments
            .map(attachment => `
                <div class="email-attachments__item">
                    <div class="email-attachments__item-info">
                        <i class='bx bx-file email-attachments__item-icon'></i>
                        <span class="email-attachments__item-name" title="${attachment.name}">
                            ${attachment.name}
                        </span>
                        <span class="email-attachments__item-size">
                            ${formatFileSize(attachment.size || 0)}
                        </span>
                    </div>
                    <button 
                        type="button" 
                        class="email-attachments__item-remove"
                        data-file-id="${attachment.id}"
                        title="Remover anexo"
                        aria-label="Remover anexo"
                    >
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
            `)
            .join('')

        // Add event listeners to remove buttons
        attachmentsListElement.querySelectorAll('.email-attachments__item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault()
                const fileId = btn.dataset.fileId
                removeAttachment(fileId)
            })
        })
    }

    /**
     * Format file size
     */
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
    }

    /**
     * Open attachments modal (Full Page Modal)
     */
    function openAttachmentsModal() {
        const attachmentModal = document.getElementById('attachment-modal')
        attachmentModal.classList.add('is-open')
        AttachmentModal.init(addAttachment, closeAttachmentModal)
    }

    /**
     * Setup attachment modal event listeners
     */
    function setupAttachmentModalListeners() {
        // Now handled by AttachmentModal module
    }

    /**
     * Close attachment modal
     */
    function closeAttachmentModal() {
        const attachmentModal = document.getElementById('attachment-modal')
        attachmentModal.classList.remove('is-open')
        state.selectedFileForAttachment = null
    }

    /**
     * Load files in modal from existing files list
     */
    function loadFilesInModal(modal) {
        // Placeholder for backward compatibility
        console.log('loadFilesInModal called but using new modal approach')
    }

    /**
     * Parse file size string to bytes
     */
    function parseSize(sizeStr) {
        const parts = sizeStr.trim().split(' ')
        const value = parseFloat(parts[0])
        const unit = parts[1] || 'B'

        const units = { 'B': 1, 'KB': 1024, 'MB': 1024 * 1024, 'GB': 1024 * 1024 * 1024 }
        return value * (units[unit] || 1)
    }

    /**
     * Reset form to initial state
     */
    function resetForm() {
        emailForm.reset()
        emailContentEditor.innerHTML = ''
        state.attachments = []
        state.selectedSignature = null
        updateAttachmentsDisplay()
    }

    // Public API
    return {
        init,
        addAttachment,
        removeAttachment
    }
})()

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        EmailComposer.init()
    })
} else {
    EmailComposer.init()
}

