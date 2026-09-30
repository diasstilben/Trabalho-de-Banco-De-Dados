"""
Sistema Web de Gestão Hospitalar - Tabela Pacientes
Projeto Acadêmico - Banco de Dados (UERJ-IPRJ)
"""

from flask import Flask, render_template, request, redirect 
import mysql.connector

app = Flask(__name__)

# ==============================================================================
# 1. CONEXÃO
# ==============================================================================
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",    
        user="root",         
        password="",         
        database="HOSPITAL"  
    )

# ==============================================================================
# 2. ROTA PRINCIPAL (Buscar e Listar Pacientes)
# ==============================================================================
@app.route('/') # Responsável por fazer a ponte entre a URL e o Código em Python.
def index():
    # Pega o que foi digitado na barra de pesquisa (se houver)
    b_paciente = request.args.get('b_paciente', '')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True) 
    
    # Se pesquisou algo, filtra pelo nome. Se não, traz todos.
    if b_paciente:
        cursor.execute("SELECT * FROM paciente WHERE nome LIKE %s", (f"%{b_paciente}%",))
    else:
        cursor.execute("SELECT * FROM paciente")
        
    pacientes = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    # Manda a lista para o HTML
    return render_template('index.html', pacientes=pacientes, b_paciente=b_paciente)

# ==============================================================================
# 3. ROTA DE CADASTRO (Inserir Paciente com Tratamento de Erro)
# ==============================================================================
@app.route('/cadastrar/paciente', methods=['POST'])
def cadastrar_paciente():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # SQL blindado contra Injeção SQL
    sql = "INSERT INTO paciente (cod_pac, nome, telefone, CPF, data_nascimento, sexo, endereco, email) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)" # O MySQL é forçado a tratar qualquer coisa que venha nessa variavél estritamente como texto puro(literal). 
    
    # Os nomes aqui combinam EXATAMENTE com os 'name' do HTML
    val = (
        request.form['cod_pac'], 
        request.form['nome'], 
        request.form['telefone'], 
        request.form['CPF'], 
        request.form['data_nascimento'] or None, 
        request.form['sexo'], 
        request.form['endereco'], 
        request.form['email']
    )
    
    try:
        cursor.execute(sql, val)
        conn.commit() # Grava no banco
        
    except mysql.connector.IntegrityError:
        # Se for repetido (Código ou CPF já existem)
        conn.rollback()
        cursor.close()
        conn.close()
        return """
            <script>
                alert('Erro: Este paciente (Código ou CPF) já está cadastrado no sistema!');
                window.location.href = '/';
            </script>
        """
        
    cursor.close()
    conn.close()
    return redirect('/')

# ==============================================================================
# 4. START DO SERVIDOR
# ==============================================================================
if __name__ == '__main__':
    app.run(debug=True)