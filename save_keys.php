<?php
// Define o caminho do arquivo onde as chaves serão armazenadas
$keys_file = 'keys.json';

// Define o fuso horário para São Paulo (Brasília)
date_default_timezone_set('America/Sao_Paulo');

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

    // Verifica se a chave já está registrada
    foreach ($keys_data as $key_data) {
        if ($key_data['key'] === $new_key) {
            echo "Erro: chave já cadastrada.";
            exit;
        }
    }

    // Verifica se a data de expiração é futura (considerando o fuso horário)
    $today = date('Y-m-d'); // data de hoje no formato yyyy-mm-dd
    $expiry_date = date('Y-m-d', strtotime($expiry_date)); // formata a data de expiração no formato yyyy-mm-dd

    if ($expiry_date <= $today) {
        echo "Erro: a data de expiração deve ser no futuro.";
        exit;
    }

    // Adiciona a nova chave ao array
    $keys_data[] = ['key' => $new_key, 'expiryDate' => $expiry_date];

    // Salva as chaves no arquivo JSON
    file_put_contents($keys_file, json_encode($keys_data, JSON_PRETTY_PRINT));

    echo "Chave adicionada com sucesso!";
} else {
    echo "Erro: chave ou data não fornecidos.";
}
?>
