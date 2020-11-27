import React from 'react';
import Time_Selector from './Time_Selector';

function Header()
{
    const divStyle = {
        paddingTop: "50px",
        paddingBottom: "50px",
    }

    return (
        <div classname="Selectors" style={divStyle}>
            <Time_Selector/>

        </div>
    )
}

export default Header;