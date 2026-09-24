"""
app.py — Aplicação web Flask do Trabalho de Banco de Dados (banco HOSPITAL).

Este arquivo contém as "rotas" (páginas) da aplicação:
  /                      -> página inicial (menu de navegação)
  /consultar/pacientes   -> SELECT de pacientes (com filtro por nome)
  /cadastrar             -> INSERT de um novo paciente
  /atualizar             -> UPDATE dos dados de um paciente existente

Toda a comunicação com o MySQL está separada no arquivo db.py.
"""

import re  # Usado para validar CPF (somente números), e-mail, etc.

from flask import (
    Flask,            # Cria a aplicação web
    render_template,  # Renderiza os arquivos HTML (pasta templates/)
    request,          # Captura os dados enviados pelos formulários
    redirect,         # Redireciona o usuário para outra página
    url_for,          # Gera a URL de uma rota pelo nome
    flash,            # Exibe mensagens temporárias (sucesso/erro)
)

import db  # Nossas funções de acesso ao banco (módulo db.py)


# Cria a aplicação Flask
app = Flask(__name__)

# Segredo usado pelo Flask para assinar mensagens "flash" e sessões.
# Em um projeto real, esse valor ficaria protegido no .env.
app.secret_key = 'chave-do-trabalho-de-banco-de-dados'


# ------------------------------ VALIDAÇÕES -----------------------------------

def validar_cpf(cpf):
    """Valida o CPF: deve ser vazio ou ter exatamente 11 dígitos numéricos."""
    if not cpf:
        return None  # campo vazio é permitido
    cpf_limpo = re.sub(r'\D', '', cpf)  # remove pontos e tracinhos
    if len(cpf_limpo) != 11:
        raise ValueError('O CPF deve conter 11 números.')
    return cpf_limpo


def validar_sexo(sexo):
    """Valida o sexo: vazio, M ou F (aceita minúsculas)."""
    if not sexo:
        return None
    sexo = sexo.upper()
    if sexo not in ('M', 'F'):
        raise ValueError("O sexo deve ser 'M' ou 'F'.")
    return sexo


# --------------------------------- ROTAS -------------------------------------

# Página inicial: mostra o menu com as opções do sistema
@app.route('/')
def index():
    return render_template('index.html')


# ---------------------------------------------------------------------------
# CONSULTA (SELECT) de pacientes — aceita um filtro opcional por nome.
# A rota responde tanto a GET (abrir a página) quanto a POST (enviar o filtro).
# ---------------------------------------------------------------------------
@app.route('/consultar/pacientes', methods=['GET', 'POST'])
def consultar_pacientes():
    # Em POST, o filtro digitado no formulário chega no request.form.
    # Em GET, pode chegar na URL como ?nome=...
    filtro = request.form.get('nome', '').strip() or request.args.get('nome', '')

    try:
        pacientes = db.listar_pacientes(filtro_nome=filtro or None)

        # Monta uma lista de "dicionários prontos para exibir": formata a data
        # para o formato brasileiro e o sexo para "Masculino/Feminino".
        for p in pacientes:
            p['data_formatada'] = formatar_data(p.get('data_nascimento'))
            p['sexo_formatado'] = 'Masculino' if p.get('sexo') == 'M' else (
                                   'Feminino' if p.get('sexo') == 'F' else '—')

        return render_template('consultar.html', pacientes=pacientes, filtro=filtro)

    except ConnectionError as erro:
        # Qualquer falha de conexão/consulta cai aqui e abre a página de erro
        return render_template('erro.html', mensagem=str(erro)), 500


