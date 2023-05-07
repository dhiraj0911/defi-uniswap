import React, {useState, useEffect} from 'react'
import Image from 'next/image';
import Style from './Model.module.css';
import images from './../../assets';

function Model({setOpenModel, connectWallet}) {
  // usestate
  const walletMenu = ["MetaMask", "Coinbase", "WalletConnect", "Wallet"]
  return (
    <div className={Style.Model}>
      <div className={Style.Model_box}>
        <div className={Style.Model_box_heading}>
          <p>Connect a wallet</p>
          <div className={Style.Model_box_heading_img}>
            <Image src={images.close}
              alt="close"
              width={50}
              height={50}
              onClick={() => setOpenModel(false)}
            />
          </div>
        </div>
        <div className={Style.Model_box_wallet}>
          {walletMenu.map((el, i) => (
            <p key={i + 1} onClick={() => connectWallet()}>
              {el}
            </p>
          ))}         
        </div>
        <p className={Style.Model_box_para}>
          Don't see a wallet you use?
        </p>
      </div>
    </div>
  )
}

export default Model
