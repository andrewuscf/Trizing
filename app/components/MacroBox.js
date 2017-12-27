import React from 'react';

const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Switch
} from 'react-native';
import _ from 'lodash';

import {getFontSize} from '../actions/utils';


const MacroBox = CreateClass({
    propTypes: {
        plan: PropTypes.object.isRequired,
        navigate: PropTypes.func.isRequired,
        select: PropTypes.func,
        deleteMacroPlan: PropTypes.func,
        selected: PropTypes.bool
    },

    getInitialState() {
        return {
            name: this.props.plan ? this.props.plan.name : null,
            protein: this.props.plan ? this.props.plan.protein : null,
            selectedDays: []
        }
    },

    _onPress() {
        this.props.navigate('MacroPlanDetail', {macro_plan: this.props.plan});
    },

    _onDelete() {
        if (this.props.deleteMacroPlan) {
            Alert.alert(
                'Delete Macro Plan',
                `Are you sure you want delete ${this.props.plan.name}?`,
                [
                    {text: 'Cancel', style: 'cancel'},
                    {text: 'Delete', onPress: () => this.props.deleteMacroPlan(this.props.plan.id)},
                ]
            );
        }
    },

    _activate(value) {
        if (value) {
            Alert.alert(
                'Activate Macro Plan',
                `Are you sure you want make ${this.props.plan.name} active?`,
                [
                    {text: 'Cancel', style: 'cancel'},
                    {text: 'Yes', onPress: () => this.props.select(this.props.plan.id)},
                ]
            );
        }
    },


    render() {
        const plan = this.props.plan;
        let averageCarbs = _.meanBy(plan.macro_plan_days, 'carbs');
        let averageFat = _.meanBy(plan.macro_plan_days, 'fats');
        let averageProtein = _.meanBy(plan.macro_plan_days, 'protein');
        return (
            <TouchableOpacity style={styles.link} onPress={this._onPress} onLongPress={this._onDelete}>

                <View style={styles.leftSection}>
                    <Text style={[styles.simpleTitle, {padding: '2%'}]}>
                        {plan.name}
                    </Text>
                    {/*<Text style={styles.date}>*/}
                    {/*{created_at.format('MMM DD, YY')} at {created_at.format('h:mma')}*/}
                    {/*</Text>*/}
                    <View style={[styles.row, {borderColor: '#e1e3df', borderTopWidth: 1, padding: '2%'}]}>
                        <Text style={styles.smallText}>Fats: </Text>
                        <Text style={{textAlign: 'center', paddingRight: '2%'}}>
                            {averageFat}
                        </Text>
                        <Text style={styles.smallText}>Carbs: </Text>
                        <Text style={{textAlign: 'center', paddingRight: '2%'}}>
                            {averageCarbs}
                        </Text>
                        <Text style={styles.smallText}>Protein: </Text>
                        <Text style={{textAlign: 'center', paddingRight: '2%'}}>
                            {averageProtein}
                        </Text>
                    </View>
                </View>
                <Switch value={this.props.selected}
                        onValueChange={this._activate} onTintColor='#00AFA3'/>
            </TouchableOpacity>
        )
    }
});


const styles = StyleSheet.create({
    link: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#e1e3df',
        padding: 10,
        backgroundColor: 'white',
        margin: 10,
        marginBottom: 0,
        borderRadius: 7,
        flexWrap: 'wrap'
    },
    date: {
        fontSize: getFontSize(12),
        fontFamily: 'Heebo-Regular',
        marginLeft: 5,
        marginBottom: 5,
    },
    simpleTitle: {
        fontSize: getFontSize(18),
        fontFamily: 'Heebo-Medium',
    },
    smallText: {
        fontSize: getFontSize(12),
        color: '#b1aea5',
        fontFamily: 'Heebo-Medium',
        textAlign: 'center'
    },
    leftSection: {
        flex: 1,
        flexWrap: 'wrap'
    },
    row: {
        flexDirection: 'row'
    },
});

export default MacroBox;
