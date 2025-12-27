# Guia de Solução de Problemas - Erros de Conectividade

## Problema: "TypeError: Failed to fetch"

Este erro ocorre quando a aplicação não consegue se conectar ao servidor Supabase. As causas mais comuns são:

### 1. **Verificar Variáveis de Ambiente**

As variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` precisam estar configuradas corretamente.

**Via DevServerControl:**
```bash
# No painel de controle do dev server, verifique:
- VITE_SUPABASE_URL: deve estar definida
- VITE_SUPABASE_ANON_KEY: deve estar definida
```

**Valores esperados:**
- `VITE_SUPABASE_URL`: `https://puepexwgznjdtgrihxsa.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: Token JWT começando com `eyJ...`

### 2. **Verificar Conectividade de Rede**

Teste se o servidor Supabase é acessível:

```bash
# No console do navegador:
curl -I https://puepexwgznjdtgrihxsa.supabase.co

# Ou use o fetch:
fetch('https://puepexwgznjdtgrihxsa.supabase.co')
  .then(r => console.log('✅ Servidor acessível', r.status))
  .catch(e => console.error('❌ Erro:', e.message))
```

### 3. **Verificar CORS (Cross-Origin Resource Sharing)**

Se o Supabase está bloqueando requisições:

```bash
# No console:
console.log('URL de origem:', window.location.origin)

# O Supabase deve permitir requisições de: 
# https://9792d5582f2342b8bb859c02608ac440-br-236203785fae4a75995185211.fly.dev
```

### 4. **Inspecionar Requisições de Rede**

1. Abra DevTools (F12)
2. Vá para a aba **Network**
3. Recarregue a página
4. Procure por requisições para `supabase.co`
5. Verifique:
   - Status HTTP (deve ser 200 ou 401, não Failed)
   - Response headers (deve incluir CORS headers)
   - Error message (se houver)

### 5. **Verificar Logs do Console**

```bash
# No console do navegador, procure por mensagens como:

# ✅ Sucesso:
"✅ Supabase client initialized successfully"

# ❌ Problemas:
"Missing Supabase configuration"
"Network Error: Failed to connect to Supabase"
"Error fetching user: [object Object]"
```

### 6. **Soluções Rápidas**

1. **Recarregue a página (F5 ou Ctrl+Shift+R)**
   - Limpa cache e requisições antigas

2. **Reinicie o dev server**
   ```bash
   # Via DevServerControl, clique em "Restart"
   ```

3. **Verifique sua conexão com a internet**
   - Teste em outro site
   - Verifique se há firewall bloqueando

4. **Limpe cookies/localStorage**
   ```javascript
   // No console:
   localStorage.clear()
   sessionStorage.clear()
   window.location.reload()
   ```

5. **Tente de um navegador diferente**
   - Firefox, Chrome, Safari
   - Pode ser um problema específico do browser

### 7. **Para Administradores - Limpeza de Dados**

Se duplicatas foram criadas no banco de dados, execute:

```javascript
// No console do navegador:
await __adminTools.cleanupDuplicates()
```

### 8. **Relatório de Problemas**

Se o problema persistir, colete estas informações:

```javascript
// No console, execute:
console.log({
  userAgent: navigator.userAgent,
  origin: window.location.origin,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  timestamp: new Date().toISOString()
})
```

## Mudanças Recentes (Correções Implementadas)

### ✅ Melhorias Feitas:

1. **Try-Catch em Todas Funções de BD**
   - `getUser()`, `getUserDocuments()`, `getQualificationData()`
   - `getProjectClients()`, `uploadDocument()`
   - Agora os erros de rede são capturados e tratados graciosamente

2. **Melhor Feedback ao Usuário**
   - Tela de erro de conectividade com botão "Tentar Novamente"
   - Mensagens mais claras no console
   - Logs de diagnóstico no DevTools

3. **Validação de Configuração**
   - Verifica formato da URL Supabase
   - Valida presença de variáveis de ambiente
   - Mensagens de erro mais detalhadas

4. **Tratamento de Erros de Rede**
   - Diferencia entre erros de rede e erros de API
   - Retorna dados vazios em vez de quebrar a app
   - Permite que usuário continue navegando mesmo com problemas de dados

## Próximos Passos

Se os problemas persistirem:

1. Verifique se o Supabase está em operação normal
2. Verifique se a URL do Supabase está correta
3. Contate suporte do Supabase se houver problemas de servidor
4. Consulte a documentação: https://supabase.com/docs

---

**Última atualização:** 27 de Dezembro de 2025
