import React from 'react';
import { Line } from 'react-chartjs-2';

function StockGraph(props)
{
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const graph_data = 
    {
        labels: [],
        datasets:[
            {
                label: ["Price"],
                data: [],
                borderColor: ['rgba(255, 86, 0, 0.3)'],
                backgroundColor:['rgba(255, 86, 0, 0.1)']
            }
        ]
    };

    //Stock Data

    
    for(let i = 0; i < props.stock_data.length; i++)
    {
        graph_data.labels.push(props.stock_data[i].time);
        graph_data.datasets[0].data.push(props.stock_data[i].val.toFixed(2))
    }
    
    const divStyle = {
        height: "75%",
        width: "75%",
    }

    return(
        <div style={divStyle}>
            <Line data={graph_data} />
        </div>
    )
}

export default StockGraph;