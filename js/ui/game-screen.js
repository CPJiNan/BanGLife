import gameManager from '../manager/GameManager.js';
import eventManager from '../manager/EventManager.js';
import saveManager from '../manager/SaveManager.js';
import defaultEvents from '../event/DefaultEvents.js';
import {startGame} from './start-screen.js';

/**
 * BanGLife
 *
 * 游戏界面。
 *
 * @author 季楠
 * @since 2026/3/22 16:17
 */

// DOM 元素缓存。
const elements = {
    // 页面容器。
    startScreen: document.getElementById('start-screen'),
    gameContainer: document.getElementById('game-screen'),
    attributePanel: document.getElementById('attribute-panel'),
    socialPanel: document.getElementById('social-panel'),
    savePanel: document.getElementById('save-panel'),
    sidebar: document.getElementById('sidebar'),

    // 按钮。
    actionButtons: document.querySelector('.action-buttons'),
    nextEventButton: document.getElementById('next-event-button'),
    attributesButton: document.getElementById('attributes-button'),
    attributePanelClose: document.getElementById('attribute-panel-close'),
    socialButton: document.getElementById('social-button'),
    socialPanelClose: document.getElementById('social-panel-close'),
    saveButton: document.getElementById('save-button'),
    savePanelClose: document.getElementById('save-panel-close'),
    settingsButton: document.getElementById('settings-button'),
    startGameButton: document.getElementById('start-game-button'),
    loadGameButton: document.getElementById('load-game-button'),
    sidebarToggle: document.getElementById('sidebar-toggle'),

    // 显示元素。
    round: document.getElementById('round'),
    playerNameDisplay: document.getElementById('player-name-display'),
    energy: document.getElementById('energy'),
    maxEnergy: document.getElementById('max-energy'),
    intelligence: document.getElementById('intelligence'),
    stamina: document.getElementById('stamina'),
    charm: document.getElementById('charm'),
    eventTitle: document.getElementById('event-title'),
    eventDescription: document.getElementById('event-description'),
    historyList: document.getElementById('event-history-list'),

    // 属性面板元素。
    intelligenceDetail: document.getElementById('intelligence-detail'),
    staminaDetail: document.getElementById('stamina-detail'),
    charmDetail: document.getElementById('charm-detail'),
    vocalDetail: document.getElementById('vocal-detail'),
    keyboardDetail: document.getElementById('keyboard-detail'),
    guitarDetail: document.getElementById('guitar-detail'),
    bassDetail: document.getElementById('bass-detail'),
    drumDetail: document.getElementById('drum-detail'),

    // 存档面板元素。
    saveSlots: document.getElementById('save-slots'),

    // 社交面板元素。
    affectionContent: document.getElementById('affection-content'),
};

// 初始化游戏界面。
export function initGameScreen() {
    // 注册事件。
    defaultEvents.forEach(event => event.register());

    // 绑定事件。
    elements.nextEventButton.addEventListener('click', handleMainAction);
    elements.attributesButton.addEventListener('click', toggleAttributePanel);
    elements.attributePanelClose.addEventListener('click', toggleAttributePanel);
    elements.socialButton.addEventListener('click', toggleSocialPanel);
    elements.socialPanelClose.addEventListener('click', toggleSocialPanel);
    elements.saveButton.addEventListener('click', toggleSavePanel);
    elements.savePanelClose.addEventListener('click', toggleSavePanel);
    elements.settingsButton.addEventListener('click', () => alert('功能暂未实现。'));
    elements.startGameButton.addEventListener('click', handleStartGame);
    elements.loadGameButton.addEventListener('click', toggleSavePanel);
    if (elements.sidebarToggle) elements.sidebarToggle.addEventListener('click', toggleSidebar);

    updateUI();
}

// 开始游戏。
function handleStartGame() {
    const playerData = startGame();
    if (!playerData) return;

    gameManager.startGame(playerData);
    elements.startScreen.style.display = 'none';
    elements.gameContainer.classList.add('active');
    updateUI();
}

// 下一事件按钮。
function handleMainAction() {
    if (!gameManager.player) return;
    gameManager.nextEvent();
}

// 切换侧边栏。
function toggleSidebar() {
    if (elements.sidebar) elements.sidebar.classList.toggle('active');
}

// 切换属性面板。
function toggleAttributePanel() {
    elements.attributePanel.classList.toggle('active');
}

// 切换社交面板。
function toggleSocialPanel() {
    elements.socialPanel.classList.toggle('active');
    if (elements.socialPanel.classList.contains('active')) updateSocialPanel();
}

// 切换存档面板。
function toggleSavePanel() {
    elements.savePanel.classList.toggle('active');
    if (elements.savePanel.classList.contains('active')) updateSavePanel();
}

// 滚动事件历史到底部。
export function scrollToBottom() {
    const container = document.querySelector('.event-history-container');
    if (container) container.scrollTop = container.scrollHeight;
}

