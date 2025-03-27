import {gera_data_atual} from './funcoes_auxiliares.js'

import {criar_dados_colaboradores_formatados,criar_remessa_CC,criar_remessa_CP} from './funcoes_remessa.js'

export const criar_arquivos = (camposFormulario,data_CSV)=>{
    const destino_TXT_CC = `remessas/${gera_data_atual('-')}/REMESSA-${camposFormulario.dataPagamento}-CC.REM`;
    const destino_TXT_CP = `remessas/${gera_data_atual('-')}/REMESSA-${camposFormulario.dataPagamento}-CP.REM`;

    const {dados_CC,dados_CC_BB,dados_CP,dados_CP_BB} = criar_dados_colaboradores_formatados(data_CSV);
   let [arquivo_CC,valor_CC,quatidade_registros_CC] = criar_remessa_CC(dados_CC,dados_CC_BB,camposFormulario,destino_TXT_CC); 
   let [arquivo_CP,valor_CP,quantidade_registros_CP] = criar_remessa_CP(dados_CP,dados_CP_BB,camposFormulario,destino_TXT_CP);
    
    return [arquivo_CC,valor_CC,quatidade_registros_CC,arquivo_CP,valor_CP,quantidade_registros_CP];
};    


