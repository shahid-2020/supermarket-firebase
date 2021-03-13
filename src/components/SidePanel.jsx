import React from 'react';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import './SidePanel.scss';

function SidePanel({switchHandler}) {

    const iconStyle = {
        color: '#fff',
        fontSize: 25
    }

    return (
        <div className='sidepanel'>
            {switchHandler &&
            <div className="sidepanel__group">
            <CompareArrowsIcon style={iconStyle} />
            <p className="sidepanel__group-content" onClick={switchHandler} >Switch</p>
        </div>}
        </div>
    );
}

export default SidePanel;
