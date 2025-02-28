import React,{ useState } from 'react'

//CSS
import Styles from './Formulario.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Components
import axios from 'axios'

//Imagens

import exemplo_CSV from '../../images/exemplo_CSV.jpg';
import exemplo_UTF8 from '../../images/exemplo_UTF8.jpg';

//Verfica se a data de pagamento é maior ou igual a data atual(hoje)
function verifica_data_pagamento(data_pagamento){
  let data = new Date(),
      dia  = data.getDate().toString().padStart(2, '0'),
      mes  = (data.getMonth()+1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
      ano  = data.getFullYear();
  let data_atual =  `${ano}-${mes}-${dia}`;
  let parse_data_atual = Date.parse(data_atual);
  let parse_data_pagamento = Date.parse(data_pagamento);
  if(parse_data_pagamento>=parse_data_atual){ //data de pagamento só pode ser maior ou igual a data atual
    return true;
  }else{
    return false;
  }
  
}

const Formulario = () => {

  //Variáveis
  const [cnpj,setCNPJ] = useState('');
  const [numeroConvenio,setNumeroConvenio] = useState('');
  const [agencia,setAgencia] = useState('');
  const [digitoAgencia,setDigitoAgencia] = useState('');
  const [conta,setConta] = useState('');
  const [digitoConta,setDigitoConta] = useState('');
  const [digitoVerificadorAgenciaConta,setDigitoVerificadorAgenciaConta] = useState('');
  const [nomeEmpresa,setNomeEmpresa] = useState('');
  const [dataPagamento,setDataPagamento] = useState(''); 
  const [arquivo,setArquivo] = useState('');
  const [responsavelPagamento,setResponsavelPagamento] = useState('');
  const [emailResponsavelPagamento,setemailResponsavelPagamento] = useState('');
  const [matriculaResponsavelPagamento,setMatriculaResponsavelPagamento] = useState('');
  const [motivoPagamento,setMotivoPagamento] = useState('');

  //Tratamento do formulário
  const handleSubmit = async (e)=>{
      e.preventDefault();
    
      //Validar formulário
      if(
          cnpj===''
          ||
          numeroConvenio===''
          ||
          agencia==='' 
          ||
          digitoAgencia===''
          ||
          conta===''
          ||
          digitoConta===''
          ||
          digitoVerificadorAgenciaConta===''
          ||
          nomeEmpresa===''
          ||
          dataPagamento===''
          ||
          responsavelPagamento===''  
          ||
          emailResponsavelPagamento===''  
          ||
          matriculaResponsavelPagamento===''
          ||
          motivoPagamento===''
        ){
        toast.warn("Preencha todos os campos e tente novamente!");
      }else{
        if(verifica_data_pagamento(dataPagamento)===false){
          toast.error("Data de pagamento incorreta! A data de pagamento está menor que a data atual!");
        }else{
          if(!arquivo){
            toast.error("Arquivo em branco! Tente novamente!");
          }else{
            if(arquivo.type==='text/csv'){
              const data = new FormData();
              data.append('arquivo',arquivo)
              data.append('cnpj',cnpj)
              data.append('numeroConvenio',numeroConvenio)
              data.append('agencia',agencia)
              data.append('digitoAgencia',digitoAgencia)
              data.append('conta',conta)
              data.append('digitoConta',digitoConta)
              data.append('digitoVerificadorAgenciaConta',digitoVerificadorAgenciaConta)
              data.append('nomeEmpresa',nomeEmpresa)
              data.append('dataPagamento',dataPagamento)
              data.append('responsavelPagamento',responsavelPagamento)
              data.append('emailResponsavelPagamento',emailResponsavelPagamento)
              data.append('matriculaResponsavelPagamento',matriculaResponsavelPagamento)
              data.append('motivoPagamento',motivoPagamento)

              axios.post('http://localhost:8800/', data, {
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
                  }
              })
              .then((res)=>toast.success(res.data.message)) 
              .catch((res)=>toast.error(res.data.message));
            }else{
              toast.error("Arquivo enviado é inválido. Tente novamente!");
            }
          }
        }
      }
  };
  return (
    <div>
       <ToastContainer />
      <div className={Styles.main}>
        <h2>Siga as orientações abaixo para geração do(s) arquivo(s) CNAB 240.</h2>
        <p>
          <ol>
            <li>Faça somente upload de arquivos .CSV. Em que os dados são separado por vírgulas.</li>
            <li>O arquivo CSV deve ser formato na seguinte ordem de colunas:
              <ul>
                <li>nome: nome do coloraborador que receberá o pagamento;</li>
                <li>cpf: CPF do coloraborador que receberá o pagamento;</li>
                <li>valor_pago valor a ser pago ao coloraborador;</li>
                <li>banco: código do banco do coloraborador. Exemplo: Banco do Brasil - Código: 001;	</li>
                <li>agencia: agência do colaborador;</li>
                <li>digito_agencia: dígito da agência do coloraborador;</li>
                <li>tipo: tipo da conta do colaborador; Existem duas opções:
                    <ul>
                      <li>Conta Corrente - CC</li>
                      <li>Conta Poupança - CP</li>
                    </ul>
                </li>
                <li>conta: numero da conta que deve pertencer <b>EXCLUSIVAMENTE AO COLORABORADOR</b>;</li>
                <li>digito_conta: dígito da conta do coloraborador.</li>
              </ul>
              Segue abaixo imagem de exemplo de arquivo .CSV a ser enviado:
              <img src={exemplo_CSV} alt='Exemplo de Arquivo .CSV' />
            </li>
            <li>Após configurar o arquivo .CSV com o cabeçalho acima converta o mesmo para UTF-8.
              Segue imagem abaixo da configuração de conversão utilizado o Notepad++:
              <img src={exemplo_UTF8} alt='Exemplo de Conversão UTF8' />
            </li>
            <li>Após as configurações acima, selecionar e revisar os campos do formulário salve o arquivo e faça o upload.</li>
          </ol>
        </p>
      {/* Formulário para preenchimento */}
      <form onSubmit={handleSubmit} method='post' enctype="multipart/form-data" action='/'>     
        <label>
          <span>CNPJ da empresa de origem</span> 
          <select name="cnpj" 
            onChange={(e)=>setCNPJ(e.target.value)}
            value={cnpj}
          >
              <option value="">Selecione o CNPJ</option>
              <option value="16694465000120">FUNEC - 16694465000120</option>
              <option value="18715508000131">PMC - 18715508000131</option>
          </select>
        </label>                     
        
        <label>
          <span>Número do convênio</span> 
          <select name="numero_convenio" 
            onChange={(e)=>setNumeroConvenio(e.target.value)}
            value={numeroConvenio}
          >
              <option value="">Selecione o Número do Convênio</option>
              <option value="000973187">FUNEC - 973187</option>
              <option value="000719891">PMC - 719891</option>
          </select>
        </label> 

        <label>
          <span>Agência mantenedora da Conta</span> 
          <select name="agencia" 
            onChange={(e)=>setAgencia(e.target.value)}
            value={agencia}
          >
              <option value="">Selecione a agência</option>
              <option value="01633">FUNEC - 01633</option>
              <option value="01633">PMC - 01633</option>
          </select>
        </label>                     
        
        <label>
          <span>Dígito verificador da Agência</span> 
          <select name="digito_agencia"
            onChange={(e)=>setDigitoAgencia(e.target.value)}
            value={digitoAgencia}
          >
              <option value="">Selecione o dígito da agência</option>
              <option value="0">FUNEC - 0</option>
              <option value="0">PMC - 0</option>
          </select>
        </label>                     
        
        <label>
          <span>Número da conta corrente</span> 
          <select name="conta"
            onChange={(e)=>setConta(e.target.value)}
            value={conta}
          >
              <option value="">Selecione o número da conta corrente</option>
              <option value="000000071510">FUNEC - 71510</option>
              <option value="000000065615">PMC - 65615</option>
          </select>
        </label>                     
        
        <label>
          <span>Dígito verificador da conta</span> 
          <select name="digito_agencia"
            onChange={(e)=>setDigitoConta(e.target.value)}
            value={digitoConta}
          >
              <option value="">Selecione o dígito da conta</option>
              <option value="7">FUNEC - 7</option>
              <option value="1">PMC - 1</option>
          </select>
        </label>                     
        
        <label>
          <span>Dígito verificador da Ag/Conta</span> 
          <select name="digito_verficador_agencia_conta"
            onChange={(e)=>setDigitoVerificadorAgenciaConta(e.target.value)}
            value={digitoVerificadorAgenciaConta}
          >
              <option value="">Selecione o dígito verificador da agência e conta</option>
              <option value="0">FUNEC - 0</option>
              <option value="0">PMC - 0</option>
          </select>
        </label>                     
        
        <label>
          <span>Nome da empresa</span> 
          <select name="nome_empresa"
            onChange={(e)=>setNomeEmpresa(e.target.value)}
            value={nomeEmpresa}
          >
              <option value="">Selecione o nome da empresa/fundação</option>
              <option value="FUNDACAO DE ENSINO DE CONTAGEM">FUNDACAO DE ENSINO DE CONTAGEM</option>
              <option value="PREFEITURA MUNICIPAL DE CONTAG">PREFEITURA MUNICIPAL DE CONTAGEM</option>
          </select>
        </label>                     
        
        <label>
          <span>Data do pagamento</span> 
          <input 
            type="date"
            name="data_pagamento" 
            placeholder="Informe aqui a data de pagamento."
            onChange={(e)=>setDataPagamento(e.target.value)}
            value={dataPagamento}
            />
        </label>          

        <label>
          <span>Upload do arquivo(somente serão aceitos arquivos CSV)</span> 
          <input  
            type="file"
            placeholder="Insira o arquivo com a base de dados."
            name="arquivo"
            className={Styles.arquivo}
            onChange={(e)=>setArquivo(e.target.files[0])}
            />
        </label>    

        <label>
          <span>Responsável pelo pagamento</span> 
          <input 
            type="text"
            name="responsavelPagamento" 
            placeholder="Informe aqui quem fará a submissão do arquivo."
            onChange={(e)=>setResponsavelPagamento(e.target.value)}
            value={responsavelPagamento}
            />
        </label>  

        <label>
          <span>E-mail do responsável pagamento</span> 
          <input 
            type="email"
            name="emailResponsavelPagamento" 
            placeholder="Informe o e-mail de quem fará a submissão do arquivo."
            onChange={(e)=>setemailResponsavelPagamento(e.target.value)}
            value={emailResponsavelPagamento}
            />
        </label>  
        
        <label>
          <span>Matrícula do responsável pelo pagamento</span> 
          <input 
            type="text"
            name="matriculaResponsavelPagamento" 
            placeholder="Informe a matrícula do responsável pelo pagamento."
            onChange={(e)=>setMatriculaResponsavelPagamento(e.target.value)}
            value={matriculaResponsavelPagamento}
            />
        </label>  
        
        <label>
          <span>Motivo do pagamento</span> 
          <textarea
            name="motivoPagamento" 
            placeholder="Informe aqui o motivo do pagamento. Exemplo: RPA do Concurso da Educação Edital n° 01/2023 da prefeitura de Contagem."
            onChange={(e)=>setMotivoPagamento(e.target.value)}
            value={motivoPagamento}>
          </textarea>
        </label>  

        <button type="submit">Enviar</button>
      </form>
      </div>
    </div>
  )
}

export default Formulario