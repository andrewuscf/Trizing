import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import {getFontSize} from '../actions/utils';
import {getRoute} from '../routes';

var {height, width} = Dimensions.get('window');

const QuestionnaireBox = React.createClass({
    propTypes: {
        questionnaire: React.PropTypes.object
    },

    _onPress() {
        if (this.props.questionnaire) {

        } else {
            console.log('no questionnaire')
        }
    },


    render() {
        const questionnaire = this.props.questionnaire;
        return (
            <TouchableOpacity style={styles.container} onPress={this._onPress}>
                <Text>test</Text>
            </TouchableOpacity>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        width: (width/2) - 20,
        margin: 10,
        height: 150,
        borderBottomWidth: .5,
        borderColor: '#e1e3df',
    },
});

export default QuestionnaireBox;
