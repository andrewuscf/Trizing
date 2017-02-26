import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {getFontSize} from '../actions/utils';
import {getRoute} from '../routes';

var {height, width} = Dimensions.get('window');

const QuestionnaireBox = React.createClass({
    propTypes: {
        questionnaire: React.PropTypes.object,
        selectQuestionnaire: React.PropTypes.func.isRequired,
        selected: React.PropTypes.bool
    },

    _onPress() {
        if (this.props.questionnaire) {
            this.props.selectQuestionnaire(this.props.questionnaire.id)
        } else {
            console.log('no questionnaire')
        }
    },


    render() {
        const questionnaire = this.props.questionnaire;
        return (
            <TouchableOpacity style={[styles.container, (this.props.selected) ? styles.selectedBox : null]}
                              onPress={this._onPress}>
                {!questionnaire ?

                    <View style={styles.center}>
                        <Icon name="plus-square" size={55} color='black'/>
                        <Text style={styles.mainText}>Create New</Text>
                    </View>
                    :
                    <View style={styles.center}>
                        <Icon name="list-ol" size={55} color='black'/>
                        <Text style={styles.mainText}>{questionnaire.name}</Text>
                    </View>
                }
            </TouchableOpacity>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        width: (width / 2) - 20,
        margin: 10,
        height: 150,
        borderWidth: .5,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectedBox: {
        borderColor: 'blue',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainText: {
        paddingTop: 10
    }
});

export default QuestionnaireBox;
