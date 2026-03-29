import eventManager from "../manager/EventManager.js";
import gameManager from "../manager/GameManager.js";

/**
 * BanGLife
 *
 * 事件数据类。
 *
 * @author 季楠
 * @since 2026/3/19 23:29
 */
class Event {
    constructor(data = {}) {
        this.id = data.id ?? '';
        this.title = data.title ?? '';
        this.description = data.description ?? '';
        this.priority = data.priority ?? 0;
        this.weight = data.weight ?? 0;
        this.condition = data.condition ?? (() => true);
        this.action = data.action ?? (() => {
        });
        this.options = data.options ?? [];
        this.cost = data.cost ?? 0;
        this.author = data.author ?? 'BanGLife';
    }

    /**
     * 反序列化。
     *
     * @param data 事件数据。
     * @return {Event} 事件实例。
     */
    static fromJSON(data) {
        return new Event({
            ...data,
            description: data.description.includes('=>') ? eval(`(${data.description})`) : data.description,
            condition: eval(`(${data.condition})`),
            action: eval(`(${data.action})`),
            options: data.options.map(option => Event.fromJSON(option))
        });
    }

    /**
     * 序列化。
     *
     * @return {Object} 事件数据。
     */
    toJSON() {
        return {
            ...this,
            description: typeof this.description === 'function' ? this.description.toString() : this.description,
            condition: this.condition.toString(),
            action: this.action.toString(),
            options: this.options.map(option => option.toJSON())
        };
    }

    /**
     * 注册事件。
     */
    register() {
        eventManager.registerEvent(this.id, this);
    }

    /**
     * 注销事件。
     */
    unregister() {
        eventManager.unregisterEvent(this.id);
    }

    /**
     * 获取事件描述。
     *
     * @param player 玩家。
     * @return {string} 请求的事件描述。
     */
    getDescription(player) {
        if (typeof this.description === 'function') this.description = this.description(player);
        return this.description;
    }

    /**
     * 检查事件是否可用。
     *
     * @param player 玩家。
     * @return {boolean} 如果事件可用，则返回 true，否则返回 false。
     */
    isAvailable(player) {
        return this.condition(player);
    }

    /**
     * 执行事件。
     *
     * @param player 玩家。
     */
    execute(player) {
        if (gameManager.currentEvent != null) {
            gameManager.eventHistory.push({
                round: gameManager.round,
                event: gameManager.currentEvent
            });
        }
        this.action(player);
        player.removeEnergy(this.cost);
        gameManager.currentEvent = this;
    }
}

export default Event;