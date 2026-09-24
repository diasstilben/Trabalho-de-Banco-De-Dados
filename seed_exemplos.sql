-- ============================================================================
-- seed_exemplos.sql — Dados de exemplo para o banco HOSPITAL
-- ----------------------------------------------------------------------------
-- Este script é OPCIONAL: popula o banco com aproximadamente 10 médicos,
-- 10 pacientes e registros de apoio (especialidades, casos, partes do corpo,
-- consultas etc.) para a demonstração em sala.
--
-- Rode SOMENTE DEPOIS de carregar o schema (hospital.sql) e somente se as
-- tabelas estiverem vazias (ou remova os IDs conflitantes).
-- NÃO altera a estrutura das tabelas: apenas faz INSERTs.
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
    (4, 'Clínico Geral'),
    (5, 'Dermatologia'),
    (6, 'Neurologia');

-- Planos de saúde oferecidos
INSERT INTO plano_saude (cod_plano, nome_plano, abrangencia) VALUES
    (1, 'Unimed', 'Nacional'),
    (2, 'Amil',   'Regional'),
    (3, 'Sul América', 'Nacional');

-- Tipos de alergia registrados
INSERT INTO alergia (cod_alergia, descricao) VALUES
    (1, 'Penicilina'),
    (2, 'Amendoim'),
    (3, 'Camomila'),
    (4, 'Dipirona');

-- Tipos de caso clínico
INSERT INTO caso (cod_caso, descricao, estagio) VALUES
    (1, 'Consulta de rotina',     'Leve'),
    (2, 'Dor abdominal aguda',    'Agudo'),
    (3, 'Revisão de exames',      'Leve');

-- Partes do corpo relacionadas aos casos
INSERT INTO corpo (cod_corpo, descricao) VALUES
    (1, 'Cabeça'),
    (2, 'Abdômen'),
    (3, 'Tórax'),
    (4, 'Membros inferiores');

-- Tipos de exame
INSERT INTO tipo_exame (cod_texame, tipo_exame) VALUES
    (1, 'Hemograma'),
    (2, 'Raio-X'),
    (3, 'Eletrocardiograma');

-- Tipos de cirurgia
INSERT INTO tipo_cirurgia (cod_tcirurgia, descricao) VALUES
    (1, 'Apendicectomia'),
    (2, 'Cirurgia ortopédica');

-- Papéis na equipe cirúrgica
INSERT INTO participacao (cod_part, descr) VALUES
    (1, 'Cirurgião principal'),
    (2, 'Auxiliar');

-- Medicamentos do hospital
INSERT INTO medicamento (cod_medicamento, nome, principio_ativo) VALUES
    (1, 'Dipirona',    'Metamizol'),
    (2, 'Amoxicilina', 'Amoxicilina'),
    (3, 'Paracetamol', 'Paracetamol');

-- Leitos disponíveis (status 1 = livre, 2 = ocupado)
INSERT INTO leito (cod_leito, numero, tipo, cod_status) VALUES
    (1, 'A-101', 'Enfermaria',  1),
    (2, 'B-102', 'UTI',         2),
    (3, 'C-201', 'Apartamento', 1);

-- --------------------------- Tabelas dependentes ----------------------------

-- 10 médicos (dependem de formacao e especialidade)
INSERT INTO medico (matr, nome, telefone, CPF, cod_form, cod_esp) VALUES
    (1,  'Dra. Ana Souza',       '11911112221', '12345678901', 3, 1),  -- Cardiologia
    (2,  'Dr. Bruno Lima',       '11911112222', '23456789012', 2, 2),  -- Pediatria
    (3,  'Dr. Carlos Reis',      '11911112223', '34567890123', 1, 4),  -- Clínico Geral
    (4,  'Dra. Débora Melo',     '11911112224', '45678901234', 3, 5),  -- Dermatologia
    (5,  'Dr. Eduardo Prado',    '11911112225', '56789012345', 3, 6),  -- Neurologia
    (6,  'Dra. Fernanda Rocha',  '11911112226', '67890123456', 2, 2),  -- Pediatria
    (7,  'Dr. Gustavo Nunes',    '11911112227', '78901234567', 3, 3),  -- Ortopedia
    (8,  'Dra. Helena Duarte',   '11911112228', '89012345678', 3, 1),  -- Cardiologia
    (9,  'Dr. Igor Vasconcellos','11911112229', '90123456789', 1, 4),  -- Clínico Geral
    (10, 'Dra. Juliana Castro',  '11911112210', '01234567890', 3, 3);  -- Ortopedia

-- 10 pacientes
INSERT INTO paciente (cod_pac, nome, telefone, CPF, data_nascimento, sexo, endereco, email) VALUES
    (1,  'Maria Oliveira',  '11944445551', '45678901231', '1985-03-12', 'F', 'Rua das Flores, 100', 'maria@email.com'),
    (2,  'João Santos',     '11944445552', '56789012342', '1990-07-25', 'M', 'Av. Paulista, 2000',  'joao@email.com'),
    (3,  'Fernanda Lima',   '11944445553', '67890123453', '2001-11-02', 'F', 'Rua A, 50',           'fernanda@email.com'),
    (4,  'Pedro Almeida',   '11944445554', '78901234564', '1978-01-30', 'M', 'Rua B, 333',          'pedro@email.com'),
    (5,  'Ana Costa',       '11944445555', '89012345675', '2012-05-19', 'F', 'Rua C, 87',           'ana@email.com'),
    (6,  'Rodrigo Abreu',   '11944445556', '90123456786', '1988-09-14', 'M', 'Rua D, 150',          'rodrigo@email.com'),
    (7,  'Beatriz Rocha',   '11944445557', '01234567897', '1995-12-01', 'F', 'Rua E, 210',          'beatriz@email.com'),
    (8,  'Carlos Mendes',   '11944445558', '23456789018', '1969-04-22', 'M', 'Rua F, 45',           'carlos@email.com'),
    (9,  'Larissa Pires',   '11944445559', '34567890129', '2006-08-30', 'F', 'Rua G, 300',          'larissa@email.com'),
    (10, 'Fábio Ramos',     '11944445550', '45678901230', '1982-02-17', 'M', 'Rua H, 12',           'fabio@email.com');

-- Vínculo paciente <-> plano de saúde (alguns pacientes, para o LEFT JOIN)
INSERT INTO paciente_plano (cod_pac, cod_plano, numero_carteirinha) VALUES
    (1, 1, 'UNIMED1001'),
    (2, 2, 'AMIL2002'),
    (4, 1, 'UNIMED1004'),
    (7, 3, 'SULAMER3007'),
    (10, 2, 'AMIL2010');

-- Vínculo paciente <-> alergias
INSERT INTO paciente_alergia (cod_pac, cod_alergia) VALUES
    (2, 1),
    (3, 2),
    (8, 4);

-- Algumas consultas já existentes
-- cod_es 1 = agendada | 2 = realizada | 3 = nao realizada
INSERT INTO consulta (cod_consulta, cod_pac, cod_med, caso, cod_corpo, data_consulta, cod_es) VALUES
    (1,  1,  3, 1, 3, '2026-09-10', 2),  -- realizada
    (2,  2,  1, 2, 2, '2026-09-15', 1),  -- agendada
    (3,  5,  2, 1, 1, '2026-09-12', 2),  -- realizada
    (4,  4,  7, 3, 4, '2026-09-18', 1),  -- agendada
    (5,  8,  5, 1, 1, '2026-09-20', 1);  -- agendada

-- Exames vinculados às consultas
INSERT INTO examinar (cod_consulta, cod_texame, data_exame, cod_es) VALUES
    (1, 1, '2026-09-10', 2),
    (2, 1, '2026-09-15', 1),
    (5, 3, '2026-09-20', 1);

-- Cirurgia + equipe (participação)
INSERT INTO cirurgia (cod_cirurgia, cod_consulta, cod_tcirurgia, data_cirurgia, cod_es) VALUES
    (1, 2, 1, '2026-09-20', 1),
    (2, 4, 2, '2026-09-22', 1);

INSERT INTO alocamedico (cod_medico, cod_cirurgia, cod_part) VALUES
    (7, 2, 1),
    (1, 1, 1),
    (2, 1, 2);

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

-- Fim do seed_exemplos.sql