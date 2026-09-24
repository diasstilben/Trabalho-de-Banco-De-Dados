"""
Camada de acesso ao banco de dados MySQL (banco HOSPITAL).

Este arquivo concentra TODA a comunicação com o banco de dados:
abrir conexão, executar os SELECT/INSERT/UPDATE e tratar erros.
As rotas do Flask (app.py) chamam as funções definidas aqui.
"""

import os  # Permite ler variáveis de ambiente (configurações)

import pymysql  # Biblioteca que conecta o Python ao MySQL/MariaDB
from pymysql.cursors import DictCursor  # Retorna cada linha como dicionário
from dotenv import load_dotenv  # Lê as configurações do arquivo .env


# ---------------------------------------------------------------------------
# Carrega o arquivo ".env" (se existir) com as credenciais do banco.
# O arquivo .env fica na mesma pasta do projeto e foi criado a partir do
# modelo .env.example (cp .env.example .env).
# ---------------------------------------------------------------------------
load_dotenv()


def get_connection():
    """
    Cria e devolve uma conexão com o banco de dados HOSPITAL.

    As configurações (host, porta, usuário, senha, banco) são lidas das
    variáveis de ambiente. Se alguma não estiver definida, assume o valor
    padrão indicado (ex.: usuário "root" e banco "HOSPITAL").

    Caso a conexão falhe, levanta uma exceção ConnectionError com uma
    mensagem amigável que será exibida na página de erro da aplicação.
    """
    try:
        conexao = pymysql.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            port=int(os.getenv('MYSQL_PORT', '3306')),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', ''),
            database=os.getenv('MYSQL_DATABASE', 'HOSPITAL'),
            charset='utf8mb4',          # Garante suporte a acentos
            cursorclass=DictCursor,     # Linhas viram dicionários {coluna: valor}
        )
        return conexao

    except pymysql.MySQLError as erro:
        # Relança o erro com uma mensagem mais clara para o usuário final
        raise ConnectionError(
            f'Não foi possível conectar ao MySQL ({erro}). '
            'Verifique se o servidor está ligado e se o arquivo .env está correto.'
        )


def obter_proximo_codigo(tabela, coluna):
    """
    Descobre o próximo código (chave primária) disponível para uma tabela.

    Como o schema do hospital.sql NÃO define AUTO_INCREMENT nas chaves
    primárias, o próximo INSERT precisa informar o código manualmente.
    A consulta busca o maior código existente e soma 1.
    """
    try:
        with get_connection() as conexao:
            with conexao.cursor() as cursor:
                sql = f'SELECT COALESCE(MAX({coluna}), 0) + 1 AS proximo FROM {tabela}'
                cursor.execute(sql)
                resultado = cursor.fetchone()
                return int(resultado['proximo'])
    except pymysql.MySQLError as erro:
        raise ConnectionError(
            f'Não foi possível gerar o próximo código da tabela {tabela}: {erro}'
        )


# --------------------------- OPERAÇÕES DE SELECT -----------------------------


def listar_pacientes(filtro_nome=None):
    """
    Busca pacientes no banco (SELECT).

    Se "filtro_nome" for informado, retorna apenas os pacientes cujo nome
    CONTÉM o texto digitado (operador LIKE). Caso contrário, lista todos.

    Também faz um LEFT JOIN para mostrar o plano de saúde de cada paciente.
    """
    try:
        with get_connection() as conexao:
            with conexao.cursor() as cursor:
                # Consulta base: paciente junto com o nome do plano de saúde
                sql = """
                    SELECT p.cod_pac,
                           p.nome,
                           p.telefone,
                           p.CPF,
                           p.data_nascimento,
                           p.sexo,
                           p.endereco,
                           p.email,
                           ps.nome_plano
                    FROM paciente p
                    LEFT JOIN paciente_plano pp   ON p.cod_pac = pp.cod_pac
                    LEFT JOIN plano_saude ps      ON pp.cod_plano = ps.cod_plano
                """

                # Se o usuário digitou algo no filtro, adiciona a cláusula WHERE
                if filtro_nome:
                    sql += ' WHERE p.nome LIKE %s'
                    cursor.execute(sql, (f'%{filtro_nome}%',))
                else:
                    cursor.execute(sql)

                # Puxa todas as linhas retornadas e devolve como lista
                return cursor.fetchall()

    except pymysql.MySQLError as erro:
        raise ConnectionError(f'Erro ao consultar pacientes: {erro}')


def buscar_paciente(cod_pac):
    """
    Busca UM único paciente pelo seu código (usado no formulário de UPDATE
    para preencher os campos com os dados atuais do paciente).
    """
    try:
        with get_connection() as conexao:
            with conexao.cursor() as cursor:
                sql = 'SELECT * FROM paciente WHERE cod_pac = %s'
                cursor.execute(sql, (cod_pac,))
                return cursor.fetchone()

    except pymysql.MySQLError as erro:
        raise ConnectionError(f'Erro ao buscar paciente: {erro}')


# --------------------------- OPERAÇÃO DE INSERT ------------------------------


def inserir_paciente(dados):
    """
    Cadastra um novo paciente no banco (INSERT).

    "dados" é um dicionário com as informações vindas do formulário HTML.
    O código (cod_pac) é gerado automaticamente com a função
    obter_proximo_codigo().
    """
    try:
        codigo = obter_proximo_codigo('paciente', 'cod_pac')

        with get_connection() as conexao:
            with conexao.cursor() as cursor:
                sql = """
                    INSERT INTO paciente
                        (cod_pac, nome, telefone, CPF, data_nascimento,
                         sexo, endereco, email)
                    VALUES
                        (%s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(sql, (
                    codigo,
                    dados.get('nome'),
                    dados.get('telefone') or None,
                    dados.get('cpf') or None,
                    dados.get('data_nascimento') or None,
                    dados.get('sexo') or None,
                    dados.get('endereco') or None,
                    dados.get('email') or None,
                ))
                # O PyMySQL NÃO faz commit automaticamente ao fechar a conexão:
                # é preciso confirmar a gravação explicitamente (COMMIT).
                conexao.commit()
                return codigo  # Devolve o código gerado (para mostrar na tela)

    except pymysql.MySQLError as erro:
        raise ConnectionError(f'Erro ao cadastrar paciente: {erro}')


# --------------------------- OPERAÇÃO DE UPDATE ------------------------------


def atualizar_paciente(cod_pac, dados):
    """
    Atualiza os dados de um paciente existente (UPDATE).

    Somente os campos preenchidos pelo usuário no formulário de edição são
    alterados; a chave primária (cod_pac) nunca muda.
    """
    try:
        with get_connection() as conexao:
            with conexao.cursor() as cursor:
                sql = """
                    UPDATE paciente
                    SET nome            = %s,
                        telefone        = %s,
                        CPF             = %s,
                        data_nascimento = %s,
                        sexo            = %s,
                        endereco        = %s,
                        email           = %s
                    WHERE cod_pac = %s
                """
                cursor.execute(sql, (
                    dados.get('nome'),
                    dados.get('telefone') or None,
                    dados.get('cpf') or None,
                    dados.get('data_nascimento') or None,
                    dados.get('sexo') or None,
                    dados.get('endereco') or None,
                    dados.get('email') or None,
                    cod_pac,
                ))
                conexao.commit()  # Confirma (COMMIT) a atualização no banco
                # Devolve quantas linhas foram alteradas (0 = nada foi mudado)
                return cursor.rowcount

    except pymysql.MySQLError as erro:
        raise ConnectionError(f'Erro ao atualizar paciente: {erro}')