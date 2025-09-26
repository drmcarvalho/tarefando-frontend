import { Task } from "@lit/task";
import { LitElement, html, css } from "lit";
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

class MyTaskComponent extends LitElement {
    static styles = css`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #1a1a1a;
            color: #535050ff;
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

        .header-info {
            font-size: 14px;
            color: #999;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

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
        }
    `        

    _myTasks = new Task(this, {        
        task: async([], {signal}) => {
            try {                
                const response = await fetch(`${apiUrl}/criteria?grouped=true`, {signal})
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

    private _grouped(item: any) {
        return html`
            <div class="container">
                ${map(item, (g: any) => html`
                <div class="day-group">
                    <div class="day-header" @click="${this._handleClickToggleDayGroup}">
                        <div class="day-title">${formatDateToFullText(g.day)}</div>
                        <div class="day-summary">${g.tasks?.length} tarefa(s) • ${g.tasks?.filter(function(i: any) { return i.isCompleted }).length} completa(s) • ${g.tasks?.filter(function(i: any) { return !i.isCompleted && !i.isCaceled }).length} pendente(s) • ${g.tasks?.filter(function(i: any) { return i.isCaceled }).length} cancelada(s) </div>
                        <span class="collapse-icon">▼</span>
                    </div>
                    <div class="tasks-list">
                        ${map(g.tasks, (t: any) => html`
                            <div class="task-item" data-status="pending">
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
                                <button class="action-btn btn-cancel" onclick="cancelTask(this)">Cancelar</button>
                            </div>
                        </div>
                        `)}
                    </div>
                </div>
                `)}
            </div>
        `
    }

    render() {
        const header = html`
        <div class="header">
            <h1>TAREFAS</h1>
            <div class="header-info">
                <span id="current-date"></span>
            </div>
        </div>`

        return this._myTasks.render({
            pending: () => html`${header}<p>Buscando tarefas...</p>`,
            complete: (item) => {
                console.log(item)
                return html`${header}${this._grouped(item)}`                
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