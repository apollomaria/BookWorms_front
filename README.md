# 📚 BookWorms — Frontend Web (React)

Interface web completa e interativa do projeto **BookWorms**, desenvolvida com **React**, **Vite** e **CSS Puro**, preservando rigorosamente a identidade visual e o design dos protótipos originais.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- Gerenciador de pacotes `npm` (incluso no Node.js)

### Passo a Passo

1. **Clone ou baixe este repositório:**
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd BookWorms-Frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure a URL do backend:** `cp .env.example .env` (veja `VITE_API_URL`).

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse no seu navegador:**
   Abra [http://localhost:5173](http://localhost:5173) (porta padrão do Vite; o backend usa a 3000)

---

## 📄 Páginas e Telas Disponíveis

- **Página Inicial / Fórum (`#/index`):** Feed central de discussões com spoilers clicáveis, filtros por comunidade, sistema de votos reativo (Upvote/Downvote) e modal para criar novos posts.
- **Página de Apresentação (`#/home`):** Landing page completa com mascote animado, estante 3D de livros e apresentação da proposta.
- **Criar Conta (`#/criar-conta`):** Formulário interativo para cadastro de novos leitores com login automático.
- **Criar Clube (`#/criar-clube`):** Criação de clubes com seleção de ranking, decisão de leituras e troca dinâmica de avatar.
- **Entrar em Clube (`#/entrar-clube`):** Busca por código e visualização expansível de clubes públicos para participação imediata.
- **Criar Registro de Leitura (`#/criar-registro`):** Registro de páginas lidas, data, clube e **Cronômetro Interativo em Tempo Real** (Iniciar, Pausar e Zerar).
- **Metas de Leitura (`#/metas`):** Dropdowns customizados de tipos e durações de metas, com acompanhamento de progresso em tempo real.
- **Testes & Quizzes Literários (`#/testes`):** Quizzes interativos sobre as obras com validação de respostas e ganho de pontos de experiência (EXP).

---

## 🛠️ Tecnologias Utilizadas

- **React 18** (Functional Components, Hooks e Context API)
- **Vite** (Build tool e dev server ultrarrápido)
- **CSS3 Puro** (Sem dependências externas de UI, mantendo fidelidade estética total aos protótipos)
- **Fontes do Google:** *Baloo 2* e *Nunito Sans*

---

## 📦 Como Gerar o Build de Produção

Caso queira hospedar o projeto no GitHub Pages, Vercel ou Netlify:
```bash
npm run build
```
Os arquivos otimizados prontos para publicação serão gerados na pasta `dist/`.
