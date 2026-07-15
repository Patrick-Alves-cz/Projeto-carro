// Nenhuma API do Node é exposta ao app React por padrão — o sistema usa
// apenas LocalStorage, que já funciona nativamente dentro do BrowserWindow.
// Este arquivo existe como ponto de extensão caso, no futuro, o app precise
// de acesso a recursos do sistema operacional (ex: impressão de contratos,
// leitura de arquivos locais para importação em lote, etc.), usando
// contextBridge.exposeInMainWorld de forma segura.

const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('rufinoDesktop', {
  isDesktopApp: true,
})
