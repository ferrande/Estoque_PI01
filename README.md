# 🛠️ Como rodar o projeto

Este repositório contém dois projetos separados:

- `Backend/`: API em **Python**.
- `Frontend/controle-estoque/`: Aplicação **React**.

## ⚙️ Backend (Python)

### Pré-requisitos

- **Python 3.10+**
- **pip**

### Passo 1: Criar o Ambiente Virtual (venv)

```bash
cd Backend
python -m venv venv
```

#### Ativar o venv:

**No Windows (PowerShell):**

```bash
.\venv\Scripts\Activate.ps1
```

**No Windows (CMD):**

```bash
.\venv\Scripts\activate.bat
```

**No macOS/Linux:**

```bash
source venv/bin/activate
```

### Passo 2: Instalar Dependências

```bash
pip install -r requirements.txt
```

### Passo 3: Executar a Aplicação

```bash
py run.py
```

A API estará disponível em `http://localhost:5000` (ou a porta configurada).

---

## 🖥️ Frontend (React)

### Pré-requisitos

- **Node.js 18+** (verifique com: `node --version`)
- **npm 9+** ou **yarn** (gerenciador de pacotes, vem com Node.js)

### Passo 1: Instalar Dependências

```bash
cd Frontend/controle-estoque
npm install
```

### Passo 2: Executar em Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou a URL mostrada no terminal).

### Passo 3: Build para Produção (Opcional)

```bash
npm run build
```

---

## 🚀 Executar Ambos Simultaneamente

Abra dois terminais:

**Terminal 1 - Backend:**

```bash
cd Backend
.\venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
python run.py
```

**Terminal 2 - Frontend:**

```bash
cd Frontend/controle-estoque
npm install
npm run dev
```
