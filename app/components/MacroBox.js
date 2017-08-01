import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Keyboard,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import _ from 'lodash';
import Modal from 'react-native-modal';

import {getFontSize} from '../actions/utils';

import MacroBoxDay from './MacroBoxDay';


const MacroBox = React.createClass({
    propTypes: {
        plan: React.PropTypes.object.isRequired,
        select: React.PropTypes.func,
        selected: React.PropTypes.bool
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

    _activate() {
        Keyboard.dismiss();
        Alert.alert(
            'Activate Macro Plan',
            `Are you sure you want make '${this.props.plan.name}' active?`,
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Yes', onPress: () => this.props.select(this.props.plan.id)},
            ]
        );
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
                    {this.props.selected ? <Icon name="check-circle" size={30} color={greenCircle}/> :
                        <TouchableOpacity onPress={this._activate}>
                            <Icon name="circle-thin" size={30} color='#bfbfbf'/>
                        </TouchableOpacity>}
                    <View style={styles.details}>
                        <Text style={styles.mainText}>{plan.name}</Text>
                        <Text style={styles.date}>
                            <Icon name="clock-o" size={12} color='#4d4d4e'
                            /> {created_at.format('MMM DD, YY')} at {created_at.format('h:mma')}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.edit} onPress={this._onDelete}>
                        <Icon name="times" size={20} color="red"/>
                    </TouchableOpacity>
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
        paddingLeft: 18,
        flexWrap: 'wrap',
        flex: 1
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
        fontFamily: 'Heebo-Medium',
        marginBottom: 5,
        flex: .9
    },
    edit: {
        flex: .05,
        paddingLeft: 10,
        paddingRight: 10
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
