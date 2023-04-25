import React from 'react'
import Image from 'next/image';
import Style from './TokenList.module.css';
import images from '../../assets';

function Token({tokenDate, setOpenTokenBox}) {  
  // console.log(tokenDate);
  let tokenList = [];
  for(let i = 0; i < tokenDate.length; i++) {
    if(i % 2 == 1) tokenList.push(tokenDate[i]);
  }
  return (
    <div className={Style.TokenList}>
      <p className={Style.TokenList_close}
        onClick={() => setOpenTokenBox(false)}>
        <Image src={images.close} alt="close" width={50} height={50} />
      </p>
      <div className={Style.TokenList_title}>
        <h2>Your Token List</h2>
      </div>

      {tokenList.map((el, i) => (
        <div className={Style.TokenList_box}>
          <div className={Style.TokenList_box_info}> 
            <p className={Style.TokenList_box_info_symbol}>
              {el.name}
            </p>
            <p>
              <span>{el.tokenBalance}   </span> {el.symbol}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Token
