/**
 * 
 * Funções para criação das partes do arquivo de remessa
 *  
 */
import {incremento_lote_servico,remove_ponto_e_traco,formata_nome,formata_numero_sequencial_lote,
    formata_numero_convernio,formata_cnpj,formata_cpf,formata_codigo_banco,formata_agencia,
    formata_digito_agencia_ou_digito_conta,formata_conta,formata_valor_pago,formata_valor_pago_trailer_lote,
    formata_data_pagamento,formata_quantidade_registros,formata_quantidade_lotes_trailer_arquivo,gera_data_atual
} from './funcoes_auxiliares.js'

import fs from 'fs';

export function criar_header_arquivo(camposFormulario){

    const header_arquivo = {
        codigo_compensacao_banco: '001',
        lote_servico:'0000',
        tipo_servico_1:'0',
        uso_exclusivo_FENABRAN_CNAB_1: '         ',
        // Tipo inscrição da empresa: 1-> CPF e 2->CNPJ
        tipo_inscricao_empresa:'2',
        numero_inscricao_empresa: formata_cnpj(camposFormulario.cnpj),
        // A junção dos próximos três numeros são o código de convênio
        numero_convenio:formata_numero_convernio(camposFormulario.numeroConvenio),
        codigo:'0126', //Código padrão informado no manual
        uso_reservado_banco_1: '     ',
        arquivo_teste: '  ', //Em caso de teste colocar 'TS'
        agencia_manetedora_conta:formata_agencia(camposFormulario.agencia),
        digito_verificador_agencia:formata_digito_agencia_ou_digito_conta(camposFormulario.digitoAgencia),
        numero_conta_corrente:formata_conta(camposFormulario.conta),
        digito_verificador_conta:formata_digito_agencia_ou_digito_conta(camposFormulario.digitoConta),
        digito_verificador_agencia_conta:'0',//Valor padrão informado pelo manual.
        nome_empresa:camposFormulario.nomeEmpresa.substring(0,30),
        nome_banco: 'BANCO DO BRASIL S/A'.padEnd(30,' '),
        uso_exclusivo_FENABRAN_CNAB_2:'          ',
        // Código de remessa ou retorno. 1->remessa ou 2->retorno
        codigo_remessa_retorno:'1',
        data_geracao_arquivo:gera_data_atual(''),
        hora_geracao_arquivo:'000000',
        numero_sequencial_arquivo:'001779', //Padrão das remessas enviadas pela FUNEC
        numero_versao_layout_arquivo:'000',
        densidade_gravacao_arquivo:'00000',
        uso_reservado_banco_2:'                   ',
        uso_resevado_empresa:'                    ',
        uso_exclusivo_FENABRAN_CNAB_3:'           ',
        identificacao_cobranca_sem_papel:'   ',
        uso_exclusivo_VANS:'   ',
        tipo_servico_2:'  ',
        codigo_ocorrencias:'           '
    }    
    let header_arquivo_formatado = '';
    for (const key in header_arquivo) {
        if (Object.hasOwnProperty.call(header_arquivo, key)) {
            header_arquivo_formatado = header_arquivo_formatado+header_arquivo[key];
        }    
    }    
    header_arquivo_formatado = header_arquivo_formatado+'\r\n'
    return [
        header_arquivo_formatado,
        header_arquivo.lote_servico
    ];    
} 

export function criar_header_lote_AB(camposFormulario,lote_servico,forma_lancamento){
        
    const header_lote_AB = {
        codigo_compensacao_banco: '001',
        lote_servico:lote_servico,
        tipo_registro:'1',
        tipo_operacao:'C',
        tipo_servico_1:'98',
        forma_lancamento:forma_lancamento, //(DOC/TED)
        numero_versao_layout_lote:'031',
        uso_exclusivo_FENABRAN_CNAB_1:' ',
        // Tipo inscrição da empresa: 1-> CPF e 2->CNPJ
        tipo_inscricao_empresa:'2',
        numero_inscricao_empresa: formata_cnpj(camposFormulario.cnpj),
        // A junção dos próximos três numeros são o código de convênio
        numero_convenio:formata_numero_convernio(camposFormulario.numeroConvenio),
        codigo:'0126', //Código padrão informado no manual
        uso_reservado_banco_1: '     ',
        arquivo_teste: '  ', //Em caso de teste colocar 'TS'
        agencia_manetedora_conta:formata_agencia(camposFormulario.agencia),
        digito_verificador_agencia:formata_digito_agencia_ou_digito_conta(camposFormulario.digitoAgencia),
        numero_conta_corrente:formata_conta(camposFormulario.conta),
        digito_verificador_conta:formata_digito_agencia_ou_digito_conta(camposFormulario.digitoConta),
        digito_verificador_agencia_conta:'0',//Valor padrão informado pelo manual.
        nome_empresa:formata_nome(camposFormulario.nomeEmpresa),
        mensagem_BB:'                                        ',//Uso exclusivo do BB
        endereco_empresa:'                                                                                ',//Opcional
        uso_exclusivo_FENABRAN_CNAB_2:'        ',
        ocorrencias:'          '
    };    
    let header_lote_AB_formatado = '';
    for (const key in header_lote_AB) {
        if (Object.hasOwnProperty.call(header_lote_AB, key)) {
            header_lote_AB_formatado = header_lote_AB_formatado+header_lote_AB[key];
        }    
    }    
    header_lote_AB_formatado = header_lote_AB_formatado+'\r\n'
    return [
        header_lote_AB_formatado,
        header_lote_AB.lote_servico
    ];    
}    

export function criar_segmentos_AB(dados_colaborades,lote_servico_atual,campos_formulario){

    let segmento_A = [];
    let segmento_B = [];
    let index = 0;
    let contador_registro_AB = 0;
    let valores_registro_AB = 0;
    for (const key in dados_colaborades) {
        if (Object.hasOwnProperty.call(dados_colaborades, key)) {
            let codigo_camera_centralizadora;
            if(dados_colaborades[key].codigo_banco_formatado==='001'){
                codigo_camera_centralizadora='000';
            }else{
                codigo_camera_centralizadora='018'; //Para outros bancos
            }    
            
            let outras_informacoes;
            // Se iniciar com 11 será para pagamento para conta poupança do banco do brasil
            if(dados_colaborades[key].codigo_banco==='001' && dados_colaborades[key].tipo_conta=='CP'){
                outras_informacoes='11                                      ';
            }else{
                outras_informacoes='                                        ';
            }    
            contador_registro_AB++;
            segmento_A[index] = {
                codigo_compensacao_banco: '001',
                lote_servico:lote_servico_atual,
                tipo_registro:3,
                numero_sequencial_lote:formata_numero_sequencial_lote(contador_registro_AB),
                codigo_segmento:'A',
                tipo_movimento:'0',
                codigo_instrucao_para_movimento:'00',
                codigo_camera_centralizadora:codigo_camera_centralizadora,
                codigo_banco_favorecido:dados_colaborades[key].codigo_banco_formatado,
                agencia_manetedora_favorecido:dados_colaborades[key].agencia_formatada,
                digito_agencia_favorecido:dados_colaborades[key].digito_agencia_formatado,
                numero_conta_favorecido:dados_colaborades[key].conta_formatada,
                digito_conta_favorecido:dados_colaborades[key].digito_conta_formatado,
                digito_verificador_agencia_conta_favorecido:dados_colaborades[key].digito_verificador_agencia_conta_formatado,
                nome_favorecido:dados_colaborades[key].nome_formatado,
                numero_documento_atribuido_empresa:'                    ',
                data_pagamento:formata_data_pagamento(campos_formulario.dataPagamento),
                tipo_moeda:'BRL',
                quantidade_moeda:'000000000000000',
                valor_pagamento:dados_colaborades[key].valor_pago_formatado,
                numero_documento_atribuido_banco:'                    ',
                data_real_efetivacao_pagamento:'00000000',
                valor_real_efetivacao_pagamento:'000000000000000',
                outras_informacoes:outras_informacoes,
                complemento_tipo_servico:"  ",
                codigo_finalidade_TED:"     ",
                complemente_finalidade_pagamento:'  ',
                uso_exclusivo_FEBRABAN: '   ',
                aviso_fornecedor:'0',
                ocorrencias:'          '
            };    
            contador_registro_AB++;
            segmento_B[index] = {
                codigo_compensacao_banco: '001',
                lote_servico:lote_servico_atual,
                tipo_registro:3,
                numero_sequencial_lote:formata_numero_sequencial_lote(contador_registro_AB),
                codigo_segmento:'B',
                uso_exclusivo_FEBRABAN:'   ',
                tipo_inscricao_favorecido:'1',//CPF
                numero_inscricao_favorecido:formata_cnpj(dados_colaborades[key].cpf_formatado),
                endereco_favorecido:'                                                                                               ',//Opcional
                data_vencimento_nominal:gera_data_atual(''),
                valor_documento_nominal:'000000000000000',
                valor_abatimento:'000000000000000',
                valor_desconto:'000000000000000',
                valor_mora:'000000000000000',
                valor_multa:'000000000000000',
                codigo_documento_favorecido:'               ',
                aviso_favorecido:'0',
                uso_exclusivo_SIAPE:'      ',
                codigo_ISPB:'00000000'
            };    
            valores_registro_AB = valores_registro_AB+dados_colaborades[key].valor_pago;
        }    
        index++;
    }    
  
    let segmento_AB_formatado='';
    for (const key in segmento_A) {
        let texto = '';
        for (const index in segmento_A[key]){
            //Segmento A
            texto = texto+segmento_A[key][index];
        }    
        texto = texto+'\r\n';
        for (const index in segmento_B[key]){
            //Segmento B
            texto = texto+segmento_B[key][index];
        }    
        texto = texto+'\r\n';
        segmento_AB_formatado = segmento_AB_formatado + texto;
    }    
   return [
        segmento_AB_formatado,
        contador_registro_AB,
        valores_registro_AB
    ];    
}    