// 更新 UI。
export function updateUI() {
    if (!gameManager.player) {
        setDefaultUI();
        return;
    }

    // 更新玩家信息。
    elements.round.textContent = gameManager.round;
    elements.playerNameDisplay.textContent = gameManager.player.name;
    elements.energy.textContent = gameManager.player.energy;
    elements.maxEnergy.textContent = gameManager.player.maxEnergy;
    elements.intelligence.textContent = gameManager.player.attributes.intelligence;
    elements.stamina.textContent = gameManager.player.attributes.stamina;
    elements.charm.textContent = gameManager.player.attributes.charm;

    // 更新当前事件。
    const currentEvent = gameManager.currentEvent;
    if (currentEvent) {
        elements.eventTitle.textContent = currentEvent.title;
        elements.eventDescription.innerHTML = currentEvent.getDescription(gameManager.player);
        updateEventOptions(currentEvent);
    } else {
        elements.eventTitle.textContent = '暂无事件';
        elements.eventDescription.textContent = '点击下一事件按钮获取事件。';
        clearEventOptions();
    }

    updateAttributeDetails();
    updateEventHistory();
    updateNextEventButton();
    if (elements.socialPanel.classList.contains('active')) updateSocialPanel();
}

// 更新事件选项。
function updateEventOptions(event) {
    clearEventOptions();
    if (event.options && event.options.length > 0) {
        elements.nextEventButton.style.display = 'none';
        event.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.className = 'action-button';
            optionButton.innerHTML = `<span class="square-decoration"></span><span>选项 ${index + 1}: ${option.title}</span>`;

            const isAvailable = option.condition(gameManager.player);
            optionButton.disabled = !isAvailable;
            if (isAvailable) {
                optionButton.addEventListener('click', () => {
                    option.execute(gameManager.player);
                    updateUI();
                    scrollToBottom();
                });
            }
            elements.actionButtons.appendChild(optionButton);
        });
    } else {
        elements.nextEventButton.style.display = 'flex';
    }
}

// 清除事件选项按钮。
function clearEventOptions() {
    const buttons = elements.actionButtons.querySelectorAll('.action-button');
    buttons.forEach(button => {
        if (button.id !== 'next-event-button') button.remove();
    });
    elements.nextEventButton.style.display = 'flex';
}

// 设置默认 UI。
function setDefaultUI() {
    elements.energy.textContent = '3';
    elements.maxEnergy.textContent = '3';
    elements.intelligence.textContent = '5';
    elements.stamina.textContent = '5';
    elements.charm.textContent = '5';
    elements.eventTitle.textContent = '暂无事件';
    elements.eventDescription.textContent = '点击下一事件按钮获取事件。';
    elements.historyList.innerHTML = '';

    // 清除选项按钮
    clearEventOptions();

    const span = elements.nextEventButton.querySelector('span:not(.square-decoration)');
    if (span) span.textContent = '下一回合';
}

