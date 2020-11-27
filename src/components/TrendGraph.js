import React from 'react';
import { Line } from 'react-chartjs-2';

function TrendGraph(props)
{
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const graph_data = 
    {
        labels: [],
        datasets:[
            {
                label: ["Reddit Trends"],
                data: [],
                borderColor: ['rgba(255, 86, 0, 0.3)'],
                backgroundColor:['rgba(255, 86, 0, 0.1)']
            },
            {
                label: ["Google Trends"],
                data: [],
                borderColor: ['rgba(66, 133, 244, 0.5)'],
                backgroundColor:['rgba(66, 133, 244, 0.3)'],
                pointBorderColor: ['rgba(66, 133, 244, 0.5)'],
                pointBackgroundColor: ['rgba(66, 133, 244, 0.5)'],
            }
        ]
    };

    //Reddit Data
    for(let i = 0; i < props.reddit_data.length; i++)
    {
        //let date = new Date(props.reddit_data[i].key*1000);
        //graph_data.labels.push(`${monthNames[date.getMonth()]}-${date.getDate()}`);
        graph_data.datasets[0].data.push(props.reddit_data[i].doc_count)
    }

    //Trends Data
    for(let i = 0; i < props.trends_data.length; i++)
    {
        graph_data.labels.push(`${props.trends_data[i].formattedtime}`);
        graph_data.datasets[1].data.push(props.trends_data[i].data);
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

export default TrendGraph;