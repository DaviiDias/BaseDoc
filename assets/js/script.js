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
                    { icon: 'bx-grid-alt', label: 'Todos os arquivos', view: 'todos-arquivos', active: true },
                    { icon: 'bx-transfer', label: 'Fluxo de trabalho', view: 'fluxo-trabalho' },
                    { icon: 'bx-pen', label: 'Assinatura digital', view: 'assinatura-digital' },
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
        }
    })
}

const initial = document.querySelector('.nav__link.active[data-panel]')
if (initial) {
    renderPanel(initial.dataset.panel)
    showPage('todos-arquivos')
}

initTodosArquivosMocks()

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
