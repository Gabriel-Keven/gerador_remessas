import React, { useState,useEffect } from 'react'
import Styles from './Home.module.css'
import axios from "axios";
import { toast } from "react-toastify";

function formata_data(valor){
  return valor.split('T').shift().split('-').reverse().join('/');
}
function formata_valor(valor1,valor2){
  let valor3 = parseFloat(valor1) + parseFloat(valor2);
  return 'R$ '+parseFloat(valor3).toFixed(2).replace('.',',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

const Home = () => {
  const [remessas,setRemessas] = useState([]);

  const getRemessas = async () => {
    try {
      const res = await axios.get("http://localhost:8800");
      setRemessas(res.data);
    } catch (error) {
      toast.error(error);
    }
  };
  useEffect(() => {
    getRemessas();
  }, [setRemessas]);
  return (
    <div className={Styles.home}>
      <h1>Home</h1>
      <p>Para a construção dos arquivos .REM utilizou-se o arquivo de particuliaridades BB.</p>
      <p>Versão: novembro/2019.</p>
      {/* Montar tabela com o histórico de remessas */}
      <h2>Histórico de remessas geradas</h2>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Responsável Pagamento</th>
            <th>E-mail resp.</th>
            <th>Matrícula resp.</th>
            <th>Motivo pagamento</th>
            <th>Data pagamento</th>
            <th>Data Criação</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody>
          {remessas.map((item,id)=>(
            <tr key={id}>
              <td>{item.id}</td>
              <td>{item.responsavel_pagamento}</td>
              <td>{item.email_responsavel_pagamento}</td>
              <td>{item.matricula_responsavel_pagamento}</td>
              <td>{item.motivo_pagamento}</td>
              <td>{formata_data(item.data_pagamento)}</td>
              <td>{formata_data(item.data_criacao)}</td>
              <td>{formata_valor(item.valor_CC,item.valor_CP)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Home