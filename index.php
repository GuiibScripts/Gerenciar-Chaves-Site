<?php
// Define o fuso horário para o Brasil
date_default_timezone_set('America/Sao_Paulo');

// Define o caminho do arquivo onde as chaves serão armazenadas
$keys_file = 'keys.json';

// Verifica se o arquivo de chaves já existe
if (file_exists($keys_file)) {
    // Se o arquivo existir, lê as chaves existentes
    $keys_data = json_decode(file_get_contents($keys_file), true);
} else {
    // Se não existir, cria um array vazio para as chaves
    $keys_data = [];
}

// Verifica a senha enviada
$senha_correta = '572298'; // Defina a senha correta
$acesso_autorizado = isset($_POST['senha']) && $_POST['senha'] === $senha_correta;
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciamento de Chaves - GuiiB Scripts</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>            

<?php if (!$acesso_autorizado): ?>
    <!-- Formulário de senha -->
    <div class="container">
        <div class="logo">
            <h1>Gerenciamento de Chaves</h1>
            <img src="Logo_GuiiB.png" alt="Logo GuiiB" class="logo">
        </div>

        <form id="loginForm" method="POST">
            <input type="password" name="senha" class="input-field" placeholder="Digite a senha de acesso" required>
            <button type="submit" class="button">Entrar</button>
        </form>
    </div>
<?php else: ?>
    <!-- Conteúdo do gerenciamento de chaves -->
    <div class="container">
        <div class="logo">
            <h1>Gerenciamento de Chaves</h1>
            <img src="Logo_GuiiB.png" alt="Logo GuiiB" class="logo">
        </div>

        <div class="new-key">            
            <input type="text" id="newKey" class="input-field" placeholder="Digite a chave de 128 caracteres" maxlength="128">
            <input type="date" id="expiryDate" class="date-selector">
            <button class="button" onclick="addKey()">Adicionar Chave</button>
        </div>

        <table class="key-list">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Data Expiração</th>
                    <th>Status</th>
                    <th>Ação</th>
                </tr>
            </thead>
            <tbody id="keyTableBody">
                <?php
                // Exibe as chaves armazenadas com o status correto
                foreach ($keys_data as $key) {
                    $formatted_date = date('d/m/Y', strtotime($key['expiryDate']));
                    
                    // Verifica o status com a data atual de Brasília
                    $status = (strtotime($key['expiryDate']) >= strtotime('today')) ? 'Ativa' : 'Expirada';
                    $status_class = ($status === 'Ativa') ? 'active' : 'expired';

                    echo "<tr>
                            <td>{$key['key']}</td>
                            <td>{$formatted_date}</td>
                            <td class='{$status_class}'>{$status}</td>
                            <td><button onclick='editKey(\"{$key['key']}\", \"{$key['expiryDate']}\")'>Editar</button></td>
                          </tr>";
                }
                ?>
            </tbody>
        </table>
    </div>
<?php endif; ?>

<script src="script.js"></script>
</body>
</html>
