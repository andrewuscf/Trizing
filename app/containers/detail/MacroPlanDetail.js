import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import _ from 'lodash';

import {getFontSize} from '../../actions/utils';

import MacroBoxDay from '../../components/MacroBoxDay';
import SubmitButton from '../../components/SubmitButton';


const MacroPlanDetail = React.createClass({
    propTypes: {
        macro_plan: React.PropTypes.object.isRequired,
    },


    _onCreate() {
        Keyboard.dismiss();
        if (this.verify()) {
        }
    },


    _onDelete() {
        Keyboard.dismiss();
        Alert.alert(
            'Delete Macro Plan',
            `Are you sure you want delete ${this.props.plan.name}?`,
            [
                {text: 'Cancel', null, style: 'cancel'},
                {text: 'Delete', onPress: () => this.props.deleteMacroPlan(this.props.plan.id)},
            ]
        );
    },


    render() {
        const plan = this.props.macro_plan;
        let created_at = moment.utc(plan.created_at).local()
        const planDays = _.orderBy(plan.macro_plan_days, ['id']).map((day_plan, x) => {
            return <MacroBoxDay key={x}
                                getDayState={this.getDayState}
                                day_plan={day_plan}
                                selectedDays={day_plan.days}/>
        });
        return (
            <ScrollView style={[styles.container]} >
                <View style={styles.center}>
                    <View style={styles.details}>
                        <Text style={styles.mainText}>{plan.name}</Text>
                        <Text style={styles.date}>
                            <Icon name="clock-o" size={12} color='#4d4d4e'
                            /> {created_at.format('MMM DD, YY')} at {created_at.format('h:mma')}
                        </Text>
                    </View>
                </View>
                {planDays}
            </ScrollView>
        );
    }
});

const greenCircle = '#22c064';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#e1e3df',
        marginTop: 10,
        backgroundColor: 'white'
    },
    center: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10
    },
    details: {
        flexDirection: 'column',
        paddingLeft: 18
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
    smallText: {
        fontSize: getFontSize(12),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        color: '#4d4d4e',
        fontFamily: 'OpenSans-Semibold'
    },
    edit: {
        position: 'absolute',
        right: 0,
        top: 10
    },
    createButton: {
        backgroundColor: '#00BFFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        bottom: 0,
    },
});

export default MacroPlanDetail;
