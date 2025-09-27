import { Task } from "@lit/task";
import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { map } from "lit/directives/map.js";


const apiUrl: String = "https://localhost:7222/api/tasks"

function formatDateToFullText(dataString: string): string {
  const data = new Date(dataString);
  
  const opcoes: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Sao_Paulo'
  };
  
  return data.toLocaleDateString('pt-BR', opcoes);
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
            margin-bottom: 20px;
            background-color: #2d2d2d;            
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
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
        }
    `

    @property({ type: Boolean }) isGroupedByDay = false    

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

    _template(item: any) {
        if (!item || !item.length) {
            return html`<p>Não existem tarefas para exibir</p>`
        }        
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
        if (this.isGroupedByDay) {            
            return html`
                <div class="container" id="tasks-grouped">                    
                    ${colorLegend}
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
                                    <button class="action-btn btn-complete" onclick="completeTask(this)">Concluir</button>
                                    <button class="action-btn btn-cancel" @click="${this._cancelHandleClick}" id="${t.id}">Cancelar</button>
                                </div>
                            </div>
                            `)}
                        </div>
                    </div>
                    `)}
                </div>
            `
        }
        else {            
            return html`
                <div class="flat-container" id="task-list-no-grouped">
                    ${colorLegend}
                    <div class="tasks-list">
                        ${map(item, (t: any) => html`
                            <div class="task-item" data-type="${t.taskTypeString}">
                            <div class="task-content">
                                <div class="task-details">
                                    <div class="task-title">${t.title}</div>
                                    <div class="task-description">${t.description}</div>
                                    <div class="task-date">${formatDate(t.createdAt)}</div>
                                    <div class="task-description">${t.taskTypeString}</div>
                                </div>
                                ${t.isCaceled ? html`<div class="status-badge status-cancelled">Cancelada</div>` : !t.isCompleted ? html`<div class="status-badge status-pending">Pendente</div>` : html`<div class="status-badge status-completed">Completa</div>`}
                            </div>
                            <div class="task-actions">
                                <button class="action-btn btn-view" onclick="viewTask(this)">Ver</button>
                                <button class="action-btn btn-complete" onclick="completeTask(this)">Concluir</button>
                                <button class="action-btn btn-cancel" @click="${this._cancelHandleClick}" id="${t.id}">Cancelar</button>
                            </div>
                        </div>
                        `)}
                    </div>
                </div>
            `
        }
    }

    _spanCheckBoxHandleClick() {
        this.isGroupedByDay = !this.isGroupedByDay
        this._myTasks.run()
    }

    async _cancelHandleClick(e: Event) {        
        try {
            const target = e.currentTarget as HTMLElement
            const id = target?.getAttribute('id')
            const response = await fetch(`${apiUrl}/cancel/${id}`, {method: 'PATCH'})
            if (!response.ok) {
                alert('Erro ao cancelar tarefa')
            }
            this._myTasks.run()
        }
        catch (err) {
            console.log(err)
        }
    }

    render() {
        const header = html`
        <div class="header">
            <h1>TAREFAS</h1>
            <div class="header-controls">
                <div class="group-toggle" .value="${this.isGroupedByDay}" @click="${this._spanCheckBoxHandleClick}">
                    <div class="checkbox ${this.isGroupedByDay ? "checked" : ''}"></div>
                    <span>Agrupar por dia</span>
                </div>                
            </div>            
            <div class="header-info">
                <span id="current-date"></span>
            </div>
        </div>`

        return this._myTasks.render({
            pending: () => html`${header}<p>Buscando tarefas...</p>`,
            complete: (item) => {                
                return html`${header}${this._template(item)}`
            },
            error: (e) => html`<p>Error: ${e}</p>`
        })
    }    
    
    _handleClickToggleDayGroup(e: Event) {        
        const target = e.currentTarget as HTMLElement
        const dayGroup = target.parentNode as HTMLElement
        dayGroup?.classList.toggle('collapsed')        
    }    
}

window.customElements.define('tarefando-app', MyTaskComponent)