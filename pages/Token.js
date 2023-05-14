import React, {useState, useEffect, useContext} from 'react';
import Image from "next/image";

import Style from "../styles/Token.module.css";
import images from "../assets";
import {AllTokens} from "../components/index";
import { SwapTokenContext } from "../Context/SwapContext";


const Tokens = () => {
    const [allTokenList, setAllTokenList] = useState([
        {
            number: 1,
            image: images.etherlogo,
            name: 'Ether',
            symbol: 'ETH',
            price: '$12,423',
            change: '+323',
            tvl: '$12B',
            volume: '$322M',
        },
        {
            number: 2,
            image: images.etherlogo,
            name: 'Wrapped ETH',
            symbol: 'WETH',
            price: '1,000',
            change: '+21412',
            tvl: '-32',
            volume: '342',
        },
        {
            number: 3,
            image: images.etherlogo,
            name: 'Wrapped BTC',
            symbol: 'WBTC',
            price: '1,000',
            change: '+21412',
            tvl: '0.00',
            volume: '0.00',
        },
        {
            number: 4,
            image: images.etherlogo,
            name: 'USD Coin',
            symbol: 'USDC',
            price: '1,000',
            change: '+21412',
            tvl: '0.00',
            volume: '0.00',
        },
    ]);

    const { topTokensList } = useContext(SwapTokenContext);


    const [copyAllTokenList, setCopyAllTokenList] = useState(allTokenList);
    const [search, setSearch] = useState("");
    const [searchItem, setSearchItem] = useState(search);

    const onHandleSearch = (value) => {
        const filteredTokens = allTokenList.filter(({name}) => 
            name.toLowerCase().includes(value.toLowerCase())
        );

        if(filteredTokens.length === 0) {
            setAllTokenList(copyAllTokenList);
        } else {
            setAllTokenList(filteredTokens);
        }
    }

    const onClearSearch = () => {
        if(allTokenList.length && copyAllTokenList.length) {
            setAllTokenList(copyAllTokenList);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => setSearch(searchItem), 1000);
        return () => clearTimeout(timer);
    }, [searchItem]);

    useEffect(() => {
        if(search) {
            onHandleSearch(search);
        } else {
            onClearSearch();
        }
    }, [search]);

    return (
        <div className={Style.Tokens}>
            <div className={Style.Tokens_box}>
                <h2>Top tokens on Uniswap</h2>
                <div className={Style.Tokens_box_header}>
                    <div className={Style.Tokes_box_ethereum} style={{ display: 'flex', flexDirection: 'row' }}>
                        <p>
                            <Image
                                src={images.etherlogo}
                                alt="ether"
                                width={20}
                                height={20}
                            />
                        </p>               
                        <p>Ethereum</p>     
                    </div>
                    <div className={Style.Token_box_search} style={{ display: 'flex', flexDirection: 'row' }}>
                        <p>
                            <Image src={images.search} alt='image' width={20} height={20} />
                        </p>
                        <input
                            type="text"
                            placeholder='Filter Tokens'
                            onChange={(e) => setSearchItem(e.target.value)}
                            value={searchItem}
                        />    
                    </div>         
                </div>
                <AllTokens allTokenList={topTokensList} />
            </div>
        </div>
    );
};

export default Tokens;