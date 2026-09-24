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

CREATE TABLE alergia (
    cod_alergia     INT(11) PRIMARY KEY,
    descricao       VARCHAR(100) NOT NULL
);
 
CREATE TABLE paciente_alergia (
    cod_pac         INT(11),
    cod_alergia     INT(11),
    PRIMARY KEY (cod_pac, cod_alergia),
    FOREIGN KEY (cod_pac) REFERENCES paciente(cod_pac),
    FOREIGN KEY (cod_alergia) REFERENCES alergia(cod_alergia)
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

CREATE TABLE caso (
    cod_caso        INT(11) PRIMARY KEY,
    descricao       VARCHAR(255) NOT NULL,
    estagio         VARCHAR(50)   -- ajuste o tipo/tamanho conforme o que "estágio" representa
);

CREATE TABLE corpo (
    cod_corpo       INT(11) PRIMARY KEY,
    descricao       VARCHAR(100) NOT NULL
);

CREATE TABLE consulta (
    cod_consulta        INT(11) PRIMARY KEY,
    cod_pac             INT(11),
    cod_med             INT(11),
    caso                INT(11),
    cod_corpo           INT(11),
    data_consulta       DATE,
    cod_es              int(11) DEFAULT 1,
    FOREIGN KEY (cod_pac) REFERENCES paciente(cod_pac),
    FOREIGN KEY (cod_med) REFERENCES medico(matr),
    FOREIGN KEY (caso) REFERENCES caso(cod_caso),
    FOREIGN KEY (cod_corpo) REFERENCES corpo(cod_corpo),
    Foreign Key (cod_es) REFERENCES estado(cod_es)
);

CREATE TABLE tipo_exame (
    cod_texame      INT(11) PRIMARY KEY,
    tipo_exame      VARCHAR(50) NOT NULL
);

CREATE TABLE examinar (
    cod_consulta    INT(11),
    cod_texame      INT(11),
    data_exame      DATE,
    cod_es              int(11) DEFAULT 1,
    PRIMARY KEY (cod_consulta, cod_texame),
    FOREIGN KEY (cod_consulta) REFERENCES consulta(cod_consulta),
    FOREIGN KEY (cod_texame) REFERENCES tipo_exame(cod_texame),
    Foreign Key (cod_es) REFERENCES estado(cod_es)
);

CREATE TABLE tipo_cirurgia (
    cod_tcirurgia   INT(11) PRIMARY KEY,
    descricao       VARCHAR(50) NOT NULL
);

CREATE TABLE cirurgia (
    cod_cirurgia        INT(11) PRIMARY KEY,
    cod_consulta        INT(11),
    cod_tcirurgia       INT(11),
    data_cirurgia       DATE,
    cod_es              int(11) DEFAULT 1,
    FOREIGN KEY (cod_consulta) REFERENCES consulta(cod_consulta),
    Foreign Key (cod_tcirurgia) REFERENCES tipo_cirurgia(cod_tcirurgia),
    Foreign Key (cod_es) REFERENCES estado(cod_es)
);


CREATE TABLE participacao (
    cod_part        INT(11) PRIMARY KEY,
    descr           VARCHAR(50) NOT NULL
);

CREATE TABLE alocamedico (
    cod_medico      INT(11),
    cod_cirurgia    INT(11),
    cod_part        INT(11),
    PRIMARY KEY (cod_medico, cod_cirurgia, cod_part),
    FOREIGN KEY (cod_medico) REFERENCES medico(matr),
    FOREIGN KEY (cod_cirurgia) REFERENCES cirurgia(cod_cirurgia),
    FOREIGN KEY (cod_part) REFERENCES participacao(cod_part)
);

CREATE TABLE status_leito(
    cod_status      INT(11) PRIMARY KEY,
    `desc`          VARCHAR(20) NOT NULL
);

INSERT INTO status_leito
    VALUES(1,'livre');

INSERT INTO status_leito
    VALUES(2,'ocupado');

CREATE TABLE leito (
    cod_leito       INT(11) PRIMARY KEY,
    numero          VARCHAR(10) NOT NULL,
    tipo            VARCHAR(30),  -- ex: enfermaria, UTI, apartamento
    cod_status      INT(11) DEFAULT 1,
    Foreign Key (cod_status) REFERENCES status_leito(cod_status)
);
 
CREATE TABLE internacao (
    cod_internacao      INT(11) PRIMARY KEY,
    cod_pac             INT(11),
    cod_leito           INT(11),
    data_entrada        DATETIME,
    data_saida          DATETIME,
    motivo              VARCHAR(255),
    FOREIGN KEY (cod_pac) REFERENCES paciente(cod_pac),
    FOREIGN KEY (cod_leito) REFERENCES leito(cod_leito)
);

CREATE TABLE medicamento (
    cod_medicamento     INT(11) PRIMARY KEY,
    nome                VARCHAR(100) NOT NULL,
    principio_ativo     VARCHAR(100)
);
 
CREATE TABLE prescricao (
    cod_prescricao      INT(11) PRIMARY KEY,
    cod_consulta        INT(11),
    data_prescricao     DATE,
    FOREIGN KEY (cod_consulta) REFERENCES consulta(cod_consulta)
);
 
CREATE TABLE prescricao_medicamento (
    cod_prescricao      INT(11),
    cod_medicamento     INT(11),
    posologia           VARCHAR(100),
    duracao_dias        INT(11),
    PRIMARY KEY (cod_prescricao, cod_medicamento),
    FOREIGN KEY (cod_prescricao) REFERENCES prescricao(cod_prescricao),
    FOREIGN KEY (cod_medicamento) REFERENCES medicamento(cod_medicamento)
);

