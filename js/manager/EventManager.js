/**
 * BanGLife
 *
 * 事件管理器。
 *
 * @author 季楠
 * @since 2026/3/19 23:29
 */
class EventManager {
    constructor() {
        this.events = new Map();
    }

    /**
     * 获取事件。
     */
    getEvent(id) {
        return this.events.get(id);
    }

    /**
     * 注册事件。
     *
     * @param id 事件 ID。
     * @param event 事件。
     */
    registerEvent(id, event) {
        this.events.set(id, event);
    }


    /**
     * 注销事件。
     *
     * @param id 事件 ID。
     */
    unregisterEvent(id) {
        this.events.delete(id);
    }

    /**
     * 检查事件是否可用。
     *
     * @param id 事件 ID。
     * @param player 玩家。
     * @returns {boolean} 如果事件可用，则返回 true，否则返回 false。
     */
    isEventAvailable(id, player) {
        return this.getEvent(id).isAvailable(player);
    }

    /**
     * 执行事件。
     *
     * @param id 事件 ID。
     * @param player 玩家。
     */
    executeEvent(id, player) {
        this.getEvent(id).execute(player);
    }

    /**
     * 获取可用事件。
     *
     * @param player 玩家。
     * @return {Array} 请求的事件列表。
     */
    getAvailableEvents(player) {
        return [...this.events.values()].filter((event) => event.isAvailable(player));
    }

    /**
     * 获取下一个事件。
     *
     * @param player 玩家。
     * @return {Event} 请求的事件。
     */
    getNextEvent(player) {
        const events = this.getAvailableEvents(player);

        const keyEvent = [...events].sort((a, b) => b.priority - a.priority).find(event => event.priority > 0);
        if (keyEvent) return keyEvent;

        const normalEvents = events.filter(event => event.priority === 0);
        const totalWeight = normalEvents.reduce((sum, event) => sum + event.weight, 0);
        let random = Math.random() * totalWeight;
        for (const event of normalEvents) {
            random -= event.weight;
            if (random <= 0) return event;
        }

        return normalEvents[0] || null;
    }
}

const eventManager = new EventManager();
export default eventManager;