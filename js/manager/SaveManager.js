import gameManager from "./GameManager.js";

/**
 * BanGLife
 *
 * 存档管理器。
 *
 * @author 季楠
 * @since 2026/3/28 20:05
 */
class SaveManager {
    constructor() {
        this.prefix = 'banglife:save:'
    }

    /**
     * 保存存档。
     */
    save(slot) {
        const data = gameManager.getGameData()
        localStorage.setItem(this.prefix + slot, JSON.stringify({
            data: data,
            player: data.player.name,
            round: data.round,
            version: data.version,
            time: new Date().toISOString()
        }));
    }

    /**
     * 加载存档。
     */
    load(slot) {
        gameManager.loadGameData(this.getSave(slot).data)
    }

    /**
     * 获取存档。
     * @param slot 槽位。
     */
    getSave(slot) {
        return JSON.parse(localStorage.getItem(this.prefix + slot));
    }

    /**
     * 获取存档列表。
     */
    getAllSave() {
        return Object.keys(localStorage)
            .filter(key => key.startsWith(this.prefix))
            .map(key => ({
                slot: parseInt(key.replace(this.prefix, '')),
                ...this.getSave(parseInt(key.replace(this.prefix, '')))
            }))
            .sort((a, b) => a.slot - b.slot);
    }

    /**
     * 删除存档。
     *
     * @param slot 槽位。
     */
    deleteSave(slot) {
        localStorage.removeItem(this.prefix + slot);
    }

    /**
     * 导入存档。
     *
     * @param slot 槽位。
     * @param save 存档。
     */
    importSave(slot, save) {
        localStorage.setItem(this.prefix + slot, JSON.stringify(save));
    }

    /**
     * 导出存档。
     *
     * @param slot 槽位。
     */
    exportSave(slot) {
        const save = this.getSave(slot);
        const data = JSON.stringify(save, null, 2);
        const blob = new Blob([data], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `BanGLifeSave_${slot}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
}

const saveManager = new SaveManager();
export default saveManager;