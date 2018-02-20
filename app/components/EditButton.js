import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import ActionButton from 'react-native-action-button';


export default CreateClass({
    propTypes: {
        isActionButtonVisible: PropTypes.bool.isRequired,
    },

    render() {
        if (!this.props.isActionButtonVisible) {
            return null;
        }
        if (this.props.onPress) {
            return (
                <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right"
                              offsetX={10} offsetY={20} icon={this.props.icon ?
                    this.props.icon : null} onPress={this.props.onPress}/>
            )
        }
        return (
            <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right"
                          offsetX={10} offsetY={20} icon={this.props.icon ?
                this.props.icon : null}>
                {this.props.children}
            </ActionButton>
        )
    }
});


