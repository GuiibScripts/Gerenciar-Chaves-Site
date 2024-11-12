<?php
// Define o fuso horário para horário de Brasília
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

// Verifica se os dados da chave foram passados via POST
if (isset($_POST['key']) && isset($_POST['expiryDate'])) {
    $new_key = $_POST['key'];
    $expiry_date = $_POST['expiryDate'];

    $key_exists = false;
    
    // Percorre as chaves existentes para verificar duplicidade
    foreach ($keys_data as &$key_data) {
        if ($key_data['key'] === $new_key) {
            // Se a chave já existe, apenas atualiza a data de expiração
            $key_data['expiryDate'] = $expiry_date;
            $key_exists = true;
            break;
        }
    }

    if ($key_exists) {
        // Salva as chaves atualizadas no arquivo JSON
        file_put_contents($keys_file, json_encode($keys_data, JSON_PRETTY_PRINT));
        echo "Data alterada com sucesso!";
    } else {
        // Caso seja uma nova chave, adiciona ao array
        $keys_data[] = ['key' => $new_key, 'expiryDate' => $expiry_date];
        file_put_contents($keys_file, json_encode($keys_data, JSON_PRETTY_PRINT));
        echo "Chave adicionada com sucesso!";
    }
} else {
    echo "Erro: chave ou data não fornecidos.";
}
?>