export function criar_trailer_lote_AB(lote_servico,quantidade_registros_AB,somatorio_dos_valores_AB){
    const trailer_lote = {
        codigo_banco_compensacao:'001',
        lote_servico:lote_servico,
        tipo_registro:'5',
        uso_exclusivo_FENABRAN_CNAB_1:'         ',
        quantidade_registros_lote:formata_quantidade_registros(quantidade_registros_AB+2),// +2 devido ao Header AB e trailer do lote
        somatorio_dos_valores:formata_valor_pago_trailer_lote(somatorio_dos_valores_AB),
        somatoria_de_quantidade_moedas:'000000000000000000',
        numero_aviso_debito:'000000',
        uso_exclusivo_FENABRAN_CNAB_2:''.padStart(165,' '),
        ocorrencias:'          '
    };    
    let trailer_lote_formatado='';
    for (const key in trailer_lote) {
        trailer_lote_formatado = trailer_lote_formatado+trailer_lote[key];
    }    
    trailer_lote_formatado = trailer_lote_formatado+'\r\n';
    return [trailer_lote_formatado,somatorio_dos_valores_AB,quantidade_registros_AB];
}    

export function criar_trailer_arquivo(quantidade_lotes,quantiade_registros_AB){
    let quantidade_de_registros = parseInt(quantidade_lotes);
    let quantidade_registros_total_arquivo = (quantidade_lotes*2)+(quantiade_registros_AB)+2; //Número de lotes multiplicado por dois + trailer arquivo e trailer lote
    const trailer_arquivo = {
        codigo_banco_compensacao:'001',
        lote_servico:'9999',
        tipo_registro:'9',
        uso_exclusivo_FENABRAN_CNAB_1:'         ',
        quantidade_lotes_arquivo:formata_quantidade_lotes_trailer_arquivo(quantidade_lotes),
        quantidade_registros_arquivo:formata_quantidade_registros(quantidade_registros_total_arquivo),
        qtd_contas:'000000',
        uso_exclusivo_FENABRAN_CNAB_2:''.padStart(205,' '),
    };    
    let trailer_arquivo_formatado='';
    for (const key in trailer_arquivo) {
        trailer_arquivo_formatado = trailer_arquivo_formatado+trailer_arquivo[key];
    }    
    trailer_arquivo_formatado = trailer_arquivo_formatado+'\r\n';
    return trailer_arquivo_formatado;
}  
export function criar_dados_colaboradores_formatados (data_CSV) {
    //Objeto com dados de contas correntes exceto banco do brasil
    let dados_CC = [];

    //Objeto com dados das contas correntes SOMENTE do banco do brasil
    let dados_CC_BB = [];
     
    //Objeto com dados de contas poupanças exceto banco do brasil
    let dados_CP = [];

    //Objeto com dados das contas poupanças SOMENTE do banco do brasil
    let dados_CP_BB = [];


    let data_CSV_array = data_CSV.split('\n');

    //Remover primeiro elemento do array, pois é cabeçalho.
    data_CSV_array.shift();
    let dados_CSV = [];
    for (let index = 0; index < data_CSV_array.length; index++) {
        let linha = data_CSV_array[index].split(';');
        if(data_CSV_array[index]==''){
            break; 
        }
        dados_CSV[index] = {
            nome_formatado:formata_nome(linha[0]),
            cpf_formatado:formata_cpf(linha[1]),
            valor_pago_formatado:formata_valor_pago(linha[2]),
            valor_pago:parseFloat(linha[2]),
            codigo_banco_formatado:formata_codigo_banco(linha[3]),
            agencia_formatada:formata_agencia(linha[4]),
            digito_agencia_formatado:formata_digito_agencia_ou_digito_conta(linha[5]),
            tipo_conta:linha[6],
            conta_formatada: formata_conta(linha[7]),
            digito_conta_formatado:formata_digito_agencia_ou_digito_conta(linha[8]),
            digito_verificador_agencia_conta_formatado:' ',
        }    
         //Conta Corrente dos demais bancos exceto banco do brasil
         if(linha[6]=='CC' && linha[3]!=='001'){
            dados_CC.push(dados_CSV[index]); 
        }     
        //Conta Corrente do Banco do Brasil
        if(linha[6]=='CC' && linha[3]=='001'){
            dados_CC_BB.push(dados_CSV[index]);
        }    
            //Conta poupança dos demais bancos exceto do banco do brasil
        if(linha[6]==='CP' && linha[3]!=='001'){
            dados_CP.push(dados_CSV[index]);
        }    
        //Conta Poupança do Banco do Brasil
        if(linha[6]==='CP' && linha[3]==='001'){
            dados_CP_BB.push(dados_CSV[index]);
        }    

    }    
        if(dados_CC.length==0){
            dados_CC = false;
        }    
        if(dados_CC_BB.length==0){
            dados_CC_BB = false;
        }    
        if(dados_CP.length==0){
            dados_CP = false;
        }    
        if(dados_CP_BB.length==0){
            dados_CP_BB = false;
        }    
    return {
        dados_CC:dados_CC,
        dados_CC_BB:dados_CC_BB,
        dados_CP:dados_CP,
        dados_CP_BB:dados_CP_BB
    };    

}    

export function criar_remessa_CC(dados_CC,dados_CC_BB,camposFormulario,destino_TXT_CC){
    
    let texto_arquivo_CC;
    let somatorio_dos_valores_total;
    let quantidade_registros_total; 
    
    if(dados_CC && dados_CC_BB){
        // HEADER DO ARQUIVO - CC OUTROS BANCOS E BANCO DO BRASIL
        const [header_arquivo_formatado_CC,lote_servico_header_arquivo_CC] = criar_header_arquivo(camposFormulario);
        // HEADER LOTE AB - 1 (CONTAS CORRENTES EXCETO BANCO DO BRASIL)
        const [header_lote_AB_formatado_CC,lote_servico_header_lote_AB_CC] = criar_header_lote_AB(camposFormulario,incremento_lote_servico(lote_servico_header_arquivo_CC),'03');
        //SEGMENTOS A E B CONTA CORRENTE EXCETO BANCO DO BRASIL
        const [segmento_AB_formatado_CC,contador_registro_AB_CC,valores_registro_AB_CC] = criar_segmentos_AB(dados_CC,lote_servico_header_lote_AB_CC,camposFormulario);
        //TRAILER LOTE
        const [data_trailer_AB_CC,somatorio_dos_valores_AB_CC,quantiade_registros_AB_CC] = criar_trailer_lote_AB(lote_servico_header_lote_AB_CC,contador_registro_AB_CC,valores_registro_AB_CC);
        //HEADER DO LOTE AB 2
        const [header_lote_AB_formatado_CC_BB,lote_servico_header_lote_AB_CC_BB] = criar_header_lote_AB(camposFormulario,incremento_lote_servico(lote_servico_header_lote_AB_CC),'01');
        // SEGMENTOS A E B CONTA CORRENTE SOMENTE BANCO DO BRASIL
        const [segmento_AB_formatado_CC_BB,contador_registro_AB_CC_BB,valores_registro_AB_CC_BB] = criar_segmentos_AB(dados_CC_BB,lote_servico_header_lote_AB_CC_BB,camposFormulario);
        //TRAILER LOTE
        const [data_trailer_AB_CC_BB,somatorio_dos_valores_AB_CC_BB,quantiade_registros_AB_CC_BB] = criar_trailer_lote_AB(lote_servico_header_lote_AB_CC_BB,contador_registro_AB_CC_BB,valores_registro_AB_CC_BB);
        // TRAILER ARQUIVO 
        const data_trailer_arquivo_AB_CC = criar_trailer_arquivo(lote_servico_header_lote_AB_CC_BB,contador_registro_AB_CC+contador_registro_AB_CC_BB);
        
        texto_arquivo_CC = header_arquivo_formatado_CC+header_lote_AB_formatado_CC+segmento_AB_formatado_CC+
        data_trailer_AB_CC+header_lote_AB_formatado_CC_BB+segmento_AB_formatado_CC_BB+data_trailer_AB_CC_BB+
        data_trailer_arquivo_AB_CC;
        
        somatorio_dos_valores_total = somatorio_dos_valores_AB_CC_BB + somatorio_dos_valores_AB_CC;
        
        quantidade_registros_total = (quantiade_registros_AB_CC_BB + quantiade_registros_AB_CC)/2;
        
    }else if(dados_CC){
        // HEADER DO ARQUIVO - CC SOMENTE OUTROS BANCOS
        const [header_arquivo_formatado_CC,lote_servico_header_arquivo_CC] = criar_header_arquivo(camposFormulario);
        // HEADER LOTE AB - 1 (CONTAS CORRENTES EXCETO BANCO DO BRASIL)
        const [header_lote_AB_formatado_CC,lote_servico_header_lote_AB_CC] = criar_header_lote_AB(camposFormulario,incremento_lote_servico(lote_servico_header_arquivo_CC),'03');
        //SEGMENTOS A E B CONTA CORRENTE EXCETO BANCO DO BRASIL
        const [segmento_AB_formatado_CC,contador_registro_AB_CC,valores_registro_AB_CC] = criar_segmentos_AB(dados_CC,lote_servico_header_lote_AB_CC,camposFormulario);
        //TRAILER LOTE
        const [data_trailer_AB_CC,somatorio_dos_valores_AB_CC,quantiade_registros_AB_CC] = criar_trailer_lote_AB(lote_servico_header_lote_AB_CC,contador_registro_AB_CC,valores_registro_AB_CC);
        //HEADER DO LOTE AB 2
        // TRAILER ARQUIVO 
        const data_trailer_arquivo_AB_CC = criar_trailer_arquivo(lote_servico_header_lote_AB_CC,contador_registro_AB_CC);
        
        texto_arquivo_CC = header_arquivo_formatado_CC+header_lote_AB_formatado_CC+segmento_AB_formatado_CC+data_trailer_AB_CC+data_trailer_arquivo_AB_CC;
        
        somatorio_dos_valores_total =  somatorio_dos_valores_AB_CC;

        quantidade_registros_total =  (quantiade_registros_AB_CC)/2;
    }else if(dados_CC_BB){
        // HEADER DO ARQUIVO - CC SOMENTE BANCO DO BRASIL
        const [header_arquivo_formatado_CC_BB,lote_servico_header_arquivo_CC_BB] = criar_header_arquivo(camposFormulario);
        // HEADER LOTE AB - 1 (CONTAS CORRENTES EXCETO BANCO DO BRASIL)
        const [header_lote_AB_formatado_CC_BB,lote_servico_header_lote_AB_CC_BB] = criar_header_lote_AB(camposFormulario,incremento_lote_servico(lote_servico_header_arquivo_CC_BB),'01');
        //SEGMENTOS A E B CONTA CORRENTE EXCETO BANCO DO BRASIL
        const [segmento_AB_formatado_CC_BB,contador_registro_AB_CC_BB,valores_registro_AB_CC_BB] = criar_segmentos_AB(dados_CC_BB,lote_servico_header_arquivo_CC_BB,camposFormulario);
        //TRAILER LOTE
        const [data_trailer_AB_CC_BB,somatorio_dos_valores_AB_CC_BB,quantiade_registros_AB_CC_BB] = criar_trailer_lote_AB(lote_servico_header_lote_AB_CC_BB,contador_registro_AB_CC_BB,valores_registro_AB_CC_BB);
        //HEADER DO LOTE AB 2
        // TRAILER ARQUIVO 
        const data_trailer_arquivo_AB_CC_BB = criar_trailer_arquivo(lote_servico_header_lote_AB_CC_BB,contador_registro_AB_CC_BB);
        
        texto_arquivo_CC = header_arquivo_formatado_CC_BB+header_lote_AB_formatado_CC_BB+segmento_AB_formatado_CC_BB+data_trailer_AB_CC_BB+data_trailer_arquivo_AB_CC_BB;
        
        somatorio_dos_valores_total =  somatorio_dos_valores_AB_CC_BB;
    
        quantidade_registros_total =  (quantiade_registros_AB_CC_BB)/2;
        
    }else{
        texto_arquivo_CC = 'Não houve colaboradores com a conta corrente.';

        somatorio_dos_valores_total =  0;
    
        quantidade_registros_total =  0;
    }    
    
    fs.writeFile(destino_TXT_CC, 
        texto_arquivo_CC, (err) => {
            if (err) {
                throw new Error(err)
        }        
    });    
    return [true,somatorio_dos_valores_total,quantidade_registros_total];
}    
export function criar_remessa_CP(dados_CP,dados_CP_BB,camposFormulario,destino_TXT_CP){
    
    let texto_arquivo_CP;
    let somatorio_dos_valores_total;
    let quantidade_registros_total; 
    if(dados_CP && dados_CP_BB){
        // HEADER DO ARQUIVO - CP OUTROS BANCOS E BANCO DO BRASIL
        const [header_arquivo_formatado_CP,lote_servico_header_arquivo_CP] = criar_header_arquivo(camposFormulario);
        // HEADER LOTE AB - 1 (CONTAS CORRENTES EXCETO BANCO DO BRASIL)
        const [header_lote_AB_formatado_CP,lote_servico_header_lote_AB_CP] = criar_header_lote_AB(camposFormulario,incremento_lote_servico(lote_servico_header_arquivo_CP),'03');
        //SEGMENTOS A E B CONTA CORRENTE EXCETO BANCO DO BRASIL
        const [segmento_AB_formatado_CP,contador_registro_AB_CP,valores_registro_AB_CP] = criar_segmentos_AB(dados_CP,lote_servico_header_lote_AB_CP,camposFormulario);
        //TRAILER LOTE
        const [data_trailer_AB_CP,somatorio_dos_valores_AB_CP,quantiade_registros_AB_CP] = criar_trailer_lote_AB(lote_servico_header_lote_AB_CP,contador_registro_AB_CP,valores_registro_AB_CP);
        //HEADER DO LOTE AB 2
        const [header_lote_AB_formatado_CP_BB,lote_servico_header_lote_AB_CP_BB] = criar_header_lote_AB(camposFormulario,incremento_lote_servico(lote_servico_header_lote_AB_CP),'05');
        // SEGMENTOS A E B CONTA CORRENTE SOMENTE BANCO DO BRASIL
        const [segmento_AB_formatado_CP_BB,contador_registro_AB_CP_BB,valores_registro_AB_CP_BB] = criar_segmentos_AB(dados_CP_BB,lote_servico_header_lote_AB_CP_BB,camposFormulario);
        //TRAILER LOTE
        const [data_trailer_AB_CP_BB,somatorio_dos_valores_AB_CP_BB,quantiade_registros_AB_CP_BB] = criar_trailer_lote_AB(lote_servico_header_lote_AB_CP_BB,contador_registro_AB_CP_BB,valores_registro_AB_CP_BB);
        // TRAILER ARQUIVO 
        const data_trailer_arquivo_AB_CP = criar_trailer_arquivo(lote_servico_header_lote_AB_CP_BB,contador_registro_AB_CP+contador_registro_AB_CP_BB);

        texto_arquivo_CP = header_arquivo_formatado_CP+header_lote_AB_formatado_CP+segmento_AB_formatado_CP+
        data_trailer_AB_CP+header_lote_AB_formatado_CP_BB+segmento_AB_formatado_CP_BB+data_trailer_AB_CP_BB+
        data_trailer_arquivo_AB_CP;

         
        somatorio_dos_valores_total = somatorio_dos_valores_AB_CP_BB + somatorio_dos_valores_AB_CP;
        
        quantidade_registros_total = (quantiade_registros_AB_CP_BB + quantiade_registros_AB_CP)/2;
        
    }else if(dados_CP){  
        // HEADER DO ARQUIVO - CP SOMENTE OUTROS BANCOS
        const [header_arquivo_formatado_CP,lote_servico_header_arquivo_CP] = criar_header_arquivo(camposFormulario);
        // HEADER LOTE AB - 1 (CONTAS CORRENTES EXCETO BANCO DO BRASIL)
        const [header_lote_AB_formatado_CP,lote_servico_header_lote_AB_CP] = criar_header_lote_AB(camposFormulario,incremento_lote_servico(lote_servico_header_arquivo_CP),'03');
        //SEGMENTOS A E B CONTA CORRENTE EXCETO BANCO DO BRASIL
        const [segmento_AB_formatado_CP,contador_registro_AB_CP,valores_registro_AB_CP] = criar_segmentos_AB(dados_CP,lote_servico_header_lote_AB_CP,camposFormulario);
        //TRAILER LOTE
        const [data_trailer_AB_CP,somatorio_dos_valores_AB_CP,quantiade_registros_AB_CP] = criar_trailer_lote_AB(lote_servico_header_lote_AB_CP,contador_registro_AB_CP,valores_registro_AB_CP);
        //HEADER DO LOTE AB 2
        // TRAILER ARQUIVO 
        const data_trailer_arquivo_AB_CP = criar_trailer_arquivo(lote_servico_header_lote_AB_CP,contador_registro_AB_CP);
        
        texto_arquivo_CP = header_arquivo_formatado_CP+header_lote_AB_formatado_CP+segmento_AB_formatado_CP+data_trailer_AB_CP+data_trailer_arquivo_AB_CP;
        
        somatorio_dos_valores_total = somatorio_dos_valores_AB_CP;
        
        quantidade_registros_total = (quantiade_registros_AB_CP)/2;
    }else if(dados_CP_BB){
        // HEADER DO ARQUIVO - CP SOMENTE BANCO DO BRASIL
        const [header_arquivo_formatado_CP_BB,lote_servico_header_arquivo_CP_BB] = criar_header_arquivo(camposFormulario);
        // HEADER LOTE AB - 1 (CONTAS CORRENTES EXCETO BANCO DO BRASIL)
        const [header_lote_AB_formatado_CP_BB,lote_servico_header_lote_AB_CP_BB] = criar_header_lote_AB(camposFormulario,incremento_lote_servico(lote_servico_header_arquivo_CP_BB),'05');
        //SEGMENTOS A E B CONTA CORRENTE EXCETO BANCO DO BRASIL
        const [segmento_AB_formatado_CP_BB,contador_registro_AB_CP_BB,valores_registro_AB_CP_BB] = criar_segmentos_AB(dados_CP_BB,lote_servico_header_arquivo_CP_BB,camposFormulario);
        //TRAILER LOTE
        const [data_trailer_AB_CP_BB,somatorio_dos_valores_AB_CP_BB,quantiade_registros_AB_CP_BB] = criar_trailer_lote_AB(lote_servico_header_lote_AB_CP_BB,contador_registro_AB_CP_BB,valores_registro_AB_CP_BB);
        //HEADER DO LOTE AB 2
        // TRAILER ARQUIVO 
        const data_trailer_arquivo_AB_CP_BB = criar_trailer_arquivo(lote_servico_header_lote_AB_CP_BB,contador_registro_AB_CP_BB);
        
        texto_arquivo_CP = header_arquivo_formatado_CP_BB+header_lote_AB_formatado_CP_BB+segmento_AB_formatado_CP_BB+data_trailer_AB_CP_BB+data_trailer_arquivo_AB_CP_BB;
    
        somatorio_dos_valores_total = somatorio_dos_valores_AB_CP_BB;
        
        quantidade_registros_total = (quantiade_registros_AB_CP_BB)/2;
        
    }else{
        texto_arquivo_CP = 'Não houve colaboradores com a conta poupança.';
        somatorio_dos_valores_total = 0;
        
        quantidade_registros_total = 0;
    }    
    fs.writeFile(destino_TXT_CP, 
        texto_arquivo_CP, (err) => {
        if (err) {
            throw new Error(err)
        }    
    });    

    return [true,somatorio_dos_valores_total,quantidade_registros_total];
}    
