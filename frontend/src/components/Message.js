import React from 'react'
import Styles from './Message.module.css';

const Message = ({mensagem,tipo}) => {
    if(mensagem && tipo){
        let tipo_mensagem;
        switch(tipo){
            case 'success':
                tipo_mensagem = Styles.success;
            break;              
            case 'error':
                tipo_mensagem = Styles.error;
            break;              
            case 'warning':
                tipo_mensagem = Styles.warning;
            break;  
            default:
            break;            
        }
    return (
        <div className={`${Styles.mensagem} ${tipo_mensagem}`}>
            <p>{mensagem}</p>
        </div>
        )
    }
}

export default Message