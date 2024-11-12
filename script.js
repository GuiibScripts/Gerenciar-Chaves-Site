// Função para adicionar uma nova chave
function addKey() {
    var newKey = document.getElementById("newKey").value;
    var expiryDate = document.getElementById("expiryDate").value;

    // Verifica se a chave e a data foram preenchidas
    if (newKey && expiryDate) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "save_keys.php", true);  // O arquivo PHP que processa o salvamento
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        // Função de callback quando a requisição for completada
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = xhr.responseText;
                
                if (response.includes("Erro: chave já cadastrada")) {
                    alert(response);  // Exibe o alerta com o erro
                    highlightDuplicateKey(newKey);  // Chama a função para destacar a chave duplicada
                } else {
                    alert(response);  // Exibe a resposta de sucesso
                    location.reload();  // Recarrega a página para mostrar a chave salva
                }
            }
        };

        // Envia a chave e a data para o PHP
        xhr.send("key=" + encodeURIComponent(newKey) + "&expiryDate=" + encodeURIComponent(expiryDate));
    } else {
        alert("Por favor, insira todos os campos.");
    }
}

// Função para mover a página até a chave duplicada
function highlightDuplicateKey(key) {
    // Procura o elemento que contém a chave duplicada
    var keyElements = document.querySelectorAll('.key-item');
    keyElements.forEach(function(element) {
        if (element.textContent.includes(key)) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Move a página até o elemento
            element.style.backgroundColor = 'yellow'; // Destaca o elemento com a chave duplicada
        }
    });
}
