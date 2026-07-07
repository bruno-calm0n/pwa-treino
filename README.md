# Treino Diário PWA

Progressive Web App simples para registrar exercícios físicos diários com contadores persistentes.

## Tecnologias usadas

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

## Como clonar

```bash
git clone <url-do-repositorio>
cd pwa-treino
```

## Como instalar

```bash
npm install
```

## Como rodar em desenvolvimento

```bash
npm run dev
```

Depois abra a URL exibida no terminal, normalmente:

```text
http://localhost:5173/pwa-treino/
```

## Como testar como PWA

O service worker registra apenas no build de produção.

```bash
npm run build
npm run preview
```

Depois abra:

```text
http://localhost:4173/pwa-treino/
```

## Deploy no GitHub Pages

O projeto já está configurado para publicar em:

```text
https://seu-usuario.github.io/pwa-treino/
```

Antes do primeiro deploy, no GitHub, acesse:

```text
Settings > Pages > Build and deployment > Source > GitHub Actions
```

Depois envie o projeto para a branch `main`:

```bash
git add .
git commit -m "configura deploy no GitHub Pages"
git push origin main
```

O deploy será executado automaticamente pelo workflow em `.github/workflows/deploy.yml`.

Se o nome do repositório não for `pwa-treino`, ajuste o `base` em `vite.config.ts`.

## Scripts disponíveis

```bash
npm run dev
npm run typecheck
npm run build
npm run preview
```
