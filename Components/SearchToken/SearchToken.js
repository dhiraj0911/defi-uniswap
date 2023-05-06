import React, {useState,  useEffect} from 'react'
import Image from 'next/image';

import Style from "./SearchToken.module.css";
import images from "../../assets";

function SearchToken({openToken, tokens, tokenData}) {
  // UseState
  const [active, setActive] = useState(1);
  
  let tokenList = [];
  for(let i = 0; i < tokenData.length; i++) {
    if(i % 2 == 1) tokenList.push(tokenData[i]);
  }
  // const coin = [
  //   {
  //     img: images.ether,
  //     name: "ETH"
  //   },
  //   {
  //     img: images.ether,
  //     name: "WETH"
  //   },
  //   {
  //     img: images.ether,
  //     name: "BTC"
  //   },
  //   {
  //     img: images.ether,
  //     name: "FIL"
  //   },
  //   {
  //     img: images.ether,
  //     name: "SOL"
  //   },
  //   {
  //     img: images.ether,
  //     name: "XRP"
  //   },
  //   {
  //     img: images.ether,
  //     name: "DOGE"
  //   }
  // ]

  return (
    <div className={Style.SearchToken}>
      <div className={Style.SearchToken_box}>
        <div className={Style.SearchToken_box_heading}>
          <h4>Select Token</h4>
          <Image src={images.close} alt='close'
            width={50}
            height={50}
            onClick={() => openToken(false)}
          />
        </div>
        <div className={Style.SearchToken_box_search}>
          <div className={Style.SearchToken_box_search_img}>
            <Image src={images.search} alt="search" width={20} height={20} /> 
          </div>
          <input type="text" placeholder="Search name and paste the address" />
        </div>        
        <div className={Style.SearchToken_box_tokens}>
          {tokenList.map((el, i) => (
            <span 
              key={i + 1}
              className={active == i + 1 ? `${Style.active}`: ""}
              onClick={() => (
                setActive(i + 1), tokens({
                  name: el.name, 
                  image: el.img, 
                  symbol: el.symbol,
                  tokenBalance: el.tokenBalance,
                  tokenAddress: el.tokenAddress})
              )}
            >
              <Image 
                src={el.img || images.ether}
                alt="image"
                width={30}
                height={30}
              />
              {el.symbol}  
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchToken
