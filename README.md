# 🏥 Sistema de Gestão Hospitalar & Seminário de Banco de Dados

Projeto prático e teórico desenvolvido para a disciplina de Banco de Dados. A avaliação do grupo é composta por duas entregas integradas (apresentadas no dia 30/09)[cite: 2]:
1. **Apresentação Teórica (PowerPoint):** Seminário sobre estruturas de armazenamento[cite: 2].
2. **Aplicação Prática (CRUD Web):** Interface para interação direta com uma base de dados relacional, cumprindo o requisito de formulários com consultas (`SELECT`) e inserções (`INSERT`)[cite: 2].

## 🎓 Instituição
**UERJ - IPRJ** (Universidade do Estado do Rio de Janeiro - Instituto Politécnico do Rio de Janeiro)

## 👥 Integrantes do Grupo (G5)
* **João Dias**
* **João Pedro**
* **Pablo**

---

## 📊 Parte 1: Apresentação Teórica
O grupo ficou responsável por pesquisar, estruturar e apresentar o tema **"Estruturas de arquivos, indexação e hashing"**[cite: 2]. 
A apresentação em PowerPoint cobre os fundamentos teóricos de como as bases de dados organizam e acedem à informação fisicamente nos discos, servindo de base para a compreensão do funcionamento interno dos SGBDs. 

*(Nota: O ficheiro `.pptx` com os slides da apresentação pode ser encontrado nos arquivos deste repositório).*

---

## 💻 Parte 2: Aplicação Prática (Gestão Hospitalar)

### 🚀 Tecnologias Utilizadas
* **Back-end:** Python 3, Flask (Microframework)
* **Front-end:** HTML5, CSS3
* **Base de Dados:** MySQL (via XAMPP)
* **Conector:** `mysql-connector-python`

### 📋 Funcionalidades da Aplicação
O sistema foi modularizado em abas para gerir todas as entidades da base de dados do hospital (`paciente`, `medico`, `plano_saude`, `especialidade`, `formacao`, `estado` e `consulta`)[cite: 1]. Para cada entidade, o sistema permite:
- **Cadastro (INSERT):** Formulários para inserção de novos registos na base de dados.
- **Consulta (SELECT):** Tabelas de listagem de registos, com suporte a formulários de pesquisa e filtros interativos por parâmetros específicos (como o nome do paciente, nome do médico, etc.).

---

## ⚙️ Como Executar o Projeto Localmente

Para testar a aplicação na tua máquina, segue os passos abaixo:

### 1. Pré-requisitos
* Ter o **Python 3** instalado.
* Ter o **XAMPP** (ou outro servidor MySQL) instalado e a correr.
* Ter o gestor de pacotes `pip` instalado.

### 2. Configurar a Base de Dados
1. Abre o XAMPP Control Panel e inicia os serviços **Apache** e **MySQL**.
2. Acede ao phpMyAdmin através do navegador: `http://localhost/phpmyadmin`
3. Acede ao separador **SQL**, copia todo o conteúdo do ficheiro `Hospital.sql`[cite: 1] presente neste repositório e executa-o. 
4. Este ficheiro irá criar automaticamente a base de dados `HOSPITAL` e todas as tabelas e relações necessárias[cite: 1].

### 3. Instalar as Dependências
Abre o terminal na pasta raiz do projeto e executa o seguinte comando para instalar as bibliotecas necessárias:
```bash
pip install Flask mysql-connector-python
