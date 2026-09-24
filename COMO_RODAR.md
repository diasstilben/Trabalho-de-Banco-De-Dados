# 🚀 Como Rodar o Projeto Localmente

Este projeto é um **site Flask** que se conecta ao banco **MySQL/MariaDB**
(banco `HOSPITAL`, definido no arquivo `hospital.sql`) e permite fazer
**SELECT**, **INSERT** e **UPDATE** por meio de formulários na web.

---

## 📦 1. Pré-requisitos

* **Python 3.10+** instalado no computador
* **MySQL ou MariaDB** rodando localmente (para recria-lo, use o `hospital.sql`)
* **Git** (para clonar o repositório, se ainda não clonou)

---

## 🛠️ 2. Clonar o repositório (se ainda não fez)

```bash
git clone https://github.com/diasstilben/Trabalho-de-Banco-De-Dados.git
cd Trabalho-de-Banco-De-Dados
```

---

## 🗄️ 3. Criar o banco de dados `HOSPITAL`

Entre no MySQL com seu usuário (ex.: `root`) e execute o script de criação do schema:

```bash
mysql -u root -p < hospital.sql
```

> Se o seu usuário não tiver senha, é só tirar o `-p`: `mysql -u root < hospital.sql`

Esse comando cria o banco **HOSPITAL** com as **24 tabelas** usadas pela aplicação.

### (Opcional) Inserir dados de exemplo

As tabelas principais (paciente, médico, consultas...) ficam **vazias** no
`hospital.sql`. Para a apresentação ter dados, rode também o script de
demonstração:

```bash
mysql -u root -p < seed_dados.sql
```

> ⚠️ Esse script é opcional e só deve ser rodado com as tabelas vazias.
> Ele **não altera** a estrutura do banco — apenas faz INSERTs de exemplo.

---

## 🐍 4. Criar o ambiente virtual e instalar as dependências

```bash
python3 -m venv .venv                 # cria um ambiente isolado
source .venv/bin/activate             # ativa o ambiente (Linux/Mac)
# No Windows: .venv\Scripts\activate

pip install -r requirements.txt       # instala Flask, PyMySQL e python-dotenv
```

---

## 🔑 5. Configurar a conexão com o banco

Copie o modelo de configuração para um arquivo `.env`:

```bash
cp .env.example .env
```

Edite o `.env` com as credenciais do MySQL da sua máquina **se preciso**:

```ini
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=A_SUA_SENHA
MYSQL_DATABASE=HOSPITAL
```

> 💡 O arquivo `.env` **não é versionado** no GitHub (está no `.gitignore`),
> para cada integrante usar suas próprias credenciais sem conflito.

---

## ▶️ 6. Subir a aplicação Flask

```bash
python app.py
```

Acesse no navegador:

## http://127.0.0.1:5000

---

## 🧪 7. O que testar na aplicação

| Página                     | Operação no banco | Descrição                                    |
|----------------------------|-------------------|----------------------------------------------|
| 🔎 *Consultar Pacientes*   | `SELECT`          | Lista pacientes e filtra por nome (`LIKE`)   |
| ➕ *Cadastrar Paciente*    | `INSERT`          | Grava um novo paciente (gera o `cod_pac`)    |
| ✏️ *Atualizar Paciente*    | `UPDATE`          | Edita os dados de um paciente existente      |

---

## 🛑 7. Parar a aplicação

No terminal onde o Flask está rodando, pressione `Ctrl + C`.

---

## 🌟 Dica para a apresentação

1. Rode `hospital.sql` e `seed_dados.sql` para garantir dados na tela.
2. Abra a página *Consultar Pacientes* e filtre por um nome (ex.: `ana`).
3. Cadastre um novo paciente e mostre que ele aparece na listagem.
4. Atualize um paciente e mostre a mudança na listagem em seguida.
5. Para demonstrar o tratamento de erro: desligue o MySQL e clique em
   *Consultar Pacientes* — aparece a página de erro amigável.