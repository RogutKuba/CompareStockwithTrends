import React, { useEffect, useState }  from 'react';
import axios from 'axios';
import TrendGraph from './TrendGraph';
import StockGraph from './StockGraph';

function TotalGraph(props)
{
    const [graph, setGraph] = useState({ready: false, data: {reddit: null, trends: null, stock: null}, loading: true});

    let content = null;

    var reddit_data_url = `http://localhost:3001/get_reddit_data/${props.stockname}/${props.time_length}`;
    var trends_data_url = `http://localhost:3001/get_trend_data/${props.stockname}/${props.time_length}`;
    var stock_data_url = `http://localhost:3001/get_stock_data/${props.stockname}/${props.time_length}`;

    const request_reddit_data = axios.get(reddit_data_url);
    const request_trends_data = axios.get(trends_data_url);
    const request_stock_data = axios.get(stock_data_url);

    useEffect(() => {
        console.log('Getting trends');

        axios.all([request_reddit_data, request_trends_data, request_stock_data]).then(axios.spread((...responses) =>
        {
            setGraph({ready: true, data: {reddit: responses[0].data, trends: responses[1].data, stock: responses[2].data}, loading: false});

        })).catch(errors => {
            setGraph({ready: false, data: null, loading: false});
            console.log(errors)
        });
    }, []);

    if(graph.ready)
    {
        content = <div>
                <TrendGraph reddit_data={graph.data.reddit} trends_data={graph.data.trends} />
                <StockGraph stock_data={graph.data.stock}/>
                
        </div>
        
    } else if(graph.loading)
    {
        content = <div>
            content = <div>Loading</div>;
        </div>
    } else 
    {
        content = <div>
            There was an error
        </div>
    }

    return(
        <div>
            {content}
        </div>
    )
}

export default TotalGraph;