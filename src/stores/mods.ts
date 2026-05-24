import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {ModManifest} from '@banglife/mod-types'
import {installModFromUrl, installModFromZip, listInstalledMods, loadUserMod, uninstallMod,} from '@/mod/fs'
import {getLoadedMod, loadBundled, unloadMod} from '@/mod/api'

const ENABLED_KEY = 'banglife:mods:enabled'

function readEnabled(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(ENABLED_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

function writeEnabled(ids: Set<string>) {
  localStorage.setItem(ENABLED_KEY, JSON.stringify([...ids]))
}

export const useModsStore = defineStore('mods', () => {
  const installed = ref<ModManifest[]>([])
  const enabled = ref<Set<string>>(readEnabled())
  const busy = ref(false)
  const error = ref<string | null>(null)

  const pendingInstall = ref<{ manifest: ModManifest; source: string } | null>(null)

  async function refresh() {
    installed.value = await listInstalledMods()
  }

  function isEnabled(id: string) {
    return enabled.value.has(id)
  }

  function isLoaded(id: string) {
    return !!getLoadedMod(id)
  }

  async function _loadMod(manifest: ModManifest) {
    const {definition} = await loadUserMod(manifest.id)
    await loadBundled([{manifest, definition}])
  }

  async function loadAllEnabled(): Promise<void> {
    const mods = await listInstalledMods()
    installed.value = mods
    for (const manifest of mods) {
      if (enabled.value.has(manifest.id)) {
        try {
          await _loadMod(manifest)
        } catch (e) {
          console.error(`[ModsStore] 加载 "${manifest.id}" 失败`, e)
        }
      }
    }
  }

  async function installZip(file: File): Promise<void> {
    busy.value = true
    error.value = null
    try {
      const buf = await file.arrayBuffer()
      const manifest = await installModFromZip(buf)
      await refresh()
      pendingInstall.value = {manifest, source: `本地文件：${file.name}`}
    } catch (e) {
      error.value = e instanceof Error ? e.message : '安装失败'
    } finally {
      busy.value = false
    }
  }

  async function installUrl(url: string): Promise<void> {
    busy.value = true
    error.value = null
    try {
      const manifest = await installModFromUrl(url)
      await refresh()
      pendingInstall.value = {manifest, source: `URL：${url}`}
    } catch (e) {
      error.value = e instanceof Error ? e.message : '下载失败'
    } finally {
      busy.value = false
    }
  }

  async function confirmInstall(manifest: ModManifest): Promise<void> {
    enabled.value.add(manifest.id)
    writeEnabled(enabled.value)
    pendingInstall.value = null
    await _loadMod(manifest)
  }

  function cancelInstall() {
    pendingInstall.value = null
  }

  async function toggleEnabled(id: string): Promise<void> {
    if (enabled.value.has(id)) {
      enabled.value.delete(id)
      writeEnabled(enabled.value)
      await unloadMod(id)
    } else {
      const manifest = installed.value.find(m => m.id === id)
      if (!manifest) return
      enabled.value.add(id)
      writeEnabled(enabled.value)
      await _loadMod(manifest)
    }
  }

  async function remove(id: string): Promise<void> {
    await unloadMod(id)
    await uninstallMod(id)
    enabled.value.delete(id)
    writeEnabled(enabled.value)
    await refresh()
  }

  return {
    installed, enabled, busy, error, pendingInstall,
    refresh, isEnabled, isLoaded,
    installZip, installUrl, confirmInstall, cancelInstall,
    toggleEnabled, remove, loadAllEnabled,
  }
})
