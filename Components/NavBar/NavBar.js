import React, {useState, useEffect, useContext} from 'react'
import Image from 'next/image';
import Link from 'next/Link';

import Style from './NavBar.module.css';
import images from '../../assets';
import {Model, TokenList} from '../index';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';
import dynamic from "next/dynamic";
import { SwapTokenContext } from "../../Context/SwapContext";

function NavBar() {
  const { ether,  networkConnect, connectWallet, account, tokenData} = useContext(SwapTokenContext);
  console.log(tokenData);
  const menuItems = [
    {
      name: "Swap",
      link: '/'
    }, 
    {
      name: "Token",
      link: '/'
    }, 
    {
      name: "Pool",
      link: '/' 
    }
  ];
  //usestate
  const [openModel, setOpenModel] = useState(false);
  const [openTokenBox, setOpenTokenBox] = useState(false);
  // const [account, setAccount] = useState(true);
  console.log(tokenData);
  return (
    <div className={Style.NavBar}>
      <div className={Style.NavBar_box}>
        <div className={Style.NavBar_box_left}>
          {/* // Logo  */}
          <div className={Style.NavBar_box_left_img}>
            <Image src={images.uniswap } alt="logo" width={50} height={50} />
          </div>
          {/* Menu Items */}
          <div className={Style.NavBar_box_left_menu}>
            {menuItems.map((el, i) => (
              <Link
                key= {i + 1} 
                href={{pathname: `${el.name}`, query: `${el.link}`}}
              >
                  <p className={Style.NavBar_box_left_menu_item}>{el.name}</p>
              </Link>
            ))}
          </div>
        </div>
        {/* Middle Section */}
        <div className={Style.NavBar_box_middle}>
          <div className={Style.NavBar_box_middle_search}>
              <div className={Style.NavBar_box_middle_search_img}>
                <Image src={images.search} alt="search" width={20} height={20} />
              </div>
              {/* Input section */}
              <input type="text" placeholder="Search Tokens"/>
          </div>
        </div>
        {/* Right Section */}
        <div className={Style.NavBar_box_right}>
          <div className={Style.NavBar_box_right_box}>
            <div className={Style.NavBar_box_right_box_img}>
              <Image src={images.ether} alt="Network" width={30} height={30} />  
            </div>
            <p>{networkConnect}</p>
            {
              account ? (
                <button onClick={() => setOpenTokenBox(true)}>{account.slice(0, 4)}...{account.slice(38)}</button>
              ) : (
                <button onClick={() => setOpenModel(true)}>Connect</button>
              )
            }
            {openModel && (
              <Model setOpenModel = {setOpenModel} connectWallet={connectWallet} />
            )}
          </div>
        </div>
      </div>
      {/* Token List */}
      {/* {openTokenBox && (
        <TokenList tokenData={tokenData} setOpenTokenBox={setOpenTokenBox} />
      )} */}
      {openTokenBox && tokenData && (<TokenList tokenDate={tokenData} setOpenTokenBox={setOpenTokenBox} />)}
    </div>
  )
}

export default dynamic (() => Promise.resolve(NavBar), {ssr: false})
