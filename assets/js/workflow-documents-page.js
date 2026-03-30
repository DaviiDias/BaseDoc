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
