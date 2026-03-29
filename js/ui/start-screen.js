/**
 * BanGLife
 *
 * 开始界面。
 *
 * @author 季楠
 * @since 2026/3/22 16:30
 */

// DOM 元素缓存。
const elements = {
    // 输入框。
    playerNameInput: document.getElementById('player-name-input'),
    playerAliasInput: document.getElementById('player-alias-input'),

    // 属性显示。
    intelligenceValue: document.getElementById('intelligence-value'),
    staminaValue: document.getElementById('stamina-value'),
    charmValue: document.getElementById('charm-value'),
    remainingPoints: document.getElementById('remaining-points'),

    // 按钮。
    startGameButton: document.getElementById('start-game-button'),
    pointButtons: document.querySelectorAll('.point-button'),
};

// 属性点数。
let attributes = {
    intelligence: 5,
    stamina: 5,
    charm: 5,
};

// 剩余属性点数。
let remainingPoints = 5;

// 初始化开始界面。
export function initStartScreen() {
    // 绑定事件。
    elements.pointButtons.forEach(button => {
        button.addEventListener('click', handleAttributePointChange);
    });
    elements.startGameButton.addEventListener('click', startGame);

    // 更新属性点数显示。
    elements.intelligenceValue.textContent = attributes.intelligence;
    elements.staminaValue.textContent = attributes.stamina;
    elements.charmValue.textContent = attributes.charm;

    updateRemainingPoints();
    updatePointButtons();
}

// 处理属性点数变化。
function handleAttributePointChange(event) {
    const attribute = event.target.dataset.attribute;
    const action = event.target.dataset.action;

    if (action === 'increase' && remainingPoints > 0) {
        attributes[attribute]++;
        remainingPoints--;
    } else if (action === 'decrease' && attributes[attribute] > 5) {
        attributes[attribute]--;
        remainingPoints++;
    }

    document.getElementById(`${attribute}-value`).textContent = attributes[attribute];
    updateRemainingPoints();
    updatePointButtons();
}

// 更新剩余属性点数显示。
function updateRemainingPoints() {
    elements.remainingPoints.textContent = String(remainingPoints);
}

// 更新分配属性点数按钮状态。
function updatePointButtons() {
    elements.pointButtons.forEach(button => {
        const attribute = button.dataset.attribute;
        const action = button.dataset.action;

        if (action === 'increase') {
            button.disabled = remainingPoints <= 0;
        } else if (action === 'decrease') {
            button.disabled = attributes[attribute] <= 5;
        }
    });
}

// 开始游戏。
export function startGame() {
    const playerName = elements.playerNameInput.value.trim();
    const playerAlias = elements.playerAliasInput.value.trim();

    if (!playerName) {
        alert('请输入玩家名称。');
        return;
    }

    if (remainingPoints > 0) {
        alert('请完成属性点数分配。');
        return;
    }

    return {
        name: playerName,
        alias: playerAlias,
        attributes: {
            intelligence: attributes.intelligence,
            stamina: attributes.stamina,
            charm: attributes.charm,
        },
    };
}