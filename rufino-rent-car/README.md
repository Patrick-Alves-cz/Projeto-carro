# Rufino Rent Car — Sistema de Gestão de Locadora

Sistema profissional de gestão para locadoras de veículos, desenvolvido para a
**Rufino Rent Car** (proprietário: Magno Rufino). Construído para funcionar
100% offline no computador da empresa, com arquitetura pronta para evoluir
para um programa instalável (.exe) e, futuramente, para um backend online
com login e banco de dados na nuvem.

> **Status do projeto:** Todas as etapas planejadas para a versão local
> (offline, LocalStorage) foram concluídas: arquitetura, design system,
> Dashboard, Frota com ficha individual, Clientes, Locações, Financeiro,
> Relatórios com exportação PDF/Excel, Configurações com backup, formulários
> completos de cadastro/edição em todos os módulos, atalhos de teclado e
> busca global. O sistema está pronto para uso diário na Rufino Rent Car.
> Login e banco de dados online ficam para uma fase futura, já prevista na
> arquitetura (veja "Arquitetura pensada para o futuro" abaixo).

---

## ✨ Visão geral

- **Stack:** React 18 + Vite + Tailwind CSS + React Router + React Hook Form + Lucide Icons + Recharts + date-fns
- **Persistência:** 100% LocalStorage, sem backend, sem Supabase, sem Firebase
- **Identidade visual:** preto · branco · cinza · dourado — inspirada em Tesla, Mercedes, Stripe, Linear, Notion e Apple
- **Elemento de assinatura:** o painel "Utilização da frota" no Dashboard usa
  um mostrador estilo **painel automotivo** (ponteiro e escala), reforçando a
  identidade de uma locadora de veículos

## 📁 Estrutura do projeto

```
src/
  components/     Componentes reutilizáveis, organizados por domínio
    ui/             Botão, Badge, Toast, Modal de confirmação, Empty State...
    layout/         Sidebar, Topbar, busca global
    dashboard/      KPI cards, gauge, gráficos do dashboard
    fleet/ clients/ rentals/ finance/ reports/   (componentes específicos por módulo)
  pages/          Uma pasta por módulo (fleet, clients, rentals, finance, reports, settings)
  layouts/        MainLayout (sidebar + topbar + conteúdo roteado)
  contexts/       DataContext (dados globais), ToastContext, ConfirmContext
  services/       Camada de persistência — abstrai o LocalStorage por trás
                  de um "repository" assíncrono, pronto para virar Supabase
  hooks/          Hooks customizados (reservado para próximas etapas)
  utils/          Formatação, cálculos financeiros, constantes, alertas, exportação
  types/          Definições JSDoc das entidades do domínio (Vehicle, Client, Rental, Expense)
  styles/         globals.css — tokens de design, componentes base do Tailwind
```

Cada arquivo tem uma responsabilidade única. A lógica de negócio (cálculos
financeiros, regras de status, alertas de vencimento) vive em `utils/`,
separada dos componentes visuais.

## 🧠 Arquitetura pensada para o futuro

Mesmo usando LocalStorage hoje, todo o acesso a dados passa por uma única
camada (`src/services/storageAdapter.js` → `src/services/repository.js` →
serviços de domínio como `vehicleService.js`). Isso significa que, quando a
Rufino Rent Car quiser migrar para Supabase com login e banco de dados
online, **apenas essa camada precisa ser reescrita** — nenhum componente ou
página precisa mudar, porque todos já consomem os serviços por meio de
funções assíncronas (`await vehicleService.list()`, etc.), exatamente como
seriam chamadas de API.

O roteamento usa `HashRouter` (URLs com `#`) propositalmente: isso garante
que o sistema funcione perfeitamente quando for empacotado como aplicativo
Windows (.exe) via Electron, sem precisar de um servidor HTTP para resolver
as rotas.

## 🚀 Como instalar

