-------------- INCLUDE DLLS --------------------
package.path = package.path .. ";" .. 
Engine.getScriptsDirectory() .. "\\dlls_lib\\lua\\?.lua" .. ";" .. 
Engine.getScriptsDirectory() .. "\\dlls_lib\\lua\\socket\\?.lua"
package.cpath = package.cpath .. ";" .. 
Engine.getScriptsDirectory() .. "\\dlls_lib\\?.dll"

-- Importa o módulo socket.http
local http = require("socket.http")
local ltn12 = require("ltn12")

-- Função para converter uma string para hexadecimal
local function toHex(str)
    local hex = ""
    for i = 1, #str do
        hex = hex .. string.format("%02x", string.byte(str, i))
    end
    return hex
end

-- Função para carregar as chaves do arquivo JSON hospedado no seu servidor
local function carregarIDs()
    local url = "http://localhost/GuiiBScripts/keys.json"
    local response_body = {}

    local _, status_code = http.request{
        url = url,
        sink = ltn12.sink.table(response_body)
    }

    if status_code == 200 then
        local conteudo = table.concat(response_body)
        print("Conteúdo JSON recebido:\n" .. conteudo)

        local ids_autorizados = {}
        for linha in conteudo:gmatch('{.-}') do
            local idHex, dataExpiracao = linha:match('"key":%s*"([^"]+)",%s*"expiryDate":%s*"([^"]+)"')
            if idHex and dataExpiracao then
                table.insert(ids_autorizados, {id = idHex, data = dataExpiracao})
                print("Chave encontrada: " .. idHex .. " com expiração em: " .. dataExpiracao)
            end
        end

        return ids_autorizados
    else
        print("Erro ao carregar o JSON. Status HTTP:", status_code)
        return nil
    end
end

-- Função para verificar autorização do usuário
-- Função para verificar autorização do usuário
local function verificarAutorizacao()
    local userId = Engine.getUserId()
    local userIdHex = toHex(userId)
    print("User ID (hexadecimal):", userIdHex)
    local ids_autorizados = carregarIDs()

    if ids_autorizados then
        for _, registro in ipairs(ids_autorizados) do
            local idHex, dataExpiracao = registro.id, registro.data
            if idHex == userIdHex then
                print("Chave do usuário encontrada no JSON. Data de expiração:", dataExpiracao)
                
                -- Verifica se a data de expiração está no formato AAAA-MM-DD
                local ano, mes, dia = dataExpiracao:match("^(%d+)%-(%d+)%-(%d+)$")
                if ano and mes and dia then
                    local dataExpiracaoTimestamp = os.time({
                        year = tonumber(ano),
                        month = tonumber(mes),
                        day = tonumber(dia),
                        hour = 23,
                        min = 59,
                        sec = 59
                    })
                    local dataAtual = os.time()
                    
                    if dataExpiracaoTimestamp >= dataAtual then
                        -- A chave não expirou
                        local teste = HUD.new(650, 500, "FUNCIONOU", true)
                        teste:setColor(0, 255, 0)
                        teste:setFontSize(16)

                        Client.showMessage("Sua chave expira em: " .. dataExpiracao)
                        return true
                    else
                        -- A chave expirou
                        local teste = HUD.new(650, 500, "Chave Expirada", true)
                        teste:setColor(255, 0, 0)
                        teste:setFontSize(16)
                        return false
                    end
                else
                    print("Erro ao formatar data de expiração:", dataExpiracao)
                end
            end
        end
    end

    local teste = HUD.new(650, 500, "Usuario nao autorizado!", true)
    teste:setColor(255, 255, 255)
    teste:setFontSize(16)
    local teste2 = HUD.new(550, 530, "Solicite suporte via ticket no nosso Discord", true)
    teste2:setColor(255, 255, 255)
    teste2:setFontSize(16)
    

    return false
end

verificarAutorizacao()