import React from 'react';
import { useParams } from 'react-router-dom';
import TotalGraph from '../components/TotalGraph';


function Stock_Graph()
{
    const { stock_name, length } = useParams();

    const divStyle = {
        marginLeft: "20%",
        marginRight: "20%",
    }

    return <div style={divStyle} key={`${stock_name}/${length}`}>
                 <TotalGraph stockname={stock_name} time_length={length} />
            </div>
}

export default Stock_Graph;