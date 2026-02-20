import { css } from "lit";

export const style = css`
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

    .pending-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        background-color: #3a3a3a;
        border: 1px solid #555;
        border-radius: 20px;
        padding: 4px 12px;
        font-size: 13px;
        color: #ccc;
    }

    .pending-badge .pending-count {
        background-color: #f0a500;
        color: #1a1a1a;
        font-weight: bold;
        font-size: 15px;
        border-radius: 10px;
        padding: 1px 7px;
        min-width: 20px;
        text-align: center;
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        scroll;
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

    .color-pendent {
        color: #f0a500;
    }

    /* Estilos para modo não agrupado */
    .flat-container {            
        margin: 0 auto;
        padding: 20px;
        max-width: 800px;
        background-color: #2d2d2d;
        border-radius: 12px;
        scroll;
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

    .empty-message { color: white; }

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