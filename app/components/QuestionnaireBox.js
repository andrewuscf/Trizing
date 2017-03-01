import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import {getFontSize} from '../actions/utils';
import {getRoute} from '../routes';

const QuestionnaireBox = React.createClass({
    propTypes: {
        questionnaire: React.PropTypes.object,
        selectQuestionnaire: React.PropTypes.func.isRequired,
        _redirect: React.PropTypes.func.isRequired,
        selected: React.PropTypes.bool
    },

    _onPress() {
        if (!this.props.questionnaire) {
            this.props.openModal();
        }
    },

    _onLongPress() {
        if (this.props.questionnaire) {
            this.props.selectQuestionnaire(this.props.questionnaire.id)
        }
    },

    _onDelete() {
        Alert.alert(
            'Delete Questionnaire',
            `Are you sure you want delete ${this.props.questionnaire.name}?`,
            [
                {text: 'Cancel', null, style: 'cancel'},
                {text: 'Delete', onPress: () => console.log(this.props.questionnaire.name)},
            ]
        );
    },


    render() {
        const questionnaire = this.props.questionnaire;
        let created_at = null;
        if (questionnaire) {
            created_at = moment.utc(questionnaire.created_at)
        }
        return (
            <TouchableOpacity style={[styles.container]}
                              onPress={this._onPress} onLongPress={this._onLongPress}>
                {!questionnaire ?

                    <View style={styles.center}>
                        <Icon name="plus" size={30} color='black'/>
                        <View style={styles.details}>
                            <Text style={styles.mainText}>Create New</Text>
                        </View>
                    </View>
                    :
                    <View style={styles.center}>
                        {this.props.selected ? <Icon name="check-circle" size={30} color={greenCircle}/> :
                            <Icon name="circle-thin" size={30} color='#bfbfbf'/>}
                        <View style={styles.details}>
                            <Text style={styles.mainText}>{questionnaire.name}</Text>
                            <Text style={styles.date}>
                                <Icon name="clock-o" size={12} color='#4d4d4e'
                                /> {created_at.format('MMM DD, YY')} at {created_at.format('h:mma')}
                            </Text>
                        </View>
                    </View>
                }
                {questionnaire? <TouchableOpacity style={styles.edit} onPress={this._onDelete}>
                    <Icon name="trash-o" size={20} color='#4d4d4e'/>
                </TouchableOpacity>
                    : null
                }
            </TouchableOpacity>
        );
    }
});

const greenCircle = '#22c064';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        borderBottomWidth: 1,
        borderColor: '#e1e3df',
        paddingTop: 10,
        paddingBottom: 10,
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
        right: 0,
        top: 10
    }
});

export default QuestionnaireBox;
