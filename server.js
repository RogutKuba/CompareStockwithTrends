var express = require('express')
const googleTrends = require('google-trends-api');
const HttpsProxyAgent = require('https-proxy-agent');
var cors = require('cors');
var axios = require('axios');
const Papa = require('papaparse');


var app = express();

app.use(cors());

let port = '3001';

app.listen(port, function()
{
    console.log('listening to '+port);
});

app.get("/", (req,res)=>{
    res.send("poo");
});

app.get("/get_daily_trends", async(req,res)=>
{
    googleTrends.relatedTopics({keyword: 'Stock', startTime: new Date(Date.now() - 5 * 1000*60*60*24), category: 1163})
    .then((response) => {
        let result = [];
        JSON.parse(response).default.rankedList[0].rankedKeyword.map((data, index)=>
        {
            
            result.push({
                'name': data.topic.title,
                'value': data.formattedValue,
                'type': data.topic.type
            });
            
        });
        res.json(result);
    })
    .catch((err) => {
        console.log(err);
    })
});

app.get("/get_trend_data/:stock_id/:time_length", async(req,res)=>
{

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];


    let result = [];
    console.log('Getting request for trends data');

    if(req.params.time_length == "day")
    {
        length = 3;
        timeRes = true;
    } else if(req.params.time_length == "fivedays")
    {
        length = 5;
        timeRes = true;
    } else if(req.params.time_length == "twoweeks")
    {
        length = 14;
        timeRes = true;
    }
    else if(req.params.time_length == "month")
    {
        length = 30;
        timeRes = false;
    } 
    else 
    {
        length = 1;
        timeRes = false;
    }

    googleTrends.interestOverTime({keyword: req.params.stock_id, startTime: new Date(Date.now() - length * 24 * 60 * 60 * 1000), geo: 'US', granularTimeResolution: timeRes})
    .then(function(results){
        JSON.parse(results).default.timelineData.map((data,index) => {
            result.push({
                'data':data.value[0],
                'formattedtime':data.formattedTime
            });
        });

        if(req.params.time_length == "day")
        {
            result = result.slice(result.length - 24, result.length);
            let max = Math.max.apply(Math, result.map(function(o) { return o.data; }));
            for(let i = 0; i < result.length; i++)
            {
                result[i].data = Math.round(result[i].data*(100.0/max));
            }

            res.json(result);

        } else if(req.params.time_length == "fivedays")
        {
            res.json(result);
        } else if(req.params.time_length == "twoweeks" || req.params.time_length == "month")
        {
            
            let lastdaysresults = [];

            googleTrends.interestOverTime({keyword: req.params.stock_id, startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), geo: 'US', granularTimeResolution: true})
            .then(function(daysresults){
                JSON.parse(daysresults).default.timelineData.map((data,index) => {
                    lastdaysresults.push({
                        'data':data.value[0],
                        'formattedtime':data.formattedTime
                    });
                });

                let firstdaytotal = 0;
                for(i = 0; i < 3; i++)
                {
                    let daytotal = 0;
                    for(j = 0; j < 24; j++)
                    {
                        //console.log(lastdaysresults[j+24*i]);
                        daytotal += lastdaysresults[j+24*i];
                    }
                    
                   // console.log('\n');

                    if(firstdaytotal == 0)
                    {
                        firstdaytotal = daytotal;
                    } else 
                    {
                        let d = new Date(Date.now());
                        result.push({data: Math.round(daytotal*(result[result.length]/firstdaytotal)), formattedtime: monthNames[d.getMonth()] + " " + d.getDay() + ", " + d.getFullYear()});              
                    }
                }

                res.json(result);
            })
        }
        else {
            res.json('not found');
        }

        
    })
    .catch(function(err){
      console.error('Oh no there was an error with trends data', err);
    });
});

app.get("/get_reddit_data/:stock_id/:time_length", async(req,res)=>
{
    let time_length = req.params.time_length;

    console.log(time_length);

    if(time_length == "day")
    {
        freq = "hour";
        length = '24h';
    } else if(time_length == 'fivedays')
    {
        freq = 'hour';
        length = '5d';
    } else if(time_length == 'twoweeks')
    {
        freq = 'day';
        length = '14d';
    } else if(time_length == "month")
    {
        freq = 'day'
        length = '30d';
    }
    else 
    {
        freq = 'day';
        length = '7d';
    }

    console.log('Getting request for reddit data');

    let reddit_data_url = `https://api.pushshift.io/reddit/search/comment/?&after=${length}&q=${req.params.stock_id}&aggs=created_utc&size=0&frequency=${freq}`;

    let result = [];
    axios.get(reddit_data_url).then( (response) =>
    {
        result = response.data.aggs.created_utc;

        let max = Math.max.apply(Math, result.map(function(o) { return o.doc_count; }));
        for(let i = 0; i < result.length; i++)
        {
            result[i].doc_count = Math.round(result[i].doc_count/max*(100.0));
        }

        res.json(result);
    })
    .catch(function(err){
      res.json({error: true})
    });
});



//https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=60min&apikey=demo


app.get("/get_stock_data/:stock_id/:time_length", async(req,res)=>
{
    let time_length = req.params.time_length;
    let api_key = `C2TPVTLICUIY7RGA`;

    var slice = "";

    if(time_length == "month")
    {
        slice = "year1month2"
    } 
    else 
    {
        slice = "year1month1"
    }

    console.log('Getting request for stock data');

    let alpha_url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY_EXTENDED&symbol=${req.params.stock_id}&interval=60min&slice=${slice}&apikey=${api_key}`;

    let result = [];
    axios.get(alpha_url).then((response) =>
    {
        var lines = response.data.split(/\r?\n|\r/);

        let limit = 24;
        if(time_length == 'fivedays')
        {   
            limit = 5*16;
        } else if(time_length == 'twoweeks')
        {
            limit = 10*16;
        } else if(time_length == 'month')
        {
            limit = 21*16;
        }

        let last_key = '';
        let count = 0;
        let cur_index = 0;

        for(let i = 1; i < lines.length; i++)
        {
            if(count >= limit)
            {
                break;
            }

            line = lines[i].split(',');

            line[0].replace('\n','');
    
            if(time_length == 'day' || time_length == 'fivedays')
            {
                result.push({time: line[0], val: parseFloat(line[3]), vol: parseInt(line[4])});
            }
            else
            {
                if(last_key == line[0].substr(0,10))
                {
                    result[cur_index].vol += parseInt(line[4]);
                }
                else{
                    result.push({time: line[0].substr(0,10), val: parseFloat(line[3]), vol: parseInt(line[4])});
                } 
            }
    
            last_key = line[0].substr(0,10);
            count++;
        }

        res.json(result);
       
    })
    .catch(function(err){
      res.json({error: true})
    });
});