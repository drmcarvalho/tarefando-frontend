import { Task } from "@lit/task";
import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { classMap } from "lit/directives/class-map.js";
import { style } from "./styles/style";

const apiUrl: string = "http://localhost:5235/api/tasks"

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
    static styles = style

    @property({ type: Boolean }) isGroupedByDay = false 
    @property({ type: String }) searchTerm = ""   
    @property({ type: Array }) _searchResults: any[] = []
    @property({ type: Boolean }) showModal = false    
    @property({ type: Number }) idTask = 0
    @property({ type: String }) taskTitle = ""    
    @property({ type: String }) taskDescription = ""
    @property({ type: String }) taskTypeSelectedValue = ""
    @property({ type: Boolean }) isEditMode = false
    @property({ type: Number }) pendingTasksCount = 0

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

    _pendingCountTask = new Task(this, {
        task: async ([], { signal }) => {
            try {
                const response = await fetch(`${apiUrl}/count-pending`, { signal })
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

    willUpdate() {
        if (this._pendingCountTask.value !== undefined) {
            this.pendingTasksCount = this._pendingCountTask.value
        }
    }

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

    _handleSearchInput(e: Event) {
        const target = e.target as HTMLInputElement
        this.searchTerm = target.value
        this._fetchSearchResults()
    }

     _groupTasksByDay(tasks: any[]) {
        const grouped: any[] = []
        const map = new Map<string, any[]>()

        tasks.forEach(task => {
            const rawDate = task.createdAt ?? task.date ?? task.created_at ?? task.timestamp ?? null
            if (!rawDate) return
            const dateObj = (typeof rawDate === 'number') ? new Date(rawDate) : new Date(String(rawDate))
            if (isNaN(dateObj.getTime())) return
            const day = dateObj.toISOString().split('T')[0]
            if (!map.has(day)) {
                map.set(day, [])
            }
            map.get(day)!.push(task)
        })

        map.forEach((tasksForDay, day) => {
            grouped.push({ day, tasks: tasksForDay })
        })

        grouped.sort((a, b) => (a.day < b.day ? 1 : -1))

        return grouped
    }

    _closeTaskModal() {   
        this.taskTitle = ""
        this.taskDescription = ""
        this.taskTypeSelectedValue = ""
        
        this.requestUpdate()

        this.showModal = false
        const modal = document.getElementById('taskModal')
        modal?.classList.remove('show')
        document.body.style.overflow = 'auto'
        this.isEditMode = false
        const preview = document.getElementById('taskTypePreview')
        if (preview) {
            preview.style.display = 'none'
        }      
    }

    _spanCheckBoxHandleClick() {
        this.isGroupedByDay = !this.isGroupedByDay

        if (this.searchTerm.trim()) {
            const normalizedTasks = this._searchResults.flatMap(g => g.tasks ?? [g]).map(task => {
                const rawDate = task.createdAt ?? task.date ?? task.created_at ?? task.timestamp ?? null
                if (!rawDate) return task
                const dateObj = (typeof rawDate === 'number') ? new Date(rawDate) : new Date(String(rawDate))
                return {...task, createdAt: isNaN(dateObj.getTime()) ? null : dateObj.toISOString()}
            })

            this._searchResults = this.isGroupedByDay
                ? this._groupTasksByDay(normalizedTasks)
                : normalizedTasks
        }

        this._myTasks.run()
    }

    async _completeTaskHandleClick(e: Event) {
        try {
            const target = e.currentTarget as HTMLElement;
            const id = target?.getAttribute('id');
            if (!id) return;

            const response = await fetch(`${apiUrl}/complete/${id}`, { method: 'PATCH' });
            if (!response.ok) {
                alert('Erro ao completar tarefa');
                return;
            }

            this._searchResults = this._searchResults.map(taskOrGroup => {
                if (this.isGroupedByDay && taskOrGroup.tasks) {
                    taskOrGroup.tasks = taskOrGroup.tasks.map((t: any) => {
                        if (String(t.id) === id) t.isCompleted = true;
                        return t;
                    });
                } else if (!this.isGroupedByDay && String(taskOrGroup.id) === id) {
                    taskOrGroup.isCompleted = true;
                }
                return taskOrGroup;
            });

            this.requestUpdate();
            this._myTasks.run();
            this._pendingCountTask.run();

        } catch (err) {
            console.log(err);
        }
    }


    async _cancelTaskHandleClick(e: Event) {        
        try {
            const target = e.currentTarget as HTMLElement;
            const id = target?.getAttribute('id');
            if (!id) return;

            const response = await fetch(`${apiUrl}/cancel/${id}`, { method: 'PATCH' });
            if (!response.ok) {
                alert('Erro ao cancelar tarefa');
                return;
            }
            this._searchResults = this._searchResults.map(taskOrGroup => {
                if (this.isGroupedByDay && taskOrGroup.tasks) {
                    taskOrGroup.tasks = taskOrGroup.tasks.map((t: any) => {
                        if (String(t.id) === id) t.isCaceled = true;
                        return t;
                    });
                } else if (!this.isGroupedByDay && String(taskOrGroup.id) === id) {
                    taskOrGroup.isCaceled = true;
                }
                return taskOrGroup;
            });

            this.requestUpdate();
            this._myTasks.run();
            this._pendingCountTask.run();

        } catch (err) {
            console.log(err);
        }
    }

    async _viewHandleClick(e: Event) {        
        try {
            const target = e.currentTarget as HTMLElement
            const id = target?.getAttribute('id')
            const response = await fetch(`${apiUrl}/${id}`)
            if (!response.ok) {
                alert('Erro ao visualizar tarefa')
                return
            }
            const content = await response.json()
            this.taskTitle = content?.title
            this.taskDescription = content?.description
            this.idTask = content?.id
            this.taskTypeSelectedValue = content?.taskType
            this.isEditMode = true
            this._showTaskModal()
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

    async _handleSubmitForm(e: Event) {
        e.preventDefault()
        const form = e.target as HTMLFormElement               
        const formData = new FormData(form)                
        const formValues = Object.fromEntries(formData.entries())
        if (!formValues.title) {
            alert('Campo titulo é obrigatório')
            e.preventDefault()
            return
        }
        if (!formValues.taskType) {
            alert('Selecione o tipo da tarefa')
            e.preventDefault()
            return
        }
        if (this.isEditMode && this.idTask > 0) {
            try {
                const response = await fetch(`${apiUrl}/${this.idTask}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                                "title": formValues.title,
                                "taskType": Number(formValues.taskType),
                                "description": formValues.description
                            }
                        ),
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }
                )
                if (!response.ok) {
                    alert('Erro ao efetuar alterção de tarefa')
                    e.preventDefault()
                    return
                }
            }
            catch(err) {                
                console.log(err)
            }
        }
        else {
            try {
                const response = await fetch(`${apiUrl}`, {
                        method: 'POST',
                        body: JSON.stringify({
                                "title": formValues.title,
                                "taskType": Number(formValues.taskType),
                                "description": formValues.description
                            }
                        ),
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }
                )
                if (!response.ok) {
                    alert('Erro ao efetuar cadastro de tarefa')
                    e.preventDefault()
                    return
                }                
            }
            catch(err) {                
                console.log(err)
            }
        }

        this._closeTaskModal()

        this.isEditMode = false
        this.idTask = 0
        this.showModal = false
        this.searchTerm = ""
        this._searchResults = []
        await this._myTasks.run()
        this._pendingCountTask.run()
    }

    async _fetchSearchResults() {
        const term = this.searchTerm.trim().toLowerCase()

        if (!term) {
            this._searchResults = []
            this.requestUpdate()
            return
        }

        try {
            const response = await fetch(`${apiUrl}/criteria?q=${encodeURIComponent(term)}`)
            if (!response.ok) throw new Error(`Erro na busca: ${response.status}`)

            const data = await response.json()
            const filtered = data.filter((t: any) => 
                t.title?.toLowerCase().includes(term) || 
                t.description?.toLowerCase().includes(term)
            )

            this._searchResults = this.isGroupedByDay 
                ? this._groupTasksByDay(filtered)
                : filtered

            this.requestUpdate()
        } catch (err) {
            console.error(err)
        }
    }


    _template(item: any) {
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
                                id="taskTitle"
                                class="form-input"
                                name="title"
                                .value="${this.taskTitle}"
                                @input="${(e: Event) => this.taskTitle = (e.target as HTMLInputElement).value}"
                                placeholder="Digite o título da tarefa..."
                            >
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="taskDescription">Descrição</label>
                            <textarea
                                id="taskDescription"
                                class="form-textarea"
                                name="description"
                                .value="${this.taskDescription}"
                                @input="${(e: Event) => this.taskDescription = (e.target as HTMLTextAreaElement).value}"
                                placeholder="Descreva os detalhes da tarefa..."
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

        if (!item || !item.length) {
            return html`
                <p class="empty-message">Não existem tarefas para exibir</p>
                ${addTask}
                ${taskModal} 
            `
        }

        if (this.isGroupedByDay) {            
            return html`
                <div class="container" id="tasks-grouped">
                    ${map(item, (g: any) => { 
                        const pendingCount = g.tasks?.filter((i: any) => !i.isCompleted && !i.isCaceled).length ?? 0
                        return html`
                        <div class="day-group">
                            <div class="day-header" @click="${this._handleClickToggleDayGroup}">
                                <div class="day-title">${formatDateToFullText(g.day)}</div>
                                <div class="day-summary">${g.tasks?.length} tarefa(s) • ${g.tasks?.filter(function(i: any) { return i.isCompleted }).length} completa(s) • <span class=${classMap({'color-pendent': pendingCount > 0 })}>${pendingCount} pendente(s)</span> • ${g.tasks?.filter(function(i: any) { return i.isCaceled }).length} cancelada(s)</div>
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
                                            <button class="action-btn btn-view" @click="${this._viewHandleClick}" id="${t.id}">Ver</button>
                                            ${(t.isCaceled || t.isCompleted) ? '' : html`<button class="action-btn btn-complete" @click="${this._completeTaskHandleClick}" id="${t.id}">Concluir</button>`}
                                            ${!t.isCaceled && !t.isCompleted ? html`<button class="action-btn btn-cancel" @click="${this._cancelTaskHandleClick}" id="${t.id}">Cancelar</button>` : ''}
                                        </div>
                                    </div>
                                `)}
                            </div>
                        </div>`
                    })}
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
                                <button class="action-btn btn-view" @click="${this._viewHandleClick}" id="${t.id}">Ver</button>
                                ${(t.isCaceled || t.isCompleted) ? '' : html` <button class="action-btn btn-complete" @click="${this._completeTaskHandleClick}" id="${t.id}">Concluir</button>`}
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
        let itemsToRender = this.searchTerm.trim() ? this._searchResults : this._myTasks.value || []

        if (this.isGroupedByDay && !this.searchTerm.trim() && Array.isArray(itemsToRender) && !itemsToRender[0]?.day) {
            itemsToRender = this._groupTasksByDay(itemsToRender)
        }

        if (!itemsToRender) itemsToRender = []

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
                    <input type="text" class="search-input" placeholder="Buscar tarefas..." @input="${this._handleSearchInput}">
                </div>
                <div class="group-toggle" .value="${this.isGroupedByDay}" @click="${this._spanCheckBoxHandleClick}">
                    <div class="checkbox ${this.isGroupedByDay ? "checked" : ''}"></div>
                    <span>Agrupar por dia</span>
                </div>                
            </div>            
            <div class="header-info">
                <div class="pending-badge">
                    <span>Pendentes</span>
                    <span class="pending-count">${this.pendingTasksCount}</span>
                </div>
            </div>
        </div>
        ${colorLegend}
        `
        
        return html`${header}${this._template(itemsToRender)}`
    }
}

window.customElements.define('tarefando-app', MyTaskComponent)
