import gameManager from "../manager/GameManager.js";

/**
 * BanGLife
 *
 * 玩家数据类。
 *
 * @author 季楠
 * @since 2026/3/19 23:29
 */
class Player {
    constructor(data = {}) {
        this.name = data.name ?? '';
        this.alias = data.alias || this.name;
        this.energy = data.energy ?? 3;
        this.maxEnergy = data.maxEnergy ?? 3;
        this.attributes = {
            intelligence: 5,
            stamina: 5,
            charm: 5,
            vocal: 0,
            keyboard: 0,
            guitar: 0,
            bass: 0,
            drum: 0,
            ...(data.attributes ?? {})
        };
        this.affections = {
            ...(data.affections ?? {})
        }
        this.effects = new Set(data.effects ?? []);
    }

    /**
     * 序列化。
     *
     * @return {Object} 玩家数据。
     */
    toJSON() {
        return {
            ...this,
            effects: [...this.effects]
        };
    }

    /**
     * 设置玩家属性。
     *
     * @param attribute 属性。
     * @param value 值。
     */
    setAttribute(attribute, value) {
        this.attributes[attribute] = value;
    }

    /**
     * 获取角色好感度。
     *
     * @param character 角色。
     * @return {number} 请求的好感度。
     */
    getAffection(character) {
        return this.affections[character] ?? 0;
    }

    /**
     * 设置角色好感度。
     *
     * @param character 角色。
     * @param value 值。
     */
    setAffection(character, value) {
        this.affections[character] = value;
    }

    /**
     * 增加角色好感度。
     *
     * @param character 角色。
     * @param value 值。
     */
    addAffection(character, value) {
        this.affections[character] += value;
    }

    /**
     * 移除角色好感度。
     *
     * @param character 角色。
     * @param value 值。
     */
    removeAffection(character, value) {
        this.affections[character] -= value;
    }

    /**
     * 检查玩家是否有指定效果。
     *
     * @param effect 效果。
     * @returns {boolean} 如果有指定效果，则返回 true，否则返回 false。
     */
    hasEffect(effect) {
        return this.effects.has(effect);
    }

    /**
     * 新增玩家效果。
     *
     * @param effect 效果。
     */
    addEffect(effect) {
        this.effects.add(effect);
    }

    /**
     * 移除玩家效果。
     *
     * @param effect 效果。
     */
    removeEffect(effect) {
        this.effects.delete(effect);
    }

    /**
     * 设置玩家活力。
     *
     * @param value 活力。
     */
    setEnergy(value) {
        this.energy = value;
    }

    /**
     * 增加玩家活力。
     *
     * @param value 活力。
     */
    addEnergy(value) {
        this.energy += value;
    }

    /**
     * 移除玩家活力。
     *
     * @param value 活力。
     */
    removeEnergy(value) {
        this.energy -= value;
        if (this.energy <= 0) gameManager.nextRound();
    }
}

export default Player;