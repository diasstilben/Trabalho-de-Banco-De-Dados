from flask import Flask, render_template, request, redirect
import mysql.connector

app = Flask(__name__)

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="HOSPITAL"
    )

# --- ROTA PRINCIPAL (SELECTs com suporte a formulários de busca para cada tabela) ---
@app.route('/')
def index():
    # Captura termos de busca específicos de cada aba (se houver)
    b_paciente = request.args.get('b_paciente', '')
    b_medico = request.args.get('b_medico', '')
    b_plano = request.args.get('b_plano', '')
    b_especialidade = request.args.get('b_especialidade', '')
    b_formacao = request.args.get('b_formacao', '')
    b_consulta = request.args.get('b_consulta', '')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # 1. Pacientes (SELECT com filtro por nome)
    if b_paciente:
        cursor.execute("SELECT * FROM paciente WHERE nome LIKE %s", (f"%{b_paciente}%",))
    else:
        cursor.execute("SELECT * FROM paciente")
    pacientes = cursor.fetchall()
    
    # 2. Médicos (SELECT com filtro por nome)
    if b_medico:
        cursor.execute("SELECT * FROM medico WHERE nome LIKE %s", (f"%{b_medico}%",))
    else:
        cursor.execute("SELECT * FROM medico")
    medicos = cursor.fetchall()
    
    # 3. Planos de Saúde (SELECT com filtro por nome do plano)
    if b_plano:
        cursor.execute("SELECT * FROM plano_saude WHERE nome_plano LIKE %s", (f"%{b_plano}%",))
    else:
        cursor.execute("SELECT * FROM plano_saude")
    planos = cursor.fetchall()

    # 4. Especialidades (SELECT com filtro)
    if b_especialidade:
        cursor.execute("SELECT * FROM especialidade WHERE especializacao LIKE %s", (f"%{b_especialidade}%",))
    else:
        cursor.execute("SELECT * FROM especialidade")
    especialidades = cursor.fetchall()

    # 5. Formações (SELECT com filtro)
    if b_formacao:
        cursor.execute("SELECT * FROM formacao WHERE grau_formacao LIKE %s", (f"%{b_formacao}%",))
    else:
        cursor.execute("SELECT * FROM formacao")
    formacoes = cursor.fetchall()

    # 6. Estados (SELECT simples)
    cursor.execute("SELECT * FROM estado")
    estados = cursor.fetchall()

    # 7. Consultas (SELECT com filtro por código do paciente)
    if b_consulta:
        cursor.execute("SELECT * FROM consulta WHERE cod_pac = %s", (b_consulta,))
    else:
        cursor.execute("SELECT * FROM consulta")
    consultas = cursor.fetchall()

    # 8. Paciente Plano (SELECT simples)
    cursor.execute("SELECT * FROM paciente_plano")
    paciente_planos = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return render_template('index.html', 
                           pacientes=pacientes, b_paciente=b_paciente,
                           medicos=medicos, b_medico=b_medico,
                           planos=planos, b_plano=b_plano,
                           especialidades=especialidades, b_especialidade=b_especialidade,
                           formacoes=formacoes, b_formacao=b_formacao,
                           estados=estados,
                           consultas=consultas, b_consulta=b_consulta,
                           paciente_planos=paciente_planos)

# --- ROTAS DE INSERT PADRONIZADAS PARA CADA TABELA ---

@app.route('/cadastrar/paciente', methods=['POST'])
def cadastrar_paciente():
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = "INSERT INTO paciente (cod_pac, nome, telefone, CPF, data_nascimento, sexo, endereco, email) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    val = (request.form['cod_pac'], request.form['nome'], request.form['telefone'], request.form['CPF'], request.form['data_nascimento'] or None, request.form['sexo'], request.form['endereco'], request.form['email'])
    cursor.execute(sql, val)
    conn.commit()
    cursor.close()
    conn.close()
    return redirect('/?tab=paciente')

@app.route('/cadastrar/medico', methods=['POST'])
def cadastrar_medico():
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = "INSERT INTO medico (matr, nome, telefone, CPF, cod_form, cod_esp) VALUES (%s, %s, %s, %s, %s, %s)"
    val = (request.form['matr'], request.form['nome'], request.form['telefone'], request.form['CPF'], request.form['cod_form'], request.form['cod_esp'])
    cursor.execute(sql, val)
    conn.commit()
    cursor.close()
    conn.close()
    return redirect('/?tab=medico')

@app.route('/cadastrar/plano', methods=['POST'])
def cadastrar_plano():
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = "INSERT INTO plano_saude (cod_plano, nome_plano, abrangencia) VALUES (%s, %s, %s)"
    val = (request.form['cod_plano'], request.form['nome_plano'], request.form['abrangencia'])
    cursor.execute(sql, val)
    conn.commit()
    cursor.close()
    conn.close()
    return redirect('/?tab=plano')

@app.route('/cadastrar/especialidade', methods=['POST'])
def cadastrar_especialidade():
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = "INSERT INTO especialidade (cod_esp, especializacao) VALUES (%s, %s)"
    val = (request.form['cod_esp'], request.form['especializacao'])
    cursor.execute(sql, val)
    conn.commit()
    cursor.close()
    conn.close()
    return redirect('/?tab=especialidade')

@app.route('/cadastrar/formacao', methods=['POST'])
def cadastrar_formacao():
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = "INSERT INTO formacao (cod_form, grau_formacao) VALUES (%s, %s)"
    val = (request.form['cod_form'], request.form['grau_formacao'])
    cursor.execute(sql, val)
    conn.commit()
    cursor.close()
    conn.close()
    return redirect('/?tab=formacao')

@app.route('/cadastrar/consulta', methods=['POST'])
def cadastrar_consulta():
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = "INSERT INTO consulta (cod_consulta, cod_pac, cod_med, data_consulta, cod_es) VALUES (%s, %s, %s, %s, %s)"
    val = (request.form['cod_consulta'], request.form['cod_pac'], request.form['cod_med'], request.form['data_consulta'], request.form['cod_es'])
    cursor.execute(sql, val)
    conn.commit()
    cursor.close()
    conn.close()
    return redirect('/?tab=consulta')

@app.route('/cadastrar/paciente_plano', methods=['POST'])
def cadastrar_paciente_plano():
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = "INSERT INTO paciente_plano (cod_pac, cod_plano, numero_carteirinha) VALUES (%s, %s, %s)"
    val = (request.form['cod_pac'], request.form['cod_plano'], request.form['numero_carteirinha'])
    cursor.execute(sql, val)
    conn.commit()
    cursor.close()
    conn.close()
    return redirect('/?tab=paciente_plano')

if __name__ == '__main__':
    app.run(debug=True)