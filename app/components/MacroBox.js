import React from 'react';
const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Keyboard,
    ScrollView,
    Switch
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import _ from 'lodash';
import Modal from 'react-native-modal';

import {getFontSize} from '../actions/utils';
import GlobalStyle from '../containers/globalStyle';

import MacroBoxDay from './MacroBoxDay';


const MacroBox = CreateClass({
    propTypes: {
        plan: PropTypes.object.isRequired,
        select: PropTypes.func,
        selected: PropTypes.bool
    },

    getInitialState() {
        return {
            name: this.props.plan ? this.props.plan.name : null,
            protein: this.props.plan ? this.props.plan.protein : null,
            showDetails: false,
            selectedDays: []
        }
    },

    _onPress() {
        Keyboard.dismiss();
        this.setState({showDetails: !this.state.showDetails});
    },

    _onDelete() {
        Keyboard.dismiss();
        Alert.alert(
            'Delete Macro Plan',
            `Are you sure you want delete ${this.props.plan.name}?`,
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Delete', onPress: () => this.props.deleteMacroPlan(this.props.plan.id)},
            ]
        );
    },

    _activate(value) {
        Keyboard.dismiss();
        if (value) {
            Alert.alert(
                'Activate Macro Plan',
                `Are you sure you want make '${this.props.plan.name}' active?`,
                [
                    {text: 'Cancel', style: 'cancel'},
                    {text: 'Yes', onPress: () => this.props.select(this.props.plan.id)},
                ]
            );
        }
    },


    render() {
        const plan = this.props.plan;
        let created_at = moment.utc(plan.created_at).local();
        let planDays = _.orderBy(plan.macro_plan_days, ['id']).map((day_plan, x) => {
            return <MacroBoxDay key={x} day_plan={day_plan} selectedDays={day_plan.days}/>
        });
        return (
            <TouchableOpacity style={[styles.container]}
                              activeOpacity={0.8}
                              onPress={this._onPress}>
                <View style={styles.center}>
                    <View style={styles.details}>
                        <Text style={styles.mainText}>{plan.name}</Text>
                        <Text style={styles.date}>
                            <Icon name="clock-o" size={12} color='#4d4d4e'
                            /> {created_at.format('MMM DD, YY')} at {created_at.format('h:mma')}
                        </Text>
                    </View>
                    <Switch value={this.props.selected}
                            onValueChange={this._activate} onTintColor='#00AFA3'/>
                    {/*<TouchableOpacity style={styles.edit} onPress={this._onDelete}>*/}
                        {/*<Icon name="times" size={20} color="red"/>*/}
                    {/*</TouchableOpacity>*/}
                </View>
                <Modal isVisible={this.state.showDetails} style={{justifyContent: 'center'}}>
                    <ScrollView style={styles.innerModal} showsVerticalScrollIndicator={false}>
                        {planDays}
                    </ScrollView>
                    <TouchableOpacity onPress={this._onPress} activeOpacity={1}>
                        <View style={styles.closeButton}>
                            <Text style={{color: 'grey'}}>Close</Text>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </TouchableOpacity>
        );
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderColor: '#e1e3df',
        borderWidth: 1,
        backgroundColor: 'white',
        margin: 10,
        marginBottom: 5,
        borderRadius: 5,
    },
    center: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10
    },
    details: {
        flexDirection: 'column',
        paddingLeft: 10,
        flex: 1
    },
    date: {
        fontSize: getFontSize(12),
        fontFamily: 'Heebo-Medium',
    },
    mainText: {
        fontSize: getFontSize(18),
        backgroundColor: 'transparent',
        color: '#4d4d4e',
        fontFamily: 'Heebo-Medium',
        marginBottom: 5,
        flex: .9
    },
    edit: {
        flex: .06,
        paddingRight: 0
    },
    innerModal: {
        backgroundColor: 'white',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        padding: 5,
        marginBottom: 20
    },
    closeButton: {
        backgroundColor: 'white',
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderTopWidth: .5,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
});

export default MacroBox;
