/**
 * 
 * Funções de formtação de dados para auxiliar na criação dos arquivos de remessa
 *  
 */
export function incremento_lote_servico(lote_servico_atual){
    let novo_lote_servico = String(parseInt(lote_servico_atual)+1);
    return novo_lote_servico.padStart(4,'0');
}
export function remove_ponto_e_traco(dado){
    let dado_1 =  dado.replace('-','');
    let dado_2 = dado_1.replace('.','');
    return dado_2;
}
export function formata_nome(nome){
    let nome_formatado = nome.trimEnd().normalize('NFD').replace(/[\u0300-\u036f]/g,"")
        .replace('Ç','C')
        .replace('ç','c')
        .replace('ñ','n')
        .replace('Ñ','N')
        .toUpperCase();
    if(nome.length>=30){
        nome_formatado = nome_formatado.substring(0,30);
    }else{
        nome_formatado = nome_formatado.padEnd(30,' ');
    }
    return nome_formatado;
}
export function formata_numero_sequencial_lote(numero_sequencial_lote){
    let numero_sequencial_lote_formatado = String(numero_sequencial_lote).padStart(5,'0');
    return numero_sequencial_lote_formatado;
}
export function formata_numero_convernio(formata_numero_convenio){
    let numero_convenio_formatado = remove_ponto_e_traco(formata_numero_convenio).padStart(9,'0');
   return numero_convenio_formatado;
}
export function formata_cnpj(cnpj){
    let cnpj_formatado = remove_ponto_e_traco(cnpj).trimEnd().padStart(14,'0');
   return cnpj_formatado;
}
export function formata_cpf(cpf){
   let cpf_formatado = remove_ponto_e_traco(cpf).trimEnd().padStart(11,'0');
   return cpf_formatado;
}
export function formata_codigo_banco(codigo_banco){
   let codigo_banco_formatado = remove_ponto_e_traco(codigo_banco).trimEnd().padStart(3,'0');
   return codigo_banco_formatado;
}
export function formata_agencia(agencia){
   let agencia_formatada = remove_ponto_e_traco(agencia).trimEnd().padStart(5,'0');
   return agencia_formatada;
}
export function formata_digito_agencia_ou_digito_conta(digito){
    let digito_formatado = digito.trimEnd();
    if(digito=='x'){
        digito_formatado = digito.toUpperCase();
    }
    //Remover quebra linha do dígito da conta
    digito_formatado = digito_formatado.replace(/(\r\n|\n|\r)/gm,"");
   return digito_formatado;
}
export function formata_conta(conta){
    let conta_formatada = remove_ponto_e_traco(conta).trimEnd().padStart(12,'0');
    return conta_formatada;
}
export function formata_valor_pago(valor_pago){
    let valor = Number.parseFloat(valor_pago).toFixed(2).trimEnd();
    let valor_pago_formatado;
    let novo_valor_pago;
    if(Number.isInteger(valor)){
        valor_pago_formatado = String(valor).padStart(13,'0')+'00';
    }else{
        const numeros_valor_pago = String(valor).split('.');
        novo_valor_pago = `${numeros_valor_pago[0]}${numeros_valor_pago[1]}`;
        valor_pago_formatado = novo_valor_pago.padStart(15,'0');
    }
    return valor_pago_formatado;
}
export function formata_valor_pago_trailer_lote(valor_pago){
   let valor = Number.parseFloat(valor_pago);
   let valor_pago_formatado;
   let novo_valor_pago;
    if(Number.isInteger(valor)){
        valor_pago_formatado = String(valor).padStart(16,'0')+'00';
    }else{
        const numeros_valor_pago = String(valor).split('.');
        novo_valor_pago = `${numeros_valor_pago[0]}${numeros_valor_pago[1]}`;
        valor_pago_formatado = novo_valor_pago.padStart(18,'0');
    }
   return valor_pago_formatado;
}
export function formata_data_pagamento(data_pagamento){
    const data_pagamento_formatada = data_pagamento.split('-').reverse().join('');
    return data_pagamento_formatada;
}
export function formata_quantidade_registros(quantidade_de_registros){
    let quantidade_registros_formatado = String(quantidade_de_registros).padStart(6,'0');
    return quantidade_registros_formatado;
}
export function formata_quantidade_lotes_trailer_arquivo(quantidade_lotes){
    let quantidade_lotes_formatado = quantidade_lotes.padStart(6,'0');
    return quantidade_lotes_formatado;
}

export function gera_data_atual(formato){
    let data = new Date(),
    dia  = data.getDate().toString().padStart(2, '0'),
    mes  = (data.getMonth()+1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
    ano  = data.getFullYear();
    const data_atual =  `${dia}${formato}${mes}${formato}${ano}`;
    return data_atual;
}    
export function arredondar(valor, casas = 2) {
    const fator = Math.pow(10, casas);
    return Math.round(valor * fator) / fator;
  }
