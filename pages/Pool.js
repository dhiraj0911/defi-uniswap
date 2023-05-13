import React, { useState } from "react";
import Image from "next/image";

//Internal Import
import Style from "../styles/Pool.module.css";
import images from "../assets";

import {PoolAdd, PoolConnect} from "../components/index";
import { SwapTokenContext } from "@/Context/SwapContext";

// usecontext
import { useContext } from "react";
const Pool = () => {
    const { account, createLiquidityAndPool, tokenData, getAllLiquidity  } = useContext(SwapTokenContext);
    const [closePool, setclosePool] = useState(false);

    return (
        <div className={Style.Pool}>
            {closePool ? (
                <PoolAdd 
                    account={account}
                    setclosePool={setclosePool}
                    tokenData={tokenData}
                    createLiquidityAndPool={createLiquidityAndPool}
                />
            ): (
                <PoolConnect 
                    setclosePool={setclosePool}
                    createLiquidityAndPool={createLiquidityAndPool}
                    account={account}
                />
            )}
        </div>
    );
};

export default Pool;
