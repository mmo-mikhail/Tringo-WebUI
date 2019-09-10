import React from 'react';
import { FC } from 'react';




const NumOfPeople :FC<{}>= () => {

    const [Adults, setAdults] = React.useState(process.env.REACT_APP_DEFAULT_ADULT?parseInt(process.env.REACT_APP_DEFAULT_ADULT):100);
    const [Children, setChildren] = React.useState(process.env.REACT_APP_DEFAULT_CHILDREN?parseInt(process.env.REACT_APP_DEFAULT_CHILDREN):100);
    const [Infants, setInfants] = React.useState(process.env.REACT_APP_DEFAULT_INFANTS?parseInt(process.env.REACT_APP_DEFAULT_INFANTS):100);
    return (
        <div>
            <button onClick={()=>setAdults(Adults+1)}>{Adults}</button>
            <button onClick={()=>setChildren(Children+1)}>{Children}</button>
            <button onClick={()=>setInfants(Infants+1)}>{Infants}</button>
            
        </div>
    );
};



export default NumOfPeople;