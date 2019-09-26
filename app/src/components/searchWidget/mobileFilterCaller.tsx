import * as React from 'react';
import { FC } from 'react';
import Box from '@material-ui/core/Box';
import SearchWidgetWrapper from 'components/searchWidget/searchWidgetWrapper';
import { FlightDestinationRequest } from '../../models/request/flightDestinationRequest';
import { Drawer } from '@material-ui/core';

export interface MobileFilterCallerProps {
    onChange: (model: FlightDestinationRequest, selectedAirportLabel: string | null) => void;
    updateDepartureAirport: (departureAirportCode: string) => void;
    initialModel: FlightDestinationRequest;
}

const MobileFilterCaller: FC<{ props: MobileFilterCallerProps }> = ({ props }) => {
    const [state, setState] = React.useState({
        top: false
    });
    
    type DrawerSide = 'top';
    const toggleDrawer = (side: DrawerSide, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        
        setState({ ...state, [side]: open });
    };
    
    return (
        <Box display={{ xs: 'flex', sm: 'none', md: 'none' }}>
            <div id="mobile-filter-caller">
                <div className="filter-container">
                    <button id="filter-btn" className="btn-active btn-icon-left" onClick={toggleDrawer('top', true)}>
                        <span className="filter-text">Filter Results</span>
                        <span className="wj-icon wj-filter"/>
                    </button>
                    <Drawer anchor="top" open={state.top} onClose={toggleDrawer('top', false)}>
                        <SearchWidgetWrapper onChange={props.onChange}
                                             updateDepartureAirport={props.updateDepartureAirport}
                                             initialModel={props.initialModel}/>
                    </Drawer>
                </div>
            </div>
        </Box>
    );
};

export default MobileFilterCaller;
