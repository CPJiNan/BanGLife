import JSZip from 'jszip'
import {del, get, keys, set} from 'idb-keyval'
import type {ModManifest} from '@banglife/mod-types'

const FS_PREFIX = 'modfs:'

function fsKey(modId: string, path: string) {
  return `${FS_PREFIX}${modId}:${path}`
}

function manifestKey(modId: string) {
  return `${FS_PREFIX}${modId}:__manifest__`
}

export async function installModFromZip(zipData: ArrayBuffer): Promise<ModManifest> {
  const zip = await JSZip.loadAsync(zipData)

  const manifestFile = zip.file('manifest.json')
  if (!manifestFile) throw new Error('未在 Mod 中找到 manifest.json')
  const manifestJson = await manifestFile.async('string')
  const manifest: ModManifest = JSON.parse(manifestJson)
  if (!manifest.id) throw new Error('未在 manifest.json 中找到 id 字段')

  const writes: Promise<void>[] = []
  zip.forEach((relativePath, file) => {
    if (file.dir) return
    writes.push(
      file.async('blob').then(blob => set(fsKey(manifest.id, relativePath), blob))
    )
  })
  await Promise.all(writes)

  await set(manifestKey(manifest.id), manifest)

  return manifest
}

export async function installModFromUrl(url: string): Promise<ModManifest> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`下载失败：${res.status} ${res.statusText}`)
  const buf = await res.arrayBuffer()
  return installModFromZip(buf)
}

export async function readModFile(modId: string, path: string): Promise<Blob | undefined> {
  return get<Blob>(fsKey(modId, path))
}

export async function listInstalledMods(): Promise<ModManifest[]> {
  const allKeys = await keys<string>()
  const manifestKeys = allKeys.filter(k => typeof k === 'string' && k.endsWith(':__manifest__'))
  const manifests = await Promise.all(manifestKeys.map(k => get<ModManifest>(k)))
  return manifests.filter(Boolean) as ModManifest[]
}

export async function uninstallMod(modId: string): Promise<void> {
  const allKeys = await keys<string>()
  const modKeys = allKeys.filter(k => typeof k === 'string' && k.startsWith(`${FS_PREFIX}${modId}:`))
  await Promise.all(modKeys.map(k => del(k)))
}

export async function loadUserMod(modId: string): Promise<{
  manifest: ModManifest;
  definition: import('@banglife/mod-types').ModDefinition
}> {
  const manifest = await get<ModManifest>(manifestKey(modId))
  if (!manifest) throw new Error(`未找到 Mod ${modId}`)
  const entryPath = manifest.entry ?? 'index.js'
  const blob = await readModFile(modId, entryPath)
  if (!blob) throw new Error(`未找到 Mod ${modId} 入口文件 ${entryPath}`)
  const code = await blob.text()
  const factory = new Function('api', `
    const module = { exports: {} };
    const exports = module.exports;
    ${code}
    return module.exports;
  `)
  const {createModAPI} = await import('@/mod/api')
  const api = createModAPI(manifest)
  const definition = factory(api) as import('@banglife/mod-types').ModDefinition
  return {manifest, definition}
}