# ---------------------------------------------------------------------------
# CADASTRO (INSERT) de um novo paciente.
# GET  -> exibe o formulário vazio
# POST -> valida os dados e salva no banco
# ---------------------------------------------------------------------------
@app.route('/cadastrar', methods=['GET', 'POST'])
def cadastrar_paciente():
    if request.method == 'POST':
        # Pega os campos enviados pelo formulário HTML
        dados = {
            'nome': request.form.get('nome', '').strip(),
            'telefone': request.form.get('telefone', '').strip(),
            'cpf': request.form.get('cpf', '').strip(),
            'data_nascimento': request.form.get('data_nascimento', '').strip(),
            'sexo': request.form.get('sexo', '').strip(),
            'endereco': request.form.get('endereco', '').strip(),
            'email': request.form.get('email', '').strip(),
        }

        try:
            # ---- Validações básicas (servidor) ----
            if not dados['nome']:
                raise ValueError('O nome do paciente é obrigatório.')

            dados['cpf'] = validar_cpf(dados['cpf'])
            dados['sexo'] = validar_sexo(dados['sexo'])

            # ---- Grava (INSERT) ----
            codigo_gerado = db.inserir_paciente(dados)
            flash(f'Paciente cadastrado com sucesso! Código: {codigo_gerado}.', 'sucesso')
            return redirect(url_for('consultar_pacientes'))

        except ValueError as erro:
            # Erro de validação: mostra o formulário novamente com a mensagem
            flash(str(erro), 'erro')
            return render_template('cadastrar.html', dados=dados)

        except ConnectionError as erro:
            return render_template('erro.html', mensagem=str(erro)), 500

    # GET: página com o formulário vazio
    return render_template('cadastrar.html', dados=None)


# ---------------------------------------------------------------------------
# ATUALIZAÇÃO (UPDATE) dos dados de um paciente.
# GET ?cod=X  -> carrega o paciente X e mostra o formulário preenchido
# POST        -> valida e grava as alterações
# ---------------------------------------------------------------------------
@app.route('/atualizar', methods=['GET', 'POST'])
def atualizar_paciente():
    if request.method == 'POST':
        # Código do paciente vem em um campo oculto (hidden) do formulário
        cod_pac = request.form.get('cod_pac', '').strip()

        dados = {
            'nome': request.form.get('nome', '').strip(),
            'telefone': request.form.get('telefone', '').strip(),
            'cpf': request.form.get('cpf', '').strip(),
            'data_nascimento': request.form.get('data_nascimento', '').strip(),
            'sexo': request.form.get('sexo', '').strip(),
            'endereco': request.form.get('endereco', '').strip(),
            'email': request.form.get('email', '').strip(),
        }

        try:
            if not cod_pac.isdigit():
                raise ValueError('Código do paciente inválido.')
            if not dados['nome']:
                raise ValueError('O nome do paciente é obrigatório.')

            dados['cpf'] = validar_cpf(dados['cpf'])
            dados['sexo'] = validar_sexo(dados['sexo'])

            # ---- Grava as alterações (UPDATE) ----
            linhas = db.atualizar_paciente(int(cod_pac), dados)
            if linhas:
                flash('Dados do paciente atualizados com sucesso!', 'sucesso')
            else:
                flash('Nenhum dado foi alterado (valores iguais aos atuais).', 'aviso')
            return redirect(url_for('atualizar_paciente', cod=cod_pac))

        except ValueError as erro:
            flash(str(erro), 'erro')
            paciente_atual = db.buscar_paciente(int(cod_pac)) if cod_pac.isdigit() else None
            return render_template('atualizar.html', pacientes=db.listar_pacientes(),
                                   paciente=paciente_atual, dados=dados), 400

        except ConnectionError as erro:
            return render_template('erro.html', mensagem=str(erro)), 500

    # GET: lista os pacientes para escolher, e se vier ?cod=X preenche o form
    cod = request.args.get('cod', '')
    try:
        pacientes = db.listar_pacientes()
        paciente = db.buscar_paciente(int(cod)) if cod.isdigit() else None
        if paciente:
            # Converte a data para o formato que o <input type=date> entende
            paciente['data_nascimento'] = formatar_data_para_edicao(
                paciente.get('data_nascimento'))
        return render_template('atualizar.html', pacientes=pacientes,
                               paciente=paciente, dados=None)
    except ConnectionError as erro:
        return render_template('erro.html', mensagem=str(erro)), 500


# ------------------------- FUNÇÕES AUXILIARES --------------------------------

def formatar_data(data):
    """Converte uma data AAAA-MM-DD (MySQL) em DD/MM/AAAA para exibir."""
    if not data:
        return '—'
    return data.strftime('%d/%m/%Y')


def formatar_data_para_edicao(data):
    """Devolve a data no formato AAAA-MM-DD esperado pelo input HTML type=date."""
    if not data:
        return ''
    return data.strftime('%Y-%m-%d')


# ------------------------------ EXECUÇÃO -------------------------------------

if __name__ == '__main__':
    # Subir o servidor local: python app.py
    # Acesse no navegador em http://127.0.0.1:5000
    app.run(host='127.0.0.1', port=5000, debug=True)