// Array para armazenar as chaves cadastradas
let registeredKeys = [];

// Função para adicionar chave
function addKey() {
    const keyInput = document.getElementById('newKey');
    const dateInput = document.getElementById('expiryDate');
    
    // Verifica se a chave e a data de expiração foram preenchidas
    if (!keyInput.value || !dateInput.value) {
        alert("Por favor, preencha a chave e a data de expiração.");
        return;
    }

    const keyValue = keyInput.value;
    let expiryDateValue = dateInput.value;
    const currentDate = new Date();

    // Verifica se a chave tem exatamente 128 caracteres
    if (keyValue.length !== 128) {
        alert("A chave deve ter exatamente 128 caracteres.");
        return;
    }

    // Verifica se a chave já foi cadastrada
    if (registeredKeys.includes(keyValue)) {
        alert("Esta chave já está cadastrada.");
        return;
    }

    // Formata a data para o formato correto
    const dateParts = expiryDateValue.split('/');
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;  // Meses começam do zero no JavaScript
    const year = parseInt(dateParts[2], 10);

    const formattedDate = new Date(year, month, day);

    if (isNaN(formattedDate)) {
        alert("Data inválida.");
        return;
    }

    // Adiciona a chave ao array de chaves cadastradas
    registeredKeys.push(keyValue);

    // Verifica se a chave está expirada ou ativa
    let keyStatus = 'Ativo';
    if (formattedDate < currentDate.setHours(0, 0, 0, 0)) { // Verifica se a data é anterior ao dia de hoje (sem considerar o horário)
        keyStatus = 'Expirado';
    }

    const statusClass = keyStatus === 'Ativo' ? 'status-active' : 'status-expired';
    
    const tableBody = document.getElementById('keyTableBody');
    const newRow = document.createElement('tr');

    // Formata a data para pt-BR (dia/mês/ano)
    const formattedExpiryDate = formattedDate.toLocaleDateString('pt-BR');
    
    newRow.innerHTML = `
        <td>${keyValue}</td>
        <td>${formattedExpiryDate}</td>
        <td class="${statusClass}">${keyStatus}</td>
        <td><button onclick="selectDate('${keyValue}')">Selecionar Data</button></td>
    `;
    
    tableBody.appendChild(newRow);

    // Limpa os campos após adicionar a chave
    keyInput.value = '';
    dateInput.value = '';
}

// Função para formatar a data de expiração automaticamente com '/'
document.getElementById('expiryDate').addEventListener('input', function (event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico
    
    if (value.length > 2 && value.length <= 4) {
        value = value.replace(/(\d{2})(\d{2})/, '$1/$2');
    } else if (value.length > 4) {
        value = value.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    }

    input.value = value;
});

// Função para selecionar nova data de expiração
function selectDate(key) {
    const newDate = prompt("Digite a nova data de expiração (dd/mm/yyyy):");
    if (newDate) {
        const rows = document.querySelectorAll('#keyTableBody tr');
        rows.forEach(row => {
            const keyCell = row.querySelector('td');
            if (keyCell.textContent === key) {
                const dateParts = newDate.split('/');
                const formattedNewDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);

                if (isNaN(formattedNewDate)) {
                    alert("Data inválida.");
                    return;
                }

                const currentDate = new Date();
                let keyStatus = 'Ativo';
                if (formattedNewDate < currentDate.setHours(0, 0, 0, 0)) { // Verifica se a nova data é anterior ao dia de hoje (sem considerar o horário)
                    keyStatus = 'Expirado';
                }

                const statusClass = keyStatus === 'Ativo' ? 'status-active' : 'status-expired';
                
                // Atualiza a data e o status
                const formattedNewExpiryDate = formattedNewDate.toLocaleDateString('pt-BR');
                row.querySelectorAll('td')[1].textContent = formattedNewExpiryDate;
                row.querySelectorAll('td')[2].textContent = keyStatus;
                row.querySelectorAll('td')[2].className = statusClass;
            }
        });
    }
}
