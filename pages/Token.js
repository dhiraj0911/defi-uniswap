import React, {useState, useEffect} from 'react';
import Image from "next/image";

import Style from "../styles/Token.module.css";
import images from "../assets";
// import {AllTokens} from "../components/AllTokens";
import {AllTokens} from "../components/index";


const Tokens = () => {
    const [allTokenList, setAllTokenList] = useState([
        {
            number: 1,
            image: images.etherlogo,
            name: 'Ether',
            symbol: 'ETH',
            price: '1,000,000',
            change: '0.00',
            tvl: '0.00',
            volume: '0.00',
        },
        {
            number: 2,
            image: images.etherlogo,
            name: 'Wrapped BTC',
            symbol: 'ETH',
            price: '1,000',
            change: '+21412',
            tvl: '0.00',
            volume: '0.00',
        },
        {
            number: 3,
            image: images.etherlogo,
            name: 'Wrapped BTC',
            symbol: 'ETH',
            price: '1,000',
            change: '+21412',
            tvl: '0.00',
            volume: '0.00',
        },
    ]);
    const [copyAllTokenList, setCopyAllTokenList] = useState(allTokenList);
    const [search, setSearch] = useState("");
    const [searchItem, setSearchItem] = useState(search);

    const onHandleSearch = (value) => {
        const filteredTokens = allTokenList.filter(({name}) => {
            name.toLowerCase().includes(value.toLowerCase());
        });

        if(filteredTokens.length() === 0) {
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
                                <input
                                    type="text"
                                    placeholder='Filter Tokens'
                                    onChange={(e) => setSearchItem(e.target.value)}
                                    value={searchItem}
                                />
                            </p>
                            
                        </div>         
                </div>
                <AllTokens allTokenList={allTokenList} />
            </div>
        </div>
    );
};

export default Tokens;