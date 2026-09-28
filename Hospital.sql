CREATE DATABASE IF NOT EXISTS HOSPITAL;
USE HOSPITAL;

CREATE TABLE paciente (
    cod_pac         INT(11) PRIMARY KEY,
    nome            VARCHAR(100) NOT NULL,
    telefone        VARCHAR(13),
    CPF             CHAR(11) UNIQUE,
    data_nascimento DATE,
    sexo            CHAR(1),
    endereco        VARCHAR(150),
    email           VARCHAR(100)
);




CREATE TABLE plano_saude (
    cod_plano       INT(11) PRIMARY KEY,
    nome_plano      VARCHAR(100) NOT NULL,
    abrangencia     VARCHAR(50)
);

CREATE TABLE paciente_plano (
    cod_pac             INT(11),
    cod_plano           INT(11),
    numero_carteirinha  VARCHAR(30),
    PRIMARY KEY (cod_pac, cod_plano),
    FOREIGN KEY (cod_pac) REFERENCES paciente(cod_pac),
    FOREIGN KEY (cod_plano) REFERENCES plano_saude(cod_plano)
);


CREATE TABLE estado(
    cod_es          INT(11) PRIMARY KEY,
    descr           VARCHAR(30) NOT NULL
);
INSERT INTO estado VALUES (1, 'agendada');
INSERT INTO estado VALUES (2, 'realizada');
INSERT INTO estado VALUES (3, 'nao realizada');

CREATE TABLE formacao (
    cod_form        INT(11) PRIMARY KEY,
    grau_formacao   VARCHAR(50) NOT NULL
);

CREATE TABLE especialidade (
    cod_esp         INT(11) PRIMARY KEY,
    especializacao  VARCHAR(100) NOT NULL
);

CREATE TABLE medico (
    matr        INT(11) PRIMARY KEY,
    nome        VARCHAR(100) NOT NULL,
    telefone    VARCHAR(13),
    CPF         CHAR(11) UNIQUE,
    cod_form    INT(11),
    cod_esp     INT(11),
    FOREIGN KEY (cod_form) REFERENCES formacao(cod_form),
    FOREIGN KEY (cod_esp) REFERENCES especialidade(cod_esp)
);


CREATE TABLE consulta (
    cod_consulta        INT(11) PRIMARY KEY,
    cod_pac             INT(11),
    cod_med             INT(11),
    data_consulta       DATE,
    cod_es              int(11) DEFAULT 1,
    FOREIGN KEY (cod_pac) REFERENCES paciente(cod_pac),
    FOREIGN KEY (cod_med) REFERENCES medico(matr),
    Foreign Key (cod_es) REFERENCES estado(cod_es)
);



