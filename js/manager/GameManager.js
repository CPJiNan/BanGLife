import eventManager from "./EventManager.js";
import Player from "../entity/Player.js";
import Event from "../entity/Event.js";
import {scrollToBottom, updateUI} from "../ui/game-screen.js";

/**
 * BanGLife
 *
 * 游戏管理器。
 *
 * @author 季楠
 * @since 2026/3/19 23:29
 */
class GameManager {
    constructor() {
        this.player = null;
        this.round = 0;
        this.currentEvent = null;
        this.eventHistory = [];
        this.version = '1.0.0';
    }

    /**
     * 开始游戏。
     */
    startGame(data = {}) {
        this.player = new Player(data);
        this.round = 1;
        this.eventHistory = [];
    }

    /**
     * 触发下一个事件。
     */
    nextEvent() {
        const nextEvent = eventManager.getNextEvent(this.player);
        if (!nextEvent) {
            this.nextRound();
            return;
        }
        nextEvent.execute(this.player);
        nextEvent.unregister();
        updateUI();
        scrollToBottom();
    }

    /**
     * 触发下一个回合。
     */
    nextRound() {
        if (this.currentEvent != null) {
            this.eventHistory.push({
                round: this.round,
                event: this.currentEvent
            });
        }
        this.currentEvent = null;
        this.round++;
        this.player.setEnergy(this.player.maxEnergy);
        updateUI();
        scrollToBottom();
    }

    /**
     * 获取游戏数据。
     * @return {Object} 请求的数据。
     */
    getGameData() {
        if (!this.player) return null;
        const events = [...eventManager.events.values()].map(event => event.toJSON())
        const eventHistory = this.eventHistory.map(item => ({
            round: item.round,
            event: item.event.toJSON()
        }));
        return {
            player: this.player.toJSON(),
            round: this.round,
            events: events,
            currentEvent: this.currentEvent?.toJSON() ?? null,
            eventHistory: eventHistory,
            version: this.version
        }
    }

    /**
     * 加载游戏数据。
     * @param data 数据。
     */
    loadGameData(data) {
        if (!data) return;
        this.player = new Player(data.player);
        this.round = data.round;
        eventManager.events.clear();
        data.events.forEach(event => {
            Event.fromJSON(event).register();
        });
        if (data.currentEvent) this.currentEvent = Event.fromJSON(data.currentEvent);
        else this.currentEvent = null;
        this.eventHistory = data.eventHistory.map(item => ({
            round: item.round,
            event: Event.fromJSON(item.event)
        }));
    }
}

const gameManager = new GameManager();
export default gameManager;