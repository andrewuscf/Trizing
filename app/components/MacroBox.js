import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import {getFontSize} from '../actions/utils';
import {getRoute} from '../routes';

const MacroBox = React.createClass({
    propTypes: {
        plan: React.PropTypes.object,
        training_plan: React.PropTypes.number.isRequired,
        selectMacroPlan: React.PropTypes.func.isRequired,
        _redirect: React.PropTypes.func.isRequired,
        selected: React.PropTypes.bool,
    },

    _onPress() {
        if (this.props.plan) {
            this.props.selectMacroPlan(this.props.questionnaire.id)
        } else {
            this.props._redirect('CreateMacroPlan', {training_plan_id: this.props.training_plan})
        }
    },

    _onEdit() {
        console.log('edit hit')
    },


    render() {
        const plan = this.props.plan;
        let created_at = null;
        if (plan) {
            created_at = moment.utc(plan.created_at)
        }
        return (
            <TouchableOpacity style={[styles.container, (this.props.selected) ? styles.selectedBox : null]}
                              onPress={this._onPress}>
                {!plan ?

                    <View style={styles.center}>
                        <Icon name="plus" size={30} color='#1352e2'/>
                        <View style={styles.details}>
                            <Text style={styles.mainText}>Create Macro New</Text>
                        </View>
                    </View>
                    :
                    <View style={styles.center}>
                        <Icon name="cutlery" size={30} color='#1352e2'/>
                        <View style={styles.details}>
                            <Text style={styles.mainText}>{plan.name}</Text>
                            <Text style={styles.date}>Created: {created_at.format('MMM DD, YY')}</Text>
                        </View>
                        <TouchableOpacity onPress={this._onEdit}>
                            <Icon style={styles.edit} name="ellipsis-v" size={30} color='#4d4d4e'/>
                        </TouchableOpacity>
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
    },
    details: {
        flexDirection: 'column',
        paddingLeft: 18,
    },
    date: {
        fontSize: getFontSize(15),
        lineHeight: getFontSize(16),
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

export default MacroBox;
