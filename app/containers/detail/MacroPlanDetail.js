import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ListView,
    Alert,
    Keyboard,
    RefreshControl,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import _ from 'lodash';

import {getFontSize} from '../../actions/utils';

import BackBar from '../../components/BackBar';
import MacroBoxDay from '../../components/MacroBoxDay';
import SubmitButton from '../../components/SubmitButton';


const MacroPlanDetail = React.createClass({
    propTypes: {
        macro_plan: React.PropTypes.object.isRequired,
    },

    getInitialState(){
        return {
            daily_logs: [],
            refreshing: false,
        }
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

    renderHeader() {
        const plan = this.props.macro_plan;
        let created_at = moment.utc(plan.created_at).local();
        const planDays = _.orderBy(plan.macro_plan_days, ['id']).map((day_plan, x) => {
            console.log(moment().day())
            return <MacroBoxDay key={x} day_plan={day_plan} selectedDays={day_plan.days}
                                active={!!(plan.is_active && _.includes(day_plan.days, moment().day()))}/>
        });
        return (
            <View>
                <BackBar back={this.props.navigator.pop}/>
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
            </View>
        )
    },


    render() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(this.state.daily_logs);
        return (
            <ListView ref='daily_logs' removeClippedSubviews={(Platform.OS !== 'ios')}
                      keyboardShouldPersistTaps="handled"
                      refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh}/>}
                      renderHeader={this.renderHeader}
                      style={styles.container} enableEmptySections={true}
                      dataSource={dataSource}
                      renderRow={(log, sectionID, rowID) =>
                          <Text>test</Text>
                      }
            />
        );
    }
});

const greenCircle = '#22c064';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#e1e3df',
        backgroundColor: 'white'
    },
    center: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#e1e3df',
        padding: 10
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
