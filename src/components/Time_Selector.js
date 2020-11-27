import React, {useState} from 'react';
import Select from 'react-select';
import { withRouter, useHistory } from 'react-router-dom';

function Time_Selector()
{
    const [length, setLength] = useState({label: "5 Days", value: 'fivedays'});
    const [name, setName] = useState('');

    const onSubmit = data => console.log(data);

    const history = useHistory();

    const options = [
            { value: 'day', label: '24 Hours' },
            { value: 'fivedays', label: '5 Days' },
            { value: 'twoweeks', label: '14 Days' },
            { value: 'month', label: '30 Days' },
          ]
    
    
    const divStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    }

    const selectStyle = {
        width: "100%"
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        history.push(`/analyze/${name}/${length.value}`);
    }

    const handleTextChange = event =>{
        setName(event.target.value);
    }

    return (
        <div style={divStyle}>
            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    onChange={handleTextChange}
                    placeholder="Input Stock Name"
                />

            <div style={selectStyle}>
                <Select
                    name="reactSelect"
                    onChange={setLength}
                    defaultValue={{label: "5 Days", value: 'fivedays'}}
                    options={options} 
                />
            </div>
                

                <button type="submit">Submit</button>
            </form>
        </div>
    )

}

export default withRouter(Time_Selector);