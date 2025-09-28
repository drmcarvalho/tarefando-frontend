import { Task } from "@lit/task";
import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { map } from "lit/directives/map.js";

const apiUrl: String = "https://localhost:7222/api/tasks"

function formatDateToFullText(dataString: string): string {
  const data = new Date(dataString)  
  const opcoes: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Sao_Paulo'
  }  
  return data.toLocaleDateString('pt-BR', opcoes)
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    })
}

class MyTaskComponent extends LitElement {
    static styles? = css`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #1a1a1a;
            color: #ffffff;
            min-height: 100vh;
        }

        .header {
            background-color: #2d2d2d;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .header h1 {
            font-size: 24px;
            font-weight: 300;
            color: #00d4aa;
        }

        .header-controls {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .group-toggle {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-size: 14px;
            color: #ccc;
            transition: color 0.2s;
        }

        .group-toggle:hover {
            color: #00d4aa;
        }

        .checkbox {
            width: 18px;
            height: 18px;
            border: 2px solid #555;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: transparent;
            transition: all 0.2s;
        }

        .checkbox.checked {
            background-color: #00d4aa;
            border-color: #00d4aa;
        }

        .checkbox.checked::after {
            content: '✓';
            color: #fff;
            font-size: 12px;
            font-weight: bold;
        }

        .header-info {
            font-size: 14px;
            color: #999;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        /* Estilos para modo agrupado */
        .day-group {
            margin-bottom: 20px;
            background-color: #2d2d2d;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .day-header {
            background-color: #333;
            padding: 15px 20px;
            border-bottom: 1px solid #444;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
        }

        .day-header:hover {
            background-color: #3a3a3a;
        }

        .day-title {
            font-size: 16px;
            color: #fff;
        }

        .day-summary {
            font-size: 14px;
            color: #00d4aa;
            font-weight: 500;
        }

        /* Estilos para modo não agrupado */
        .flat-container {            
            margin: 0 auto;
            padding: 20px;
            max-width: 800px;
            background-color: #2d2d2d;
            border-radius: 12px;
        }

        .tasks-list {
            padding: 0;
        }

        .task-item {
            padding: 20px;
            border-bottom: 1px solid #404040;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: background-color 0.2s;
            position: relative;
        }

        .task-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background-color: var(--task-color);
            border-radius: 0 2px 2px 0;
        }

        /* Cores por tipo de tarefa */
        .task-item[data-type="urgent"]::before {
            --task-color: #ff4757;
        }

        .task-item[data-type="normal"]::before {
            --task-color: #c0c0c0;
        }

        .task-item[data-type="teamAlignment"]::before {
            --task-color: #2ed573;
        }

        .task-item[data-type="training"]::before {
            --task-color: #3742fa;
        }

        .task-item[data-type="administrative"]::before {
            --task-color: #ffa502;
        }

        .task-item:hover {
            background-color: #353535;
        }

        .task-item:last-child {
            border-bottom: none;
        }

        .task-content {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 15px;
            margin-left: 8px; /* Espaço para a linha colorida */
        }

        .task-icon {
            font-size: 24px;
            color: #666;
            min-width: 30px;
        }

        .task-details {
            flex: 1;
        }

        .task-title {
            font-size: 16px;
            color: #fff;
            margin-bottom: 8px;
            line-height: 1.3;
        }

        .task-description {
            font-size: 14px;
            color: #999;
            line-height: 1.4;
        }

        .task-time {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }

        .task-date {
            font-size: 12px;
            color: #00d4aa;
            margin-top: 4px;
            font-weight: 500;
        }

        .task-actions {
            display: flex;
            gap: 8px;
            align-items: center;
            margin-left: 15px;
        }

        .action-btn {
            padding: 8px 12px;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .btn-complete {
            background-color: #00d4aa;
            color: #fff;
        }

        .btn-complete:hover {
            background-color: #00b896;
            transform: translateY(-1px);
        }

        .btn-cancel {
            background-color: #ff4757;
            color: #fff;
        }

        .btn-cancel:hover {
            background-color: #ff3742;
            transform: translateY(-1px);
        }

        .btn-view {
            background-color: #5352ed;
            color: #fff;
        }

        .btn-view:hover {
            background-color: #4834d4;
            transform: translateY(-1px);
        }

        .task-completed .task-title {
            text-decoration: line-through;
            color: #666;
        }

        .task-completed .task-description {
            color: #555;
        }

        .task-completed .task-icon {
            color: #00d4aa;
        }

        .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status-pending {
            background-color: rgba(255, 193, 7, 0.2);
            color: #ffc107;
        }

        .status-completed {
            background-color: rgba(0, 212, 170, 0.2);
            color: #00d4aa;
        }

        .status-cancelled {
            background-color: rgba(255, 71, 87, 0.2);
            color: #ff4757;
        }

        .add-task-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background-color: #00d4aa;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            color: #fff;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0, 212, 170, 0.3);
            transition: all 0.3s;
        }

        .add-task-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(0, 212, 170, 0.4);
        }

        .collapse-icon {
            transition: transform 0.3s;
        }

        .collapsed .collapse-icon {
            transform: rotate(-90deg);
        }

        .collapsed .tasks-list {
            display: none;
        }

        /* Ocultar elementos com base no modo */
        .flat-mode .day-group {
            display: none;
        }

        .grouped-mode .flat-container {
            display: none;
        }

        /* Legenda de cores - ajuste de posicionamento */
        .legend {
            background-color: #2d2d2d;
            border-radius: 12px;
            padding: 15px 20px;
            margin-bottom: 20px;
            margin-top: 20px;            
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        /* Garantir que ambos os containers tenham o mesmo espaçamento do header */
        .grouped-mode .legend {
            margin-top: 0;
        }

        .flat-mode .legend {
            margin-top: 0;
        }

        .legend h3 {
            font-size: 14px;
            color: #ccc;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .legend-items {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: #999;
        }

        .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 2px;
        }

        .legend-color.urgent { background-color: #ff4757; }
        .legend-color.normal { background-color: #c0c0c0; }
        .legend-color.team { background-color: #2ed573; }
        .legend-color.training { background-color: #3742fa; }
        .legend-color.admin { background-color: #ffa502; }

        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(4px);
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }

        .modal.show {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background-color: #2d2d2d;
            border-radius: 16px;
            padding: 30px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            animation: slideIn 0.3s ease;
            position: relative;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 1px solid #404040;
        }

        .modal-title {
            font-size: 24px;
            color: #00d4aa;
            font-weight: 300;
            margin: 0;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            color: #999;
            cursor: pointer;
            padding: 5px;
            border-radius: 4px;
            transition: all 0.2s;
            line-height: 1;
        }

        .close-btn:hover {
            color: #ff4757;
            background-color: rgba(255, 71, 87, 0.1);
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            display: block;
            margin-bottom: 8px;
            color: #ccc;
            font-size: 14px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .form-input, .form-select, .form-textarea {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #404040;
            border-radius: 8px;
            background-color: #1a1a1a;
            color: #fff;
            font-size: 16px;
            font-family: inherit;
            transition: all 0.2s;
            resize: none;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
            outline: none;
            border-color: #00d4aa;
            box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
        }

        .form-textarea {
            min-height: 80px;
            resize: vertical;
        }

        .form-select {
            cursor: pointer;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23999' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 12px center;
            background-repeat: no-repeat;
            background-size: 16px;
            padding-right: 40px;
            appearance: none;
        }

        .task-type-preview {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 8px;
            padding: 8px 12px;
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 6px;
            transition: all 0.2s;
        }

        .task-type-color {
            width: 16px;
            height: 16px;
            border-radius: 3px;
            transition: all 0.2s;
        }

        .task-type-name {
            font-size: 14px;
            color: #999;
            font-weight: 500;
        }

        .modal-footer {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #404040;
        }

        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            min-width: 100px;
        }

        .btn-primary {
            background-color: #00d4aa;
            color: #fff;
        }

        .btn-primary:hover {
            background-color: #00b896;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 212, 170, 0.3);
        }

        .btn-primary:disabled {
            background-color: #555;
            color: #999;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .btn-secondary {
            background-color: #555;
            color: #ccc;
            border: 1px solid #666;
        }

        .btn-secondary:hover {
            background-color: #666;
            color: #fff;
            transform: translateY(-1px);
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideIn {
            from { 
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            to { 
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .task-item {
                padding: 15px;
                flex-direction: column;
                align-items: stretch;
                gap: 15px;
            }
            
            .task-actions {
                margin-left: 0;
                justify-content: flex-end;
            }
            
            .action-btn {
                padding: 10px 15px;
                font-size: 11px;
            }

            .header-controls {
                gap: 10px;
            }

            .group-toggle {
                font-size: 12px;
            }

            .legend-items {
                justify-content: center;
            }

            .modal-content {
                margin: 20px;
                padding: 20px;
                max-width: none;
                width: calc(100% - 40px);
            }

            .modal-footer {
                flex-direction: column;
            }

            .btn {
                width: 100%;
            }

            .search-container {
                display: flex;
                align-items: center;
                background-color: #404040;
                border-radius: 6px;
                padding: 8px 12px;
                transition: background-color 0.2s;
            }

            .search-container:focus-within {
                background-color: #4a4a4a;
            }

            .search-input {
                background: none;
                border: none;
                color: #fff;
                font-size: 14px;
                outline: none;
                width: 200px;
            }

            .search-input::placeholder {
                color: #999;
            }

            .search-icon {
                color: #999;
                font-size: 16px;
                margin-right: 8px;
            }
        }
    `

    @property({ type: Boolean }) isGroupedByDay = false    
    @property({ type: Boolean }) showModal = false    
    @property({ type: String }) taskTitle = ""    
    @property({ type: String }) taskDescription = ""
    @property({ type: String }) taskTypeSelectedValue = ""
    @property({ type: Boolean }) isEditMode = false

    _myTasks = new Task(this, {        
        task: async([], {signal}) => {
            try {                
                const response = await fetch(`${apiUrl}/criteria?grouped=${this.isGroupedByDay ? 'true' : 'false'}`, {signal})
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`)
                }
                return response.json()
            }   
            catch(err) {
                console.log(err)
            }
        },
        args: () => []
    })    

    _showTaskModal() {        
        this.showModal = true        
        const modal = document.getElementById('taskModal')
        modal?.classList.add('show')        
        document.body.style.overflow = 'hidden'        
        document.getElementById('taskTitle')?.focus()        
    }

    _handleSelectChange(e: Event) {
        this.taskTypeSelectedValue = (e.target as HTMLInputElement).value        
    }

    _closeTaskModal(e: Event) {        
        this.taskTitle = ""
        this.taskDescription = ""
        this.taskTypeSelectedValue = ""
        const form = (e.target as HTMLButtonElement).form as HTMLFormElement
        form.reset()
        this.showModal = false
        const modal = document.getElementById('taskModal')
        modal?.classList.remove('show')
        document.body.style.overflow = 'auto'
        //this.isEditMode = false
        const preview = document.getElementById('taskTypePreview')
        if (preview) {
            preview.style.display = 'none'
        }        
    }

    _spanCheckBoxHandleClick() {
        this.isGroupedByDay = !this.isGroupedByDay
        this._myTasks.run()
    }

    async _completeTaskHandleClick(e: Event) {
        try {
            const target = e.currentTarget as HTMLElement
            const id = target?.getAttribute('id')
            const response = await fetch(`${apiUrl}/complete/${id}`, { method: 'PATCH' })
            if (!response.ok) {
                alert('Erro ao completar tarefa')
            }
            this._myTasks.run()
        }
        catch (err) {
            console.log(err)
        }
    }

    async _cancelTaskHandleClick(e: Event) {        
        try {
            const target = e.currentTarget as HTMLElement
            const id = target?.getAttribute('id')
            const response = await fetch(`${apiUrl}/cancel/${id}`, { method: 'PATCH' })
            if (!response.ok) {
                alert('Erro ao cancelar tarefa')
            }
            this._myTasks.run()
        }
        catch (err) {
            console.log(err)
        }
    }

    _handleClickToggleDayGroup(e: Event) {        
        const target = e.currentTarget as HTMLElement
        const dayGroup = target.parentNode as HTMLElement
        dayGroup?.classList.toggle('collapsed')        
    }

    _handleSubmitForm(e: Event) {        
        const form = e.target as HTMLFormElement               
        const formData = new FormData(form)                
        const formValues = Object.fromEntries(formData.entries())
        if (!formValues.taskTitle) {
            alert('Campo titulo é obrigatório')
            e.preventDefault()
        }
        if (!formValues.taskType) {
            alert('Selecione o tipo da tarefa')
            e.preventDefault()
        }
        if (this.isEditMode) {
            console.log('Modo edição')
        }
        else {
            console.log('Modo inserção')
        }
        this.isEditMode = false
    }

    _template(item: any) {
        if (!item || !item.length) {
            return html`<p>Não existem tarefas para exibir</p>`
        }        
        const addTask = html`<button class="add-task-btn" @click="${this._showTaskModal}">+</button>`
        const taskModal = html`     
            <div id="taskModal" class="modal ${this.showModal ? 'show': ''}">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Nova Tarefa</h2>                        
                    </div>
                    
                    <form id="taskForm" @submit="${this._handleSubmitForm}">
                        <div class="form-group">
                            <label class="form-label" for="taskTitle">Título *</label>
                            <input 
                                .value="${this.taskTitle}"                                
                                id="taskTitle" 
                                class="form-input" 
                                placeholder="Digite o título da tarefa..."
                                name="taskTitle"
                            >
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="taskDescription">Descrição</label>
                            <textarea 
                                .value="${this.taskDescription}"
                                id="taskDescription" 
                                class="form-textarea"                                
                                placeholder="Descreva os detalhes da tarefa... (opcional)"
                                rows="3"
                                name="taskDescription"
                            ></textarea>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="taskType">Tipo da Tarefa *</label>
                            <select .value="${this.taskTypeSelectedValue}" id="taskType" class="form-select" name="taskType" @change="${this._handleSelectChange}">
                                <option value="">Selecione o tipo da tarefa...</option>
                                <option value="0">Urgente</option>
                                <option value="1">Normal</option>
                                <option value="2">Alinhamento de Equipe</option>
                                <option value="3">Treinamento</option>
                                <option value="4">Administrativo</option>
                            </select>
                            <div id="taskTypePreview" class="task-type-preview" style="display: none;">
                                <div id="previewColor" class="task-type-color"></div>
                                <span id="previewName" class="task-type-name"></span>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="${this._closeTaskModal}">
                                Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary" id="saveTaskBtn">
                                Salvar Tarefa
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `
        if (this.isGroupedByDay) {            
            return html`
                <div class="container" id="tasks-grouped">
                    ${map(item, (g: any) => html`
                    <div class="day-group">
                        <div class="day-header" @click="${this._handleClickToggleDayGroup}">
                            <div class="day-title">${formatDateToFullText(g.day)}</div>
                            <div class="day-summary">${g.tasks?.length} tarefa(s) • ${g.tasks?.filter(function(i: any) { return i.isCompleted }).length} completa(s) • ${g.tasks?.filter(function(i: any) { return !i.isCompleted && !i.isCaceled }).length} pendente(s) • ${g.tasks?.filter(function(i: any) { return i.isCaceled }).length} cancelada(s) </div>
                            <span class="collapse-icon">▼</span>
                        </div>
                        <div class="tasks-list">
                            ${map(g.tasks, (t: any) => html`
                                <div class="task-item" data-type="${t.taskTypeString}">
                                <div class="task-content">                                        
                                    <div class="task-details">
                                        <div class="task-title">${t.title}</div>
                                        <div class="task-description">${t.description}</div>                                        
                                    </div>                                        
                                    ${t.isCaceled ? html`<div class="status-badge status-cancelled">Cancelada</div>` : !t.isCompleted ? html`<div class="status-badge status-pending">Pendente</div>` : html`<div class="status-badge status-completed">Completa</div>`}
                                </div>
                                <div class="task-actions">
                                    <button class="action-btn btn-view" onclick="viewTask(this)">Ver</button>
                                    ${(t.isCaceled || t.isCompleted) ? '' : html`<button class="action-btn btn-complete" @click="${this._completeTaskHandleClick}" id="${t.id}">Concluir</button>`}
                                    ${!t.isCaceled && !t.isCompleted ? html`<button class="action-btn btn-cancel" @click="${this._cancelTaskHandleClick}" id="${t.id}">Cancelar</button>` : ''}
                                </div>
                            </div>
                            `)}
                        </div>
                    </div>
                    `)}
                </div>                
                ${taskModal}
                ${addTask}
            `
        }
        else {            
            return html`
                <div class="flat-container" id="task-list-no-grouped">                    
                    <div class="tasks-list">
                        ${map(item, (t: any) => html`
                            <div class="task-item" data-type="${t.taskTypeString}">
                            <div class="task-content">
                                <div class="task-details">
                                    <div class="task-title">${t.title}</div>
                                    <div class="task-description">${t.description}</div>
                                    <div class="task-date">${formatDate(t.createdAt)}</div>                                    
                                </div>
                                ${t.isCaceled ? html`<div class="status-badge status-cancelled">Cancelada</div>` : !t.isCompleted ? html`<div class="status-badge status-pending">Pendente</div>` : html`<div class="status-badge status-completed">Completa</div>`}
                            </div>
                            <div class="task-actions">
                                <button class="action-btn btn-view" onclick="viewTask(this)">Ver</button>
                                ${(t.isCaceled || t.isCompleted) ? '' : html`<button class="action-btn btn-complete" onclick="completeTask(this)">Concluir</button>`}
                                ${!t.isCaceled && !t.isCompleted ? html`<button class="action-btn btn-cancel" @click="${this._cancelTaskHandleClick}" id="${t.id}">Cancelar</button>` : ''}
                            </div>
                        </div>
                        `)}
                    </div>
                </div>
                ${taskModal}
                ${addTask}
            `
        }
    }

    render() {
        const colorLegend = html`
            <!-- Legenda de cores -->
            <div class="legend">
                <h3>Tipos de Tarefas</h3>
                <div class="legend-items">
                    <div class="legend-item">
                        <div class="legend-color urgent"></div>
                        <span>Urgente</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color normal"></div>
                        <span>Normal</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color team"></div>
                        <span>Alinhamento de Equipe</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color training"></div>
                        <span>Treinamento</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color admin"></div>
                        <span>Administrativo</span>
                    </div>
                </div>
            </div>            
        `
        const header = html`
        <div class="header">
            <h1>TAREFAS</h1>
            <div class="header-controls">                
                <div class="search-container">
                    <span class="search-icon">🔍</span>
                    <input type="text" class="search-input" placeholder="Buscar tarefas..." id="searchInput" oninput="searchTasks()">
                </div>
                <div class="group-toggle" .value="${this.isGroupedByDay}" @click="${this._spanCheckBoxHandleClick}">
                    <div class="checkbox ${this.isGroupedByDay ? "checked" : ''}"></div>
                    <span>Agrupar por dia</span>
                </div>                
            </div>            
            <div class="header-info">
                <span id="current-date"></span>
            </div>            
        </div>
        ${colorLegend}
        `
        return this._myTasks.render({
            pending: () => html`${header}<p>Buscando tarefas...</p>`,
            complete: (item) => {                
                return html`${header}${this._template(item)}`
            },
            error: (e) => html`<p>Error: ${e}</p>`
        })
    }
}

window.customElements.define('tarefando-app', MyTaskComponent)
