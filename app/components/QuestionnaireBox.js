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
import moment from 'moment';

import {getFontSize} from '../actions/utils';
import {getRoute} from '../routes';

var {height, width} = Dimensions.get('window');

const QuestionnaireBox = React.createClass({
    propTypes: {
        questionnaire: React.PropTypes.object,
        selectQuestionnaire: React.PropTypes.func.isRequired,
        _redirect: React.PropTypes.func.isRequired,
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
        let created_at = null;
        if (questionnaire) {
            created_at = moment.utc(questionnaire.created_at)
        }
        return (
            <TouchableOpacity style={[styles.container, (this.props.selected) ? styles.selectedBox : null]}
                              onPress={this._onPress}>
                {!questionnaire ?

                    <View style={styles.center}>
                        <Icon name="plus" size={30} color='black'/>
                        <View style={styles.details}>
                            <Text style={styles.mainText}>Create New</Text>
                        </View>
                    </View>
                    :
                    <View style={styles.center}>
                        <Icon name="list-ol" size={30} color='black' style={{marginLeft: -2}}/>
                        <View style={styles.details}>
                            <Text style={styles.mainText}>{questionnaire.name}</Text>
                            <Text style={styles.date}>Created: {created_at.format('MMM DD, YY')}</Text>
                        </View>
                    </View>
                }
            </TouchableOpacity>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        borderWidth: .5,
        borderColor: '#e1e3df',
        padding: 10
    },
    selectedBox: {
        borderColor: '#1352e2'
    },
    center: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 100
    },
    details: {
        flexDirection: 'column',
        paddingLeft: 18,
    },
    date: {
        fontSize: getFontSize(15),
        lineHeight: getFontSize(26),
    },
    mainText: {
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        color: '#4d4d4e',
        fontFamily: 'OpenSans-Semibold'
    },
    edit: {
        position: 'absolute',
        right: 0
    }
});

export default QuestionnaireBox;
