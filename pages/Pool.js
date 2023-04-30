import React from "react";
import Image from "next/image";

//Internal Import
import Style from "../styles/Pool.module.css";
import images from "../assets";

import {PoolAdd, PoolConnect} from "../components/index";

const Pool = () => {
    return (
        <div className={Style.Pool}>
            <PoolAdd />
            <PoolConnect />
        </div>
    );
};

export default Pool;
