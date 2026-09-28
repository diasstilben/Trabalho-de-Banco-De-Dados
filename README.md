# 🏥 Sistema de Gestão Hospitalar

Projeto prático desenvolvido para a disciplina de Banco de Dados, focado na criação de uma interface web para interação direta com uma base de dados relacional. 

Este projeto cumpre o requisito de possuir formulários que acedem à base de dados executando consultas de leitura (`SELECT`) e atualização/inserção (`INSERT`).

## 🎓 Instituição
**UERJ - IPRJ** (Universidade do Estado do Rio de Janeiro - Instituto Politécnico do Rio de Janeiro)

## 👥 Integrantes do Grupo (G5)
* **João Dias**[cite: 2]
* **João Pedro**[cite: 2]
* **Pablo**[cite: 2]

---

## 🚀 Tecnologias Utilizadas
* **Back-end:** Python 3, Flask (Microframework)
* **Front-end:** HTML5, CSS3
* **Base de Dados:** MySQL (via XAMPP)
* **Conector:** `mysql-connector-python`

## 📋 Funcionalidades
O sistema foi modularizado em abas para gerir todas as entidades da base de dados do hospital. Para cada uma das entidades, o sistema permite:
- **Cadastro (INSERT):** Formulários para inserção de novos registos na base de dados.
- **Consulta (SELECT):** Tabelas de listagem de registos, com suporte a formulários de pesquisa e filtros por parâmetros específicos (como o nome do paciente ou do médico).

As entidades geridas incluem: Paciente, Médico, Plano de Saúde, Especialidade, Formação, Estado da Consulta, Consultas e Vínculo Paciente x Plano[cite: 1].

---

## ⚙️ Como Executar o Projeto Localmente

Para testares o projeto na tua máquina, segue os passos abaixo:

### 1. Pré-requisitos
* Ter o **Python 3** instalado.
* Ter o **XAMPP** (ou outro servidor MySQL) instalado.
* Ter o gestor de pacotes `pip` instalado.

### 2. Configurar a Base de Dados
1. Abre o XAMPP Control Panel e inicia os serviços **Apache** e **MySQL**.
2. Acede ao phpMyAdmin através do navegador: `http://localhost/phpmyadmin`
3. Acede ao separador **SQL**, copia todo o conteúdo do ficheiro `Hospital.sql`[cite: 1] presente neste repositório e executa-o. 
4. Este ficheiro irá criar automaticamente a base de dados `HOSPITAL` e todas as tabelas necessárias[cite: 1].

### 3. Instalar as Dependências
Abre o terminal na pasta raiz do projeto e executa o seguinte comando para instalar o Flask e o conector do MySQL:
```bash
pip install Flask mysql-connector-python