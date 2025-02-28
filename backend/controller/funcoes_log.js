/**
 * 
 * Funções para controle sobre quem fará os pagamentos dos arquivos criados
 *  
 */
import { db } from "../db.js";
import {gera_data_atual} from '../controller/funcoes_auxiliares.js';

export const getRemessas = (_, res) => {
    const q = "SELECT * FROM remessas";
  
    db.query(q, (err, data) => {
      if (err) return res.json(err);
      return res.status(200).json(data);
    });
  };

export const insertRemessa = (req,arquivo_CC,valor_CC,quatidade_registros_CC,arquivo_CP,valor_CP,quantidade_registros_CP) =>{
  const q =
    "INSERT INTO remessas(`responsavel_pagamento`, `email_responsavel_pagamento`, `matricula_responsavel_pagamento`, `motivo_pagamento`, `data_pagamento`,`data_criacao`,`CC`,`valor_CC`,`quantidade_registros_CC`,`CP`,`valor_CP`,`quantidade_registros_CP`) VALUES(?)";
    const values = [
    req.body.responsavelPagamento,
    String(req.body.emailResponsavelPagamento),
    req.body.matriculaResponsavelPagamento,
    req.body.motivoPagamento,
    req.body.dataPagamento,
    gera_data_atual('-').split('-').reverse().join('-'), //Data no formato americano
    arquivo_CC,
    valor_CC,
    quatidade_registros_CC,
    arquivo_CP,
    valor_CP,
    quantidade_registros_CP
    ];

    db.query(q, [values], (err) => {
    if (err) throw new Error(err);
    });
  if(arquivo_CC===false || arquivo_CP===false){
      return res.status(404).json({ message: "Erro ao criar o(s) arquivo(s)!" });
  }

}
