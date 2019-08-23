import * as React from 'react';
import './dateInput.scss';
import '../../common.scss';
import Dateunknown from "./dateunknown";

export enum datePanelTypes {
    SPECIFIC_DATES = "SPECIFIC_DATES",
    UNKNOWN_DATES = "UNKNOWN_DATES",
}

class ExpandedDatePanel extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            datePanelType: datePanelTypes.UNKNOWN_DATES // selected by default
        };
    };

    selectPanel(panelType: datePanelTypes) {
        this.setState({
            datePanelType: panelType
        });
    }

    render() {
        return (
            <div className='date-panel-expanded' >
                <div className="top-toogler">
                    <div className="dates-selector middle-text"
                        onClick={() => this.selectPanel(datePanelTypes.SPECIFIC_DATES)}>
                        <div>Specific Dates</div>
                    </div>
                    <div className="dates-selector middle-text"
                        onClick={() => this.selectPanel(datePanelTypes.UNKNOWN_DATES)}
                    >
                        <div>Flexible Dates</div>
                    </div>
                </div>
                {this.state.datePanelType === datePanelTypes.SPECIFIC_DATES && (
                    <div className="specific-dates-main-area">
                        specific dates calendar goes here...
                    </div>
                )}
                {this.state.datePanelType === datePanelTypes.UNKNOWN_DATES && (
                    <div className="flexible-dates-main-area">
                       <Dateunknown/>
                    </div>
                )}
            </div>
        );
    };
}

export default ExpandedDatePanel;