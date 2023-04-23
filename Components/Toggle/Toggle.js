import React from 'react'
import Style from "./Toggle.module.css"


function Toggle({label}) {
  return (
    <div className={Style.Toggle}>
      <div className={Style.Toggle_switch_box}>
        <input type="checkbox" 
          name={label}
          id={label}
          className={Style.Toggle_checkbox}
        />
        <label className={Style.Toggel_label} htmlFor={label}>
          <span className={Style.Toggle_inner}/>
          <span className={Style.Toggle_switch}/>
        </label>
      </div>
    </div>
  )
}

export default Toggle
