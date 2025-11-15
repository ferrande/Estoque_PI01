# 🛠️ Como rodar o projeto

Este repositório contém dois projetos separados:

- `Backend/`: API em **Python**.
- `Frontend/controle-estoque/`: Aplicação **React**.

## ⚙️ Backend (Python)

### Pré-requisitos

- **Python 3.10+**
- **pip**

### Passos

```bash
# Passo 1
cd Backend
python -m venv venv
```

```bash
# Escolha uma das opções
.\venv\Scripts\Activate.ps1 # Windows (PowerShell)
.\venv\Scripts\activate.bat # Windows (CMD)
source venv/bin/activate  # No macOS/Linux
```

```bash
# Passo 2
pip install -r requirements.txt
```

```bash
# Passo 3
py run.py
```

## 🖥️ Frontend (React)

### Pré-requisitos

- **Node.js 18+**
- **npm 9+** ou **yarn**

### Passos

```bash
# Passo 1
cd Frontend/controle-estoque
npm install
```

```bash
# Passo 2
npm run dev
```

## 🚀 Executar ambos simultaneamente

### Terminal 1

```bash
cd Backend
.\venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
python run.py
```

### Terminal 2

```bash
cd Frontend/controle-estoque
npm install
npm run dev
```
