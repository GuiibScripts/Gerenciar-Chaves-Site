function addKey() {
    var newKey = document.getElementById("newKey").value;
    var expiryDate = document.getElementById("expiryDate").value;

    if (newKey && expiryDate) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "save_keys.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                alert(xhr.responseText);
                location.reload();
            }
        };

        xhr.send("key=" + encodeURIComponent(newKey) + "&expiryDate=" + encodeURIComponent(expiryDate));
    } else {
        alert("Por favor, insira todos os campos.");
    }
}

function formatDateToDDMMYYYY(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
}

function formatDateToYYYYMMDD(dateStr) {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
}

function editKey(key, currentExpiryDate) {
    // Converte a data para o formato dd/mm/yyyy para exibir no prompt
    const formattedCurrentDate = formatDateToDDMMYYYY(currentExpiryDate);

    var newExpiryDate = prompt("Digite a nova data de expiração (dd/mm/yyyy):", formattedCurrentDate);
    
    // Verifica se a data é válida e no formato dd/mm/yyyy
    if (newExpiryDate && /^\d{2}\/\d{2}\/\d{4}$/.test(newExpiryDate)) {
        // Converte a data de volta para o formato yyyy-mm-dd antes de enviar
        const formattedDateForServer = formatDateToYYYYMMDD(newExpiryDate);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "save_keys.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                alert(xhr.responseText);
                // Atualiza a data na tabela no formato dd/mm/yyyy
                document.getElementById(`expiry-${key}`).textContent = newExpiryDate;
            }
        };

        xhr.send("key=" + encodeURIComponent(key) + "&expiryDate=" + encodeURIComponent(formattedDateForServer));
    } else {
        alert("Por favor, insira uma data válida no formato dd/mm/yyyy.");
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
