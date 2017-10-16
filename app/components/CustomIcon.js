import React from 'react';
const CreateClass = require('create-react-class');

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../assets/TrizingFont.json';
const Icon = createIconSetFromIcoMoon(icoMoonConfig);

const CustomIcon = CreateClass({
    render() {
        return (
            <Icon name={this.props.name} style={this.props.style} size={this.props.size} color={this.props.color}/>
        );
    }
});

export default CustomIcon;