import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    Alert,
    ListView,
    Platform
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import moment from 'moment';
import ActionButton from 'react-native-action-button';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

import * as GlobalActions from '../../actions/globalActions';
import {getFontSize} from '../../actions/utils';


import CustomIcon from '../../components/CustomIcon';


const EditSchedule = React.createClass({
    propTypes: {
        scheduleId: React.PropTypes.number.isRequired,
    },

    getInitialState() {
        const schedule = _.find(this.props.Schedules, {id: this.props.scheduleId});
        return {
            schedule: schedule
        }
    },

    componentDidMount() {
        const schedule = _.find(this.props.Schedules, {id: this.props.scheduleId});
        if (schedule) {
            this.props.navigation.setParams({headerTitle: schedule.name});
            this.setState({schedule: schedule});
        }
    },

    asyncActions(data = {}){
        if (data.deleted) {
            this.props.navigation.goBack();
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.props.Schedules !== prevProps.Schedules) {
            const schedule = _.find(this.props.Schedules, {id: this.props.scheduleId});
            this.props.navigation.setParams({headerTitle: schedule.name});
            this.setState({schedule: schedule});
        }
    },

    _deleteSchedule() {
        Keyboard.dismiss();
        Alert.alert(
            'Delete Schedule',
            `Are you sure you want delete this schedule?`,
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete',
                    onPress: () => this.props.actions.deleteSchedule(this.props.scheduleId, this.asyncActions)
                },
            ]
        );
    },


    _onDuplicate() {

    },

    renderHeader() {
        return null;
    },

    renderRow(workout, index) {
        const parseIndex = parseInt(index);
        let start_date = moment.utc(workout.dates.start_date).local();
        const {navigate} = this.props.navigation;
        return (
            <TouchableOpacity key={parseIndex} onPress={() => navigate('EditWorkout', {workoutId: workout.id})}
                              style={[styles.workoutBox]}>

                <View style={styles.titleView}>
                    <Text style={styles.simpleTitle}>{workout.name}</Text>
                    <Menu>
                        <MenuTrigger>
                            <FontIcon name="ellipsis-h" size={getFontSize(35)}/>
                        </MenuTrigger>
                        <MenuOptions customStyles={optionsStyles}>
                            <MenuOption onSelect={() => navigate('CreateWorkout', {
                                scheduleId: this.props.scheduleId,
                                template_workout: workout
                            })}
                                        text='Duplicate'/>
                        </MenuOptions>
                    </Menu>
                </View>

                <View style={styles.dateSection}>
                    <View style={{flexDirection: 'row', alignItems: 'center', flex: .3}}>
                        <CustomIcon name="stopwatch" style={styles.day}/>
                        {this.state.schedule.training_plan ?
                            <Text style={styles.day}> {start_date.format("MMM DD")}</Text>
                            :
                            <Text
                                style={styles.day}> {workout.duration} {workout.duration === 1 ? 'week' : 'weeks'}</Text>
                        }
                    </View>
                </View>

            </TouchableOpacity>
        );
    },

    renderFooter(rowCount) {
        if (rowCount !== 0) return null;
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
                <MaterialIcon name="today" style={[styles.notBold, {fontSize: getFontSize(40), paddingBottom: 20}]}/>
                <Text style={[styles.notBold, {fontSize: getFontSize(22)}]}>Get started by</Text>
                <Text style={[styles.notBold, {fontSize: getFontSize(22)}]}>creating workout blocks</Text>
            </View>
        )
    },


    render: function () {
        if (!this.state.schedule) return null;

        const {navigate} = this.props.navigation;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(_.orderBy(this.state.schedule.workouts, ['order']));
        return (
            <View style={styles.flexCenter}>
                <ListView removeClippedSubviews={(Platform.OS !== 'ios')}
                          keyboardShouldPersistTaps="handled"
                          showsVerticalScrollIndicator={false}
                          style={[styles.flexCenter]}
                          contentContainerStyle={{paddingBottom: 20}}
                          enableEmptySections={true}
                          dataSource={dataSource}
                          renderHeader={this.renderHeader}
                          renderRow={this.renderRow}
                          renderFooter={this.renderFooter.bind(null, dataSource.getRowCount())}
                />
                <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right">
                    <ActionButton.Item buttonColor='#F22525' title="Delete"
                                       onPress={this._deleteSchedule}>
                        <MaterialIcon name="delete-forever" color="white" size={22}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#3498db' title="Add Block"
                                       onPress={() => navigate('CreateWorkout', {scheduleId: this.props.scheduleId})}>
                        <MaterialIcon name="add" color="white" size={22}/>
                    </ActionButton.Item>
                </ActionButton>
            </View>
        )
    }
});

const optionsStyles = {
    optionsContainer: {
        paddingTop: 5,
    },
    optionsWrapper: {},
    optionWrapper: {
        margin: 5,
    },
    optionTouchable: {
        activeOpacity: 70,
    },
    optionText: {},
};

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
        backgroundColor: '#f1f1f3'
    },
    title: {
        fontSize: getFontSize(28),
        fontFamily: 'Heebo-Bold',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    workoutBox: {
        flex: 1,
        borderColor: '#e1e3df',
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
        margin: 10,
        marginBottom: 5,
        borderRadius: 5,
    },
    notBold: {
        color: 'grey',
        fontFamily: 'Heebo-Medium',
    },
    dateSection: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        paddingTop: 5,
        borderColor: '#e1e3df',
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    simpleTitle: {
        fontSize: getFontSize(18),
        fontFamily: 'Heebo-Bold',
        marginLeft: 5
    },
    day: {
        fontSize: getFontSize(12),
        fontFamily: 'Heebo-Medium',
        color: 'grey'
    },
});


const stateToProps = (state) => {
    return state.Global;
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(EditSchedule);