Pré-requisito: [Node.js](https://nodejs.org) versão 18 ou superior instalado no computador.

```bash
# 1. Entre na pasta do projeto
cd rufino-rent-car

# 2. Instale as dependências
npm install
```

## ▶️ Como executar (modo desenvolvimento)

```bash
npm run dev
```

O terminal mostrará um endereço local, geralmente `http://localhost:5173`.
Abra esse endereço no navegador (o próprio comando já tenta abrir
automaticamente). Qualquer alteração no código atualiza a tela na hora.

Na primeira execução, o sistema popula automaticamente dados de exemplo
(frota, clientes, locações e despesas dos últimos 6 meses) para que o
Dashboard e os Relatórios já nasçam com informação real para visualizar.
Isso acontece apenas uma vez — os dados de exemplo passam a ser editáveis
como qualquer outro dado do sistema. Para recomeçar do zero, use "Restaurar
backup" nas Configurações com um arquivo vazio, ou limpe o LocalStorage do
navegador para este site.

## 📦 Como gerar a versão de produção

```bash
npm run build
```

Isso cria a pasta `dist/` com os arquivos finais, otimizados e prontos para
uso. Para conferir localmente como ficaria em produção:

```bash
npm run preview
```

A pasta `dist/` é exatamente o que futuramente será empacotado dentro do
programa Windows (.exe), por exemplo com Electron ou Tauri.

## 🖥️ Como gerar o programa Windows (.exe)

O wrapper Electron já está incluído no projeto (pasta `electron/`), com
ícone, janela configurada e tudo pronto. Faltam só os comandos abaixo —
rode-os **no seu computador** (aqui no ambiente de desenvolvimento eu não
tenho acesso à internet nem a um Windows para compilar o instalador final).

```bash
# 1. Instale as dependências (inclui Electron e electron-builder)
npm install

# 2. Gere o instalador .exe
npm run electron:build
```

Isso vai:
1. Rodar `vite build` (gera a pasta `dist/` com o app otimizado)
2. Empacotar tudo com o Electron
3. Criar um instalador Windows (NSIS) dentro da pasta `release/`

O arquivo final terá um nome como `Rufino Rent Car Setup 1.0.0.exe` — é
esse arquivo que você distribui e instala nos computadores Windows da
locadora. Ele instala normalmente (com atalho na área de trabalho e no
menu iniciar) e roda 100% offline, exatamente como no navegador.

**Para testar antes de gerar o instalador**, rode:

```bash
npm run electron:dev
```

Isso abre o sistema numa janela desktop nativa (sem navegador), já
carregando direto do servidor de desenvolvimento — útil para conferir
como fica antes de compilar o instalador final.

> **Nota:** gerar o `.exe` a partir de um Mac ou Linux funciona
> normalmente com o `electron-builder` (ele não precisa de Windows para
> compilar o instalador NSIS). Se preferir gerar direto no Windows, os
> mesmos comandos funcionam sem nenhuma alteração.

## 🗺️ Módulos já disponíveis nesta etapa

| Módulo | Status |
|---|---|
| Dashboard | ✅ Completo — KPIs, gauge de utilização da frota, gráficos de receita/lucro/despesas, ranking de veículos, alertas |
| Frota (listagem + ficha + cadastro/edição) | ✅ Completo — filtros, busca, upload de foto, análise financeira individual (ROI, lucro líquido, histórico) |
| Clientes | ✅ Completo — listagem, busca, cadastro, edição e exclusão |
| Locações | ✅ Completo — listagem, filtros, nova locação com cálculo automático de valor, edição, finalização e exclusão |
| Financeiro | ✅ Completo — visão de receitas/despesas, lançamento, edição e exclusão de despesas |
| Relatórios | ✅ Completo — lucratividade por veículo, ranking, clientes fiéis, fluxo de caixa, exportação PDF e Excel |
| Configurações | ✅ Completo — dados da empresa, backup/restauração dos dados |

## ⌨️ Atalhos de teclado

| Atalho | Ação |
|---|---|
| `⌘K` / `Ctrl+K` | Abrir a busca global (clientes e veículos) |
| `N` | Criar novo registro na tela atual (Frota, Clientes, Locações, Financeiro) |
| `?` | Abrir a lista de atalhos disponíveis |
| `Esc` | Fechar modal ou diálogo de confirmação aberto |
| `Enter` | Confirmar um diálogo de confirmação |

## 🔒 Sobre os dados

Todos os dados ficam salvos exclusivamente no navegador deste computador
(LocalStorage), sob a chave `rufino-rent-car`. Nada é enviado para a
internet. Recomenda-se exportar um backup periodicamente pela tela de
Configurações.

---

Desenvolvido para **Rufino Rent Car** — Magno Rufino.
