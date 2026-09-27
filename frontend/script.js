const API = 'http://localhost:3000/api';

// ---------- Navegação entre abas ----------
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

function mostrarMensagem(texto, tipo) {
  const el = document.getElementById('mensagem');
  el.textContent = texto;
  el.className = 'mensagem ' + tipo;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 3500);
}

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.erro || 'Erro na requisição');
  return data;
}

// ---------- PACIENTES ----------
async function carregarPacientes() {
  const pacientes = await api('/pacientes');
  const tbody = document.getElementById('tabela-pacientes');
  tbody.innerHTML = pacientes.map(p => `
    <tr>
      <td>${p.cod_pac}</td><td>${p.nome}</td><td>${p.telefone || ''}</td>
      <td>${p.CPF || ''}</td><td>${p.data_nascimento ? p.data_nascimento.substring(0,10) : ''}</td>
      <td>${p.sexo || ''}</td><td>${p.endereco || ''}</td><td>${p.email || ''}</td>
      <td><button class="btn-editar" onclick='editarPaciente(${JSON.stringify(p)})'>Editar</button></td>
    </tr>`).join('');
  return pacientes;
}

function editarPaciente(p) {
  const f = document.getElementById('form-paciente');
  f.modo.value = 'update';
  f.cod_pac.value = p.cod_pac;
  f.cod_pac.readOnly = true;
  f.nome.value = p.nome || '';
  f.telefone.value = p.telefone || '';
  f.CPF.value = p.CPF || '';
  f.data_nascimento.value = p.data_nascimento ? p.data_nascimento.substring(0,10) : '';
  f.sexo.value = p.sexo || '';
  f.endereco.value = p.endereco || '';
  f.email.value = p.email || '';
}

function cancelarEdicao(tipo) {
  const mapa = { paciente: 'form-paciente', medico: 'form-medico', consulta: 'form-consulta',
    plano: 'form-plano', especialidade: 'form-especialidade', formacao: 'form-formacao' };
  const f = document.getElementById(mapa[tipo]);
  f.reset();
  f.modo.value = 'insert';
  const campoId = f.querySelector('input[type=number]');
  if (campoId) campoId.readOnly = false;
}

document.getElementById('form-paciente').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target;
  const dados = Object.fromEntries(new FormData(f).entries());
  const modo = dados.modo; delete dados.modo;
  try {
    if (modo === 'insert') {
      await api('/pacientes', { method: 'POST', body: JSON.stringify(dados) });
      mostrarMensagem('Paciente cadastrado (INSERT) com sucesso!', 'sucesso');
    } else {
      const cod_pac = dados.cod_pac; delete dados.cod_pac;
      await api(`/pacientes/${cod_pac}`, { method: 'PUT', body: JSON.stringify(dados) });
      mostrarMensagem('Paciente atualizado (UPDATE) com sucesso!', 'sucesso');
    }
    cancelarEdicao('paciente');
    carregarPacientes();
  } catch (err) { mostrarMensagem(err.message, 'erro'); }
});

// ---------- MEDICOS ----------
async function carregarMedicos() {
  const medicos = await api('/medicos');
  const tbody = document.getElementById('tabela-medicos');
  tbody.innerHTML = medicos.map(m => `
    <tr>
      <td>${m.matr}</td><td>${m.nome}</td><td>${m.telefone || ''}</td><td>${m.CPF || ''}</td>
      <td>${m.grau_formacao || ''}</td><td>${m.especializacao || ''}</td>
      <td><button class="btn-editar" onclick='editarMedico(${JSON.stringify(m)})'>Editar</button></td>
    </tr>`).join('');
  return medicos;
}

function editarMedico(m) {
  const f = document.getElementById('form-medico');
  f.modo.value = 'update';
  f.matr.value = m.matr;
  f.matr.readOnly = true;
  f.nome.value = m.nome || '';
  f.telefone.value = m.telefone || '';
  f.CPF.value = m.CPF || '';
  f.cod_form.value = m.cod_form || '';
  f.cod_esp.value = m.cod_esp || '';
}

document.getElementById('form-medico').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target;
  const dados = Object.fromEntries(new FormData(f).entries());
  const modo = dados.modo; delete dados.modo;
  try {
    if (modo === 'insert') {
      await api('/medicos', { method: 'POST', body: JSON.stringify(dados) });
      mostrarMensagem('Médico cadastrado (INSERT) com sucesso!', 'sucesso');
    } else {
      const matr = dados.matr; delete dados.matr;
      await api(`/medicos/${matr}`, { method: 'PUT', body: JSON.stringify(dados) });
      mostrarMensagem('Médico atualizado (UPDATE) com sucesso!', 'sucesso');
    }
    cancelarEdicao('medico');
    carregarMedicos();
  } catch (err) { mostrarMensagem(err.message, 'erro'); }
});

// ---------- CONSULTAS ----------
async function carregarConsultas() {
  const consultas = await api('/consultas');
  const tbody = document.getElementById('tabela-consultas');
  tbody.innerHTML = consultas.map(c => `
    <tr>
      <td>${c.cod_consulta}</td><td>${c.nome_paciente || c.cod_pac}</td>
      <td>${c.nome_medico || c.cod_med}</td>
      <td>${c.data_consulta ? c.data_consulta.substring(0,10) : ''}</td>
      <td>${c.estado || ''}</td>
      <td><button class="btn-editar" onclick='editarConsulta(${JSON.stringify(c)})'>Editar</button></td>
    </tr>`).join('');
  return consultas;
}

function editarConsulta(c) {
  const f = document.getElementById('form-consulta');
  f.modo.value = 'update';
  f.cod_consulta.value = c.cod_consulta;
  f.cod_consulta.readOnly = true;
  f.cod_pac.value = c.cod_pac;
  f.cod_med.value = c.cod_med;
  f.data_consulta.value = c.data_consulta ? c.data_consulta.substring(0,10) : '';
  f.cod_es.value = c.cod_es || '';
}

document.getElementById('form-consulta').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target;
  const dados = Object.fromEntries(new FormData(f).entries());
  const modo = dados.modo; delete dados.modo;
  try {
    if (modo === 'insert') {
      await api('/consultas', { method: 'POST', body: JSON.stringify(dados) });
      mostrarMensagem('Consulta agendada (INSERT) com sucesso!', 'sucesso');
    } else {
      const cod_consulta = dados.cod_consulta; delete dados.cod_consulta;
      await api(`/consultas/${cod_consulta}`, { method: 'PUT', body: JSON.stringify(dados) });
      mostrarMensagem('Consulta atualizada (UPDATE) com sucesso!', 'sucesso');
    }
    cancelarEdicao('consulta');
    carregarConsultas();
  } catch (err) { mostrarMensagem(err.message, 'erro'); }
});

// ---------- PLANOS DE SAÚDE ----------
async function carregarPlanos() {
  const planos = await api('/planos');
  document.getElementById('tabela-planos').innerHTML = planos.map(p => `
    <tr>
      <td>${p.cod_plano}</td><td>${p.nome_plano}</td><td>${p.abrangencia || ''}</td>
      <td><button class="btn-editar" onclick='editarPlano(${JSON.stringify(p)})'>Editar</button></td>
    </tr>`).join('');
  return planos;
}

function editarPlano(p) {
  const f = document.getElementById('form-plano');
  f.modo.value = 'update';
  f.cod_plano.value = p.cod_plano;
  f.cod_plano.readOnly = true;
  f.nome_plano.value = p.nome_plano || '';
  f.abrangencia.value = p.abrangencia || '';
}

document.getElementById('form-plano').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target;
  const dados = Object.fromEntries(new FormData(f).entries());
  const modo = dados.modo; delete dados.modo;
  try {
    if (modo === 'insert') {
      await api('/planos', { method: 'POST', body: JSON.stringify(dados) });
      mostrarMensagem('Plano cadastrado (INSERT) com sucesso!', 'sucesso');
    } else {
      const cod_plano = dados.cod_plano; delete dados.cod_plano;
      await api(`/planos/${cod_plano}`, { method: 'PUT', body: JSON.stringify(dados) });
      mostrarMensagem('Plano atualizado (UPDATE) com sucesso!', 'sucesso');
    }
    cancelarEdicao('plano');
    carregarPlanos();
  } catch (err) { mostrarMensagem(err.message, 'erro'); }
});

// ---------- ESPECIALIDADES ----------
async function carregarEspecialidades() {
  const especialidades = await api('/especialidades');
  document.getElementById('tabela-especialidades').innerHTML = especialidades.map(e => `
    <tr>
      <td>${e.cod_esp}</td><td>${e.especializacao}</td>
      <td><button class="btn-editar" onclick='editarEspecialidade(${JSON.stringify(e)})'>Editar</button></td>
    </tr>`).join('');
  return especialidades;
}

function editarEspecialidade(e) {
  const f = document.getElementById('form-especialidade');
  f.modo.value = 'update';
  f.cod_esp.value = e.cod_esp;
  f.cod_esp.readOnly = true;
  f.especializacao.value = e.especializacao || '';
}

document.getElementById('form-especialidade').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target;
  const dados = Object.fromEntries(new FormData(f).entries());
  const modo = dados.modo; delete dados.modo;
  try {
    if (modo === 'insert') {
      await api('/especialidades', { method: 'POST', body: JSON.stringify(dados) });
      mostrarMensagem('Especialidade cadastrada (INSERT) com sucesso!', 'sucesso');
    } else {
      const cod_esp = dados.cod_esp; delete dados.cod_esp;
      await api(`/especialidades/${cod_esp}`, { method: 'PUT', body: JSON.stringify(dados) });
      mostrarMensagem('Especialidade atualizada (UPDATE) com sucesso!', 'sucesso');
    }
    cancelarEdicao('especialidade');
    carregarEspecialidades();
    preencherSelects();
  } catch (err) { mostrarMensagem(err.message, 'erro'); }
});

// ---------- FORMAÇÕES ----------
async function carregarFormacoes() {
  const formacoes = await api('/formacoes');
  document.getElementById('tabela-formacoes').innerHTML = formacoes.map(f => `
    <tr>
      <td>${f.cod_form}</td><td>${f.grau_formacao}</td>
      <td><button class="btn-editar" onclick='editarFormacao(${JSON.stringify(f)})'>Editar</button></td>
    </tr>`).join('');
  return formacoes;
}

function editarFormacao(f) {
  const form = document.getElementById('form-formacao');
  form.modo.value = 'update';
  form.cod_form.value = f.cod_form;
  form.cod_form.readOnly = true;
  form.grau_formacao.value = f.grau_formacao || '';
}

document.getElementById('form-formacao').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target;
  const dados = Object.fromEntries(new FormData(f).entries());
  const modo = dados.modo; delete dados.modo;
  try {
    if (modo === 'insert') {
      await api('/formacoes', { method: 'POST', body: JSON.stringify(dados) });
      mostrarMensagem('Formação cadastrada (INSERT) com sucesso!', 'sucesso');
    } else {
      const cod_form = dados.cod_form; delete dados.cod_form;
      await api(`/formacoes/${cod_form}`, { method: 'PUT', body: JSON.stringify(dados) });
      mostrarMensagem('Formação atualizada (UPDATE) com sucesso!', 'sucesso');
    }
    cancelarEdicao('formacao');
    carregarFormacoes();
    preencherSelects();
  } catch (err) { mostrarMensagem(err.message, 'erro'); }
});

// ---------- Preenche selects (dropdowns) usados nos formulários ----------
async function preencherSelects() {
  const [formacoes, especialidades, pacientes, medicos, estados] = await Promise.all([
    api('/formacoes'), api('/especialidades'), api('/pacientes'), api('/medicos'), api('/estados')
  ]);

  const selForm = document.getElementById('select-formacao');
  selForm.innerHTML = '<option value="">Formação</option>' +
    formacoes.map(f => `<option value="${f.cod_form}">${f.grau_formacao}</option>`).join('');

  const selEsp = document.getElementById('select-especialidade');
  selEsp.innerHTML = '<option value="">Especialidade</option>' +
    especialidades.map(e => `<option value="${e.cod_esp}">${e.especializacao}</option>`).join('');

  const selPac = document.getElementById('select-paciente');
  selPac.innerHTML = '<option value="">Paciente</option>' +
    pacientes.map(p => `<option value="${p.cod_pac}">${p.nome}</option>`).join('');

  const selMed = document.getElementById('select-medico');
  selMed.innerHTML = '<option value="">Médico</option>' +
    medicos.map(m => `<option value="${m.matr}">${m.nome}</option>`).join('');

  const selEst = document.getElementById('select-estado');
  selEst.innerHTML = '<option value="">Estado</option>' +
    estados.map(e => `<option value="${e.cod_es}">${e.descr}</option>`).join('');
}

// ---------- Carga inicial ----------
async function iniciar() {
  try {
    await preencherSelects();
    await Promise.all([
      carregarPacientes(), carregarMedicos(), carregarConsultas(),
      carregarPlanos(), carregarEspecialidades(), carregarFormacoes()
    ]);
  } catch (err) {
    mostrarMensagem('Não foi possível conectar à API em ' + API + '. Verifique se o backend está rodando.', 'erro');
  }
}

iniciar();
