import React, {Component} from 'react';

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../assets/TrizingFont.json';
const Icon = createIconSetFromIcoMoon(icoMoonConfig);

const CustomIcon = React.createClass({
    render() {
        return (
            <Icon name={this.props.name} style={this.props.style} size={this.props.size} color={this.props.color}/>
        );
    }
});

export default CustomIcon;