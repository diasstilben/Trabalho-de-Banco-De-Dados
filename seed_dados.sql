-- ============================================================================
-- seed_dados.sql — Dados de demonstração para o banco HOSPITAL
-- ----------------------------------------------------------------------------
-- OBSERVAÇÕES:
--  * Este arquivo é OPCIONAL e serve apenas para popular o banco com alguns
--    registros de exemplo (deixe a apresentação com dados para exibir).
--  * Rode SOMENTE DEPOIS de carregar o schema (hospital.sql) e somente se as
--    tabelas estiverem vazias (ou remova os IDs conflitantes).
--  * NÃO altera a estrutura das tabelas: apenas faz INSERTs.
-- ============================================================================

USE HOSPITAL;

-- --------------------------- Tabelas "pai" (sem dependência) ----------------

-- Formações acadêmicas dos médicos
INSERT INTO formacao (cod_form, grau_formacao) VALUES
    (1, 'Graduação'),
    (2, 'Residência'),
    (3, 'Especialização');

-- Especialidades médicas
INSERT INTO especialidade (cod_esp, especializacao) VALUES
    (1, 'Cardiologia'),
    (2, 'Pediatria'),
    (3, 'Ortopedia'),
    (4, 'Clínico Geral');

-- Planos de saúde oferecidos
INSERT INTO plano_saude (cod_plano, nome_plano, abrangencia) VALUES
    (1, 'Unimed',  'Nacional'),
    (2, 'Amil',    'Regional');

-- Tipos de alergia registrados
INSERT INTO alergia (cod_alergia, descricao) VALUES
    (1, 'Penicilina'),
    (2, 'Amendoim'),
    (3, 'Camomila');

-- Tipos de caso clínico
INSERT INTO caso (cod_caso, descricao, estagio) VALUES
    (1, 'Consulta de rotina',     'Leve'),
    (2, 'Dor abdominal aguda',    'Agudo');

-- Partes do corpo relacionadas aos casos
INSERT INTO corpo (cod_corpo, descricao) VALUES
    (1, 'Cabeça'),
    (2, 'Abdômen'),
    (3, 'Tórax');

-- Tipos de exame
INSERT INTO tipo_exame (cod_texame, tipo_exame) VALUES
    (1, 'Hemograma'),
    (2, 'Raio-X');

-- Tipos de cirurgia
INSERT INTO tipo_cirurgia (cod_tcirurgia, descricao) VALUES
    (1, 'Apendicectomia');

-- Papéis na equipe cirúrgica
INSERT INTO participacao (cod_part, descr) VALUES
    (1, 'Cirurgião principal'),
    (2, 'Auxiliar');

-- Medicamentos do hospital
INSERT INTO medicamento (cod_medicamento, nome, principio_ativo) VALUES
    (1, 'Dipirona',     'Metamizol'),
    (2, 'Amoxicilina',  'Amoxicilina');

-- Leitos disponíveis (status 1 = livre, 2 = ocupado)
INSERT INTO leito (cod_leito, numero, tipo, cod_status) VALUES
    (1, 'A-101', 'Enfermaria',  1),
    (2, 'B-102', 'UTI',         2);

-- --------------------------- Tabelas dependentes ----------------------------

-- Médicos (dependem de formacao e especialidade)
INSERT INTO medico (matr, nome, telefone, CPF, cod_form, cod_esp) VALUES
    (1, 'Dra. Ana Souza',    '11911112222', '12345678901', 3, 1),
    (2, 'Dr. Bruno Lima',    '11922223333', '23456789012', 2, 2),
    (3, 'Dr. Carlos Reis',   '11933334444', '34567890123', 1, 4);

-- Pacientes
INSERT INTO paciente (cod_pac, nome, telefone, CPF, data_nascimento, sexo, endereco, email) VALUES
    (1, 'Maria Oliveira',    '11944445555', '45678901234', '1985-03-12', 'F', 'Rua das Flores, 100',  'maria@email.com'),
    (2, 'João Santos',       '11955556666', '56789012345', '1990-07-25', 'M', 'Av. Paulista, 2000',   'joao@email.com'),
    (3, 'Fernanda Lima',     '11966667777', '67890123456', '2001-11-02', 'F', 'Rua A, 50',            'fernanda@email.com'),
    (4, 'Pedro Almeida',     '11977778888', '78901234567', '1978-01-30', 'M', 'Rua B, 333',           'pedro@email.com'),
    (5, 'Ana Costa',         '11988889999', '89012345678', '2012-05-19', 'F', 'Rua C, 87',            'ana@email.com');

-- Vínculo paciente <-> plano de saúde
INSERT INTO paciente_plano (cod_pac, cod_plano, numero_carteirinha) VALUES
    (1, 1, 'UNIMED1001'),
    (2, 2, 'AMIL2002'),
    (4, 1, 'UNIMED1004');

-- Vínculo paciente <-> alergias
INSERT INTO paciente_alergia (cod_pac, cod_alergia) VALUES
    (2, 1),
    (3, 2);

-- Consultas (dependem de paciente, medico, caso, corpo e estado)
INSERT INTO consulta (cod_consulta, cod_pac, cod_med, caso, cod_corpo, data_consulta, cod_es) VALUES
    (1, 1, 3, 1, 3, '2026-09-10', 2),  -- realizada
    (2, 2, 1, 2, 2, '2026-09-15', 1),  -- agendada
    (3, 5, 2, 1, 1, '2026-09-12', 2);  -- realizada

-- Exames vinculados às consultas
INSERT INTO examinar (cod_consulta, cod_texame, data_exame, cod_es) VALUES
    (1, 1, '2026-09-10', 2),
    (2, 1, '2026-09-15', 1);

-- Cirurgia + equipe (participação)
INSERT INTO cirurgia (cod_cirurgia, cod_consulta, cod_tcirurgia, data_cirurgia, cod_es) VALUES
    (1, 2, 1, '2026-09-20', 1);

INSERT INTO alocamedico (cod_medico, cod_cirurgia, cod_part) VALUES
    (1, 1, 1),
    (3, 1, 2);

-- Prescrições e medicamentos prescritos
INSERT INTO prescricao (cod_prescricao, cod_consulta, data_prescricao) VALUES
    (1, 1, '2026-09-10'),
    (2, 3, '2026-09-12');

INSERT INTO prescricao_medicamento (cod_prescricao, cod_medicamento, posologia, duracao_dias) VALUES
    (1, 1, '1 comprimido a cada 8 horas', 5),
    (2, 2, '1 cápsula a cada 12 horas', 7);

-- Internações
INSERT INTO internacao (cod_internacao, cod_pac, cod_leito, data_entrada, data_saida, motivo) VALUES
    (1, 2, 2, '2026-09-14 18:30:00', NULL, 'Observação pós-cirúrgica'),
    (2, 1, 1, '2026-09-09 10:00:00', '2026-09-11 09:00:00', 'Hidratação');

-- Fim do seed_dados.sql