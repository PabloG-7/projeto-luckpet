window.onload = function () {
    window.scrollTo(0, 0); // Força a página para o topo ao carregar
};

const cabecaSite = document.querySelector("#cabecasite");
window.addEventListener("scroll", () => {
    let scrollPosition = window.scrollY;
    cabecaSite.style.backgroundPositionY = `${scrollPosition * 0.5}px`; // Ajusta o fator de deslocamento
});




document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".carousel-item");
    let currentIndex = 0;
  
    function showNextImage() {
      // Remove a classe "active" da imagem atual
      items[currentIndex].classList.remove("active");
  
      // Atualiza o índice para a próxima imagem (ou volta para o início)
      currentIndex = (currentIndex + 1) % items.length;
  
      // Adiciona a classe "active" à nova imagem
      items[currentIndex].classList.add("active");
    }
  
    // Troca de imagem a cada 3 segundos
    setInterval(showNextImage, 3000);
  });


let produtos = {
    morango: { quantidade: 0, total: 0, tipo: "alimento" },
    uva: { quantidade: 0, total: 0, tipo: "alimento" },
    coco: { quantidade: 0, total: 0, tipo: "alimento" },
    limao: { quantidade: 0, total: 0, tipo: "alimento" },
    banana: { quantidade: 0, total: 0, tipo: "alimento" },
    cereja: { quantidade: 0, total: 0, tipo: "alimento" },
    mirtilo: { quantidade: 0, total: 0, tipo: "alimento" },
    laranja: { quantidade: 0, total: 0, tipo: "alimento" },

    Fantasia: { quantidade: 0, total: 0, tipo: "vestimenta" },
    Lenço: { quantidade: 0, total: 0, tipo: "vestimenta" },
    Charme: { quantidade: 0, total: 0, tipo: "vestimenta" }
};

function atualizarProduto(produto, preco, acao) {
    const notificacao = document.getElementById("notificacao"); // Corrigido o ID
    if (!produtos[produto]) {
        console.error("Produto não encontrado:", produto);
        return;
    }

    let produtoData = produtos[produto];

    if (acao === 'adicionar') {
        notificacao.textContent = `${produto.charAt(0).toUpperCase() + produto.slice(1)} adicionado ao carrinho`;
        produtoData.quantidade++;
        produtoData.total += parseFloat(preco);
    } else if (acao === 'remover' && produtoData.quantidade > 0) {
        notificacao.textContent = `${produto.charAt(0).toUpperCase() + produto.slice(1)} removido do carrinho`;
        produtoData.quantidade--;
        produtoData.total -= parseFloat(preco);
    }

       // Evita que o total fique negativo próximo de zero
       if (produtoData.total < 0.01 && produtoData.total > -0.01) {
        produtoData.total = 0;}


        
    // Exibe a notificação
    notificacao.classList.add("show");

    // Oculta a notificação após 3 segundos
    setTimeout(() => {
        notificacao.classList.remove("show");
    }, 3000);

    // Atualize a quantidade e o total na interface para o produto específico
    document.getElementById(produto + '-quantidade').textContent = "Unid: " + produtoData.quantidade;
    document.getElementById(produto + '-total-valor').textContent = "R$ " + produtoData.total.toFixed(2);
}

function abrirCarrinho() {
    let conteudoCarrinho = "<ul>";
    let subtotal = 0;

    for (let produto in produtos) {
        let produtoData = produtos[produto];
        if (produtoData.quantidade > 0) {
            // Define a cor baseada no tipo do produto
            let cor = produtoData.tipo === "alimento" ? "darkorange" : "darkblue";
            conteudoCarrinho += `<li style="color: ${cor};">${produto.charAt(0).toUpperCase() + produto.slice(1)}: 
            ${produtoData.quantidade} unidades - Total: R$ ${produtoData.total.toFixed(2)}</li>`;
            subtotal += produtoData.total;
        }
    }
    conteudoCarrinho += "</ul>";

    if (conteudoCarrinho === "<ul></ul>") {
        conteudoCarrinho = "<p>O carrinho está vazio.</p>";
    }

    document.getElementById("conteudo-carrinho").innerHTML = conteudoCarrinho;
    document.getElementById("subtotal").textContent = "Subtotal: R$ " + subtotal.toFixed(2);
    document.getElementById("modal-carrinho").style.display = "block";
};

function fecharCarrinho() {
    document.getElementById("modal-carrinho").style.display = "none";
}

window.onclick = function(event) {
    let modal = document.getElementById("modal-carrinho");
    if (event.target == modal) {
        modal.style.display = "none";
    }
};




// Atualizar avaliações exibidas

const API_URL = 'https://pablog-7.github.io/projeto-luckpet/';

function carregarAvaliacoes() {
    fetch('http://127.0.0.1:5000/avaliacoes')
        .then(response => response.json())
        .then(data => {
            const avaliacoesDiv = document.getElementById('avaliacoes');
            avaliacoesDiv.innerHTML = ''; // Limpar o conteúdo anterior
            data.forEach(avaliacao => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <strong>${avaliacao.nome_usuario}</strong> - Nota: ${avaliacao.avaliacao}<br>
                    <p>${avaliacao.comentario}</p>
                    <small>${new Date(avaliacao.data_avaliacao).toLocaleString()}</small>
                `;
                avaliacoesDiv.appendChild(div);
            });
        })
        .catch(error => console.error('Erro ao carregar avaliações:', error));
}

// Evento de envio do formulário
document.getElementById('form-avaliacao').addEventListener('submit', function (event) {
    event.preventDefault();

    const nomeUsuario = document.getElementById('nome_usuario').value;
    const avaliacao = document.getElementById('avaliacao').value;
    const comentario = document.getElementById('comentario').value;

    fetch('http://127.0.0.1:5000/avaliacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome_usuario: nomeUsuario,
            avaliacao: parseInt(avaliacao),
            comentario: comentario
        })
    })
    .then(response => response.text())
    .then(message => {
        alert('Avaliação enviada com sucesso!');
        document.getElementById('form-avaliacao').reset(); // Limpar o formulário
        carregarAvaliacoes(); // Atualizar a lista
    })
    .catch(error => {
        console.error('Erro ao enviar avaliação:', error);
        alert('Erro ao enviar a avaliação.');
    });
});

// Carregar avaliações ao iniciar
carregarAvaliacoes();



function carregarPagamento() {
    // Salva o estado atual do carrinho no localStorage
    localStorage.setItem('carrinho', JSON.stringify(produtos));

    // Exibe a tela de carregamento
    const body = document.querySelector('body');
    body.innerHTML = `
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
        ">
            <h2 style="color: #333;">Carregando pagamento...</h2>
        </div>
    `;

    setTimeout(() => {
        window.location.href = "pagamento.html";
    }, 2000);
}