import React, {useState, useContext} from 'react'
import Image from 'next/image';
import Style from './HeroSection.module.css';
import {Token, SearchToken} from '../index';
import images from '../../assets';
import { SwapTokenContext } from "../../Context/SwapContext";


function HeroSection({tokenData}) {
  const [openSetting, setOpenSetting] = useState(false);
  const [isOpenToken, setIsOpenToken] = useState(false); // rename openToken to isOpenToken
  const [openTokensTwo, setOpenTokensTwo] = useState(false);

  const { singleSwapToken, connectWallet, account, weth9, dai, ether} = useContext(SwapTokenContext);

  //Token 1
  const [tokenOne, setTokenOne] = useState({
    name: "",
    image:"",
  })
  //Token 2
  const [tokenTwo, setTokenTwo] = useState({
    name: "",
    image:"",
  })
  return (
    <div className={Style.HeroSection}>
      <div className={Style.HeroSection_box}>
        <div className={Style.HeroSection_box_heading}>
          <p>Swap</p>
          <div className={Style.HeroSection_box_heading_img} >
            <Image src={images.close} alt="img" width={50} height={50} onClick={() => setOpenSetting(true)}/>
          </div>
        </div>
        <div className={Style.HeroSection_box_input}>
          <input type="text" placeholder="0"/>
          <button onClick={() => setIsOpenToken(true)}> {/* update openToken to setIsOpenToken */}
            <Image src={images.image || images.etherlogo} alt="ether" width={20} height={20} />
            {tokenOne.name || "ETH"}
            <small>{ether.slice(0, 7)}</small>
          </button>
        </div>

        <div className={Style.HeroSection_box_input}>
          <input type="text" placeholder="0"/>
          <button onClick={() => setOpenTokensTwo(true)}> {/* update openToken to setOpenTokensTwo */}
            <Image src={tokenTwo.image || images.etherlogo} alt="ether" width={20} height={20} />
            {tokenTwo .name || "ETH"}
            <small>{dai.slice(0, 7)}</small>
          </button>
        </div>
        {account ? (
          <button 
            className={Style.HeroSection_box_btn}
            onClick={() => singleSwapToken()}
          >
            Swap
          </button>
        ) : (
          <button 
            onClickCapture={() => connectWallet()}
            className={Style.HeroSection_box_btn}
          >
              Connect Wallet
        </button>
        )}
      </div>
      {openSetting && 
        <Token setOpenSetting={setOpenSetting}/>
      }

      {isOpenToken && ( 
        <SearchToken 
          openToken={setIsOpenToken} 
          tokens={setTokenOne}
          tokenData={tokenData}
        />
      )}

      {openTokensTwo && (
        <SearchToken 
          openToken={setOpenTokensTwo}
          tokens={setTokenTwo}
          tokenData={tokenData}
        />
      )}
    </div>
  )
}

export default HeroSection
