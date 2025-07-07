# ThermoCert API (Backend)

Backend para o sistema ThermoCert Pro.
Funciona com Node.js, Express e MongoDB Atlas.

## Como usar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar .env
Crie um arquivo `.env` com o seguinte conteúdo:

```
PORT=5000
MONGO_URI=coloque_sua_string_mongodb
JWT_SECRET=uma_chave_secreta_forte
```

### 3. Rodar localmente
```bash
npm start
```

### 4. Rotas disponíveis

- POST `/api/login` → Autenticação
- POST `/api/users` → Criar usuário (admin)
- GET `/api/users` → Listar usuários (admin)
- PATCH `/api/users/:id/status` → Ativar/Inativar usuário (admin)

### 5. Deploy no Cloud Run
Pronto para deploy no Google Cloud Run.