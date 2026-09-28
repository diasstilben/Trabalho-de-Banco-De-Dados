from flask import Flask, render_template, request, redirect
import mysql.connector

app = Flask(__name__)

# Configuração do banco de dados
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root", 
        password="", 
        database="HOSPITAL"
    )

@app.route('/')
def index():
    # Consulta SELECT exigida pelo trabalho
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT cod_pac, nome, telefone, CPF FROM paciente")
    pacientes = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template('index.html', pacientes=pacientes)

@app.route('/cadastrar', methods=['POST'])
def cadastrar():
    # Consulta INSERT exigida pelo trabalho
    if request.method == 'POST':
        cod_pac = request.form['cod_pac']
        nome = request.form['nome']
        telefone = request.form['telefone']
        cpf = request.form['cpf']
        
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = "INSERT INTO paciente (cod_pac, nome, telefone, CPF) VALUES (%s, %s, %s, %s)"
        val = (cod_pac, nome, telefone, cpf)
        cursor.execute(sql, val)
        conn.commit()
        cursor.close()
        conn.close()
        
        return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)