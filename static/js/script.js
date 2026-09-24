/*
 * script.js — Funcionalidades JavaScript do Sistema Hospital
 *
 * 1) Menu responsivo (abrir/fechar no celular)
 * 2) Seleção automática de paciente na página de Atualizar (UPDATE)
 * 3) Validação rápida dos formulários antes do envio (frontend)
 * 4) Confirmação antes de salvar alterações (UPDATE)
 */

// Espera o conteúdo da página carregar antes de executar
document.addEventListener('DOMContentLoaded', function () {

    // ----------------------------------------------------------------------
    // 1) Menu de navegação responsivo (botão ☰ no topo)
    // ----------------------------------------------------------------------
    const botaoMenu = document.getElementById('menuBotao');
    const navegacao = document.getElementById('navegacao');

    if (botaoMenu && navegacao) {
        // Troca a classe "aberto" para mostrar/ocultar o menu no celular
        botaoMenu.addEventListener('click', function () {
            navegacao.classList.toggle('aberto');
        });
    }

    // ----------------------------------------------------------------------
    // 2) Página "Atualizar Paciente": auto-carregar o formulário ao trocar
    //    o paciente no menu suspenso (sem precisar clicar em "Carregar")
    // ----------------------------------------------------------------------
    const seletor = document.getElementById('cod_pac_select');
    if (seletor) {
        seletor.addEventListener('change', function () {
            // Se escolheu um paciente, vai para /atualizar?cod=CODIGO
            if (this.value) {
                window.location.href = '/atualizar?cod=' + this.value;
            }
        });
    }

    // ----------------------------------------------------------------------
    // 3) Validação dos formulários de cadastro e atualização
    // ----------------------------------------------------------------------
    const formCadastro = document.getElementById('formCadastro');

    // Normaliza o CPF: remove caracteres que não sejam números
    function limparCpf(campo) {
        if (campo) campo.value = campo.value.replace(/\D/g, '');
    }

    // Remove pontos/traço do CPF enquanto a pessoa digita
    const campoCpf = document.getElementById('cpf');
    if (campoCpf) {
        campoCpf.addEventListener('input', function () {
            limparCpf(this);
        });
    }

    if (formCadastro) {
        formCadastro.addEventListener('submit', function (evento) {
            // O campo "nome" já tem o atributo required; validação extra não necessária aqui.
            // O HTML5 já bloqueia envio sem nome; se chegou aqui, pode prosseguir.
            return true;
        });
    }

    // ----------------------------------------------------------------------
    // 4) Confirmação antes de salvar alterações na página de UPDATE
    // ----------------------------------------------------------------------
    const formAtualizar = document.getElementById('formAtualizar');
    if (formAtualizar) {
        formAtualizar.addEventListener('submit', function (evento) {
            // Pede confirmação em uma caixa de diálogo do navegador
            if (!window.confirm('Deseja realmente salvar as alterações?')) {
                evento.preventDefault(); // cancela o envio se o usuário negar
            }
        });
    }

    // ----------------------------------------------------------------------
    // 5) Botão "Limpar" da busca de pacientes volta a listar todos
    // ----------------------------------------------------------------------
    const botaoLimpar = document.getElementById('botaoLimpar');
    if (botaoLimpar) {
        botaoLimpar.addEventListener('click', function () {
            const campoNome = document.getElementById('nome');
            if (campoNome) campoNome.value = '';
        });
    }
});