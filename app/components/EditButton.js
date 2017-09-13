import React from 'react';
import ActionButton from 'react-native-action-button';


export default React.createClass({
    propTypes: {
        isActionButtonVisible: React.PropTypes.bool.isRequired,
    },

    render() {
        if (!this.props.isActionButtonVisible) {
            return null;
        }
        if (this.props.onPress) {
            return (
                <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right" icon={this.props.icon ?
                    this.props.icon : null} onPress={this.props.onPress}/>
            )
        }
        return (
            <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right" icon={this.props.icon ?
                this.props.icon : null}>
                {this.props.children}
            </ActionButton>
        )
    }
});