// 更新事件历史列表。
function updateEventHistory() {
    elements.historyList.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (const item of gameManager.eventHistory) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>回合 ${item.round}: ${item.event.title}</strong><p>${item.event.getDescription(gameManager.player)}</p><p class="event-author">作者: ${item.event.author}</p>`;
        fragment.appendChild(li);
    }
    elements.historyList.appendChild(fragment);
}

// 更新下一事件按钮。
function updateNextEventButton() {
    const span = elements.nextEventButton.querySelector('span:not(.square-decoration)');
    if (!span) return;

    let text = '下一回合';
    if (gameManager.player && gameManager.player.energy > 0) {
        const availableEvents = eventManager.getAvailableEvents(gameManager.player);
        if (availableEvents.length > 0) text = '下一事件';
    }
    span.textContent = text;
}

// 更新属性面板。
function updateAttributeDetails() {
    if (!gameManager.player) return;
    const attributes = gameManager.player.attributes;
    elements.intelligenceDetail.textContent = attributes.intelligence;
    elements.staminaDetail.textContent = attributes.stamina;
    elements.charmDetail.textContent = attributes.charm;
    elements.vocalDetail.textContent = attributes.vocal;
    elements.keyboardDetail.textContent = attributes.keyboard;
    elements.guitarDetail.textContent = attributes.guitar;
    elements.bassDetail.textContent = attributes.bass;
    elements.drumDetail.textContent = attributes.drum;
}

// 更新社交面板。
function updateSocialPanel() {
    const affectionContent = elements.affectionContent;
    affectionContent.innerHTML = '';
    if (!gameManager.player) return;
    const affections = gameManager.player.affections;
    if (Object.keys(affections).length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = '暂无好感度数据';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.color = 'var(--text-light)';
        emptyMessage.style.marginTop = '20px';
        emptyMessage.style.gridColumn = '1 / -1';
        affectionContent.appendChild(emptyMessage);
    } else {
        Object.entries(affections).forEach(([character, value]) => {
            const affectionDetail = document.createElement('div');
            affectionDetail.className = 'affection-detail';
            affectionDetail.style.position = 'relative';
            affectionDetail.style.overflow = 'hidden';
            const characterName = document.createElement('span');
            characterName.className = 'character-name';
            characterName.textContent = character;
            const affectionValue = document.createElement('span');
            affectionValue.className = 'affection-value';
            affectionValue.textContent = value;
            affectionDetail.appendChild(characterName);
            affectionDetail.appendChild(affectionValue);
            affectionContent.appendChild(affectionDetail);
        });
    }
}

// 更新存档面板。
function updateSavePanel() {
    const saves = saveManager.getAllSave();
    const saveSlots = elements.saveSlots;
    saveSlots.innerHTML = '';

    saves.forEach(save => {
        const saveSlot = createSaveSlot(save.slot, save);
        saveSlots.appendChild(saveSlot);
    });

    const maxSlot = saves.length > 0 ? Math.max(...saves.map(save => save.slot)) : 0;
    const newSlot = maxSlot + 1;
    const newSaveSlot = createSaveSlot(newSlot, null);
    saveSlots.appendChild(newSaveSlot);
}

// 创建存档槽位元素。
function createSaveSlot(slot, save) {
    const slotElement = document.createElement('div');
    slotElement.className = 'save-slot';

    const saveInfo = document.createElement('div');
    saveInfo.className = 'save-info';

    const slotTitle = document.createElement('h4');
    slotTitle.textContent = `存档槽位 ${slot}`;
    saveInfo.appendChild(slotTitle);

    if (save) {
        const savePlayer = document.createElement('p');
        savePlayer.className = 'save-player';
        savePlayer.textContent = `玩家名称: ${save.player}`;
        saveInfo.appendChild(savePlayer);

        const saveRound = document.createElement('p');
        saveRound.className = 'save-round';
        saveRound.textContent = `当前回合: ${save.round}`;
        saveInfo.appendChild(saveRound);

        const saveVersion = document.createElement('p');
        saveVersion.className = 'save-version';
        saveVersion.textContent = `游戏版本: ${save.version}`;
        saveInfo.appendChild(saveVersion);

        const saveTime = document.createElement('p');
        saveTime.className = 'save-time';
        saveTime.textContent = `保存时间: ${new Date(save.time).toLocaleString()}`;
        saveInfo.appendChild(saveTime);
    }

    const saveActions = document.createElement('div');
    saveActions.className = 'save-actions';

    // 保存按钮。
    const saveButton = document.createElement('button');
    saveButton.className = 'save-button';
    saveButton.textContent = '保存';
    saveButton.addEventListener('click', () => handleSave(slot));
    saveActions.appendChild(saveButton);

    // 加载按钮。
    const loadButton = document.createElement('button');
    loadButton.className = 'save-button';
    loadButton.textContent = '加载';
    loadButton.disabled = !save;
    loadButton.addEventListener('click', () => handleLoad(slot));
    saveActions.appendChild(loadButton);

    // 导入按钮。
    const importButton = document.createElement('button');
    importButton.className = 'save-button';
    importButton.textContent = '导入';
    importButton.addEventListener('click', () => handleImport(slot));
    saveActions.appendChild(importButton);

    // 导出按钮。
    const exportButton = document.createElement('button');
    exportButton.className = 'save-button';
    exportButton.textContent = '导出';
    exportButton.disabled = !save;
    exportButton.addEventListener('click', () => handleExport(slot));
    saveActions.appendChild(exportButton);

    // 删除按钮。
    const deleteButton = document.createElement('button');
    deleteButton.className = 'save-button';
    deleteButton.textContent = '删除';
    deleteButton.disabled = !save;
    deleteButton.addEventListener('click', () => handleDelete(slot));
    saveActions.appendChild(deleteButton);

    slotElement.appendChild(saveInfo);
    slotElement.appendChild(saveActions);

    return slotElement;
}

// 处理保存操作。
function handleSave(slot) {
    saveManager.save(slot);
    updateSavePanel();
}

// 处理加载操作。
function handleLoad(slot) {
    saveManager.load(slot);
    elements.savePanel.classList.remove('active');
    elements.startScreen.style.display = 'none';
    elements.gameContainer.classList.add('active');
    updateUI();
}

// 处理导入操作。
function handleImport(slot) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const save = JSON.parse(event.target.result);
                    saveManager.importSave(slot, save);
                    updateSavePanel();
                } catch (error) {
                    alert('存档导入失败。');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// 处理导出操作。
function handleExport(slot) {
    saveManager.exportSave(slot);
}

// 处理删除操作。
function handleDelete(slot) {
    saveManager.deleteSave(slot);
    updateSavePanel();
}