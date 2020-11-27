import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';


function Home_Page()
{
    const[trends, setTrends] = useState({
        loading: false,
        data: null,
        error: false
    });

    const divStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: 'white',
        fontFamily: 'Catamaran, sans-serif'
    }

    const trendStyle = {
        paddingTop: '1%',
    }

    var dailytrend_data_url = `http://localhost:3001/get_daily_trends`;

    useEffect(() => {

        setTrends({
            loading: true,
            data: null,
            error: false
        });

        axios.get(dailytrend_data_url)
        .then((response)=>
        {
            setTrends({
                loading: false,
                data: response.data,
                error: false
            });
        })
        .catch(()=>
        {
            setTrends({
                loading: false,
                data: null,
                error: true
            });

        });
    }, []);

    let content = null;

    if(trends.loading)
    {
        content = <div>
            Loading
        </div>
    } else if(trends.error)
    {
        content = <div>
            Error
        </div>
    } else if(trends.data != null)
    {
        content = trends.data.filter(trend => trend.type.includes('company')).map((trend, key) => 
            <div style={trendStyle}>
            {trend.name}
            </div>
        )
    }

    return(
        <div className="Homepage" style={divStyle}>
            <h2>Current Daily Trends</h2>
            {content}
        </div>
    )
}

export default Home_Page;