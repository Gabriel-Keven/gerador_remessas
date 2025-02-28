/**
 * 
 * Rotas do backend
 *  
 */
import express from 'express';
import multer from 'multer';
import fs from 'fs'
import {criar_arquivos} from '../controller/criar_remessas.js';
import {gera_data_atual} from '../controller/funcoes_auxiliares.js';
import {insertRemessa,getRemessas} from '../controller/funcoes_log.js';

const router = express.Router();

const destino = `remessas/${gera_data_atual('-')}/uploads`;

const upload = multer({ dest:  destino})
router.post("/", upload.single('arquivo'), (req, res) => {
    if(req){
        //Leitura do arquivo CSV
        fs.readFile(req.file.path, 'utf8',async (err, data_CSV) => {
            if(err){
                return res.status(200).json({ message: err });
            }
            //Construção dos arquivos .REM
            const [arquivo_CC,valor_CC,quatidade_registros_CC,arquivo_CP,valor_CP,quantidade_registros_CP] = criar_arquivos(req.body,await (data_CSV));
            //Insere log sobre criação da remessa no banco de dados
            insertRemessa(req,arquivo_CC,valor_CC,quatidade_registros_CC,arquivo_CP,valor_CP,quantidade_registros_CP);
        });
        //Renomear aquivo CSV
        const arquivo_upload_CSV = `${destino}/${req.file.originalname}`;
        fs.rename(req.file.path, arquivo_upload_CSV, function(err){
            if(err){
                return res.status(404).json({ message: err });
            }
        });
        return res.status(200).json({ message: "Arquivo(s) criado(s) com sucesso!" });
    }else{
        return res.status(404).json({ message: "Requisição inválida tente novamente!" });
    }
});

// Obter os dados inseridos no banco de dados
router.get("/", getRemessas)

export default router;