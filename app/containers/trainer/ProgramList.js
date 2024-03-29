import React from 'react';

const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    TouchableOpacity,
    Platform,
    LayoutAnimation,
    Alert,
    Switch
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';

import * as GlobalActions from '../../actions/globalActions';
import GlobalStyle from '../globalStyle';
import {getFontSize, isATrainer} from '../../actions/utils';

import CustomIcon from '../../components/CustomIcon';
import Loading from '../../components/Loading';

const ProgramList = CreateClass({
    propTypes: {
    },

    getInitialState() {
        return {
            isActionButtonVisible: true,
            isTrainer: isATrainer(this.props.RequestUser.type),
            refresh: false
        }
    },

    componentDidMount() {
        this.getNeeded(true);
    },


    _listViewOffset: 0,

    _onScroll(event) {
        const CustomLayoutLinear = {
            duration: 100,
            create: {type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity},
            update: {type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity},
            delete: {type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity}
        };
        const currentOffset = event.nativeEvent.contentOffset.y;
        const direction = (currentOffset > 0 && currentOffset > this._listViewOffset) ? 'down' : 'up';
        const isActionButtonVisible = direction === 'up';
        if (isActionButtonVisible !== this.state.isActionButtonVisible) {
            LayoutAnimation.configureNext(CustomLayoutLinear);
            this.setState({isActionButtonVisible})
        }
        this._listViewOffset = currentOffset;
    },

    getNeeded(refresh = false) {
        if (isATrainer(this.props.RequestUser.type)) {
            this.props.getSchedules('?template=true', refresh);
        } else {
            this.props.getSchedules('', refresh);
        }
    },

    _refresh() {
        this.getNeeded(true);
    },

    onEndReached() {
    },

    convertToMap() {
        const workoutMap = {'My Programs': [], 'Trainer Programs': []};
        this.props.Schedules.forEach((program) => {
            if (program.trainer.id === this.props.RequestUser.id) {
                workoutMap['My Programs'].push(program);
            } else {
                workoutMap['Trainer Programs'].push(program);
            }
        });
        return workoutMap;
    },

    renderSectionHeader(sectionData, category) {
        if (!sectionData.length) return null;
        return (
            <View style={[{backgroundColor: 'white', marginLeft: 10}]}>
                <Text style={styles.sectionTitle}>{category}</Text>
            </View>
        );
    },

    goToProgram(program) {
        if (isATrainer(this.props.RequestUser.type) || program.trainer.id === this.props.RequestUser.id) {
            this.props.navigation.navigate('EditSchedule', {scheduleId: program.id});
        } else {
            this.props.navigation.navigate('ScheduleDetail', {schedule: program});
        }
    },

    _activate(program) {
        Alert.alert(
            'Activate Workout Program?',
            `This will override any your current program. Programs can be overwritten by trainers.`,
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Yes', onPress: () => this.props.activateSchedule(program.id)},
            ]
        );
    },

    onSwitchChange(value, program) {
        if (value) {
            this._activate(program)
        }
    },


    renderRow(program) {
        let duration = 0;
        program.workouts.forEach((workout) => duration += workout.duration);
        return (
            <TouchableOpacity style={styles.link} onPress={this.goToProgram.bind(null, program)}>

                <View style={styles.leftSection}>
                    <Text style={[styles.simpleTitle, {padding: '2%'}]}>{program.name}</Text>
                    <View style={[styles.row, {borderColor: '#e1e3df', borderTopWidth: 1, padding: '2%'}]}>
                        <MaterialIcon name="timer" size={getFontSize(18)} style={styles.timerIcon}/>
                        <Text style={styles.smallText}>
                            {duration} {duration === 1 ? 'week' : 'weeks'}
                        </Text>
                    </View>
                </View>
                <Switch value={this.props.RequestUser.profile.active_program === program.id}
                        style={{alignSelf: 'center'}}
                        onValueChange={(value) => this.onSwitchChange(value, program)} onTintColor='#00AFA3'/>
            </TouchableOpacity>
        )
    },

    renderHeader() {
        return null;
    },

    renderFooter() {
        const length = this.props.Schedules.length;
        if (length > 0 || this.props.SchedulesLoading) return null;
        return (
            <View style={styles.empty}>
                <CustomIcon name="weight" size={getFontSize(60)} color="#b1aea5"/>
                <Text style={styles.emptyText}>
                    You currently have no workout programs.
                </Text>
            </View>
        )
    },


    render() {
        if (this.props.SchedulesLoading) {
            return (
                <View style={GlobalStyle.container}>
                    {this.renderHeader()}
                    <Loading/>
                </View>
            )
        }
        const {navigate} = this.props.navigation;
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });
        const ProgramsDs = ds.cloneWithRowsAndSections(this.convertToMap());
        return (
            <View style={GlobalStyle.container}>
                <ListView ref='schedules_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                          refreshControl={<RefreshControl refreshing={this.state.refresh}
                                                          onRefresh={this._refresh}/>}
                          enableEmptySections={true} dataSource={ProgramsDs} showsVerticalScrollIndicator={false}
                          renderRow={this.renderRow}
                          renderHeader={this.renderHeader}
                          onScroll={this._onScroll}
                          renderFooter={this.renderFooter}
                          renderSectionHeader={this.renderSectionHeader}
                          contentContainerStyle={{paddingBottom: 100}}
                />
                {this.state.isActionButtonVisible ?
                    <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right"
                                  offsetX={10} offsetY={20}
                                  onPress={() => navigate('CreateSchedule')}/>
                    : null
                }
            </View>
        )
    }
});

ProgramList.navigationOptions = {
    title: 'My Programs',
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    timerIcon: {
        color: '#b1aea5',
        alignSelf: 'center',
        paddingRight: 5
    },
    simpleTitle: {
        fontSize: getFontSize(18),
        fontFamily: 'Heebo-Medium',
    },
    smallText: {
        fontSize: getFontSize(12),
        color: '#b1aea5',
        fontFamily: 'Heebo-Medium',
    },
    leftSection: {
        flex: 1,
    },
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
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20
    },
    emptyText: {
        fontSize: getFontSize(22),
        color: '#b1aeb9',
        textAlign: 'center',
        paddingTop: 20,
        fontFamily: 'Heebo-Medium'
    },
    sectionTitle: {
        paddingTop: 5,
        paddingLeft: 10,
        fontSize: getFontSize(22),
        fontFamily: 'Heebo-Bold',
    }
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        Schedules: state.Global.Schedules,
        UserToken: state.Global.UserToken,
        SchedulesLoading: state.Global.SchedulesLoading
    };
};

const dispatchToProps = (dispatch) => {
    return {
        getSchedules: bindActionCreators(GlobalActions.getSchedules, dispatch),
        activateSchedule: bindActionCreators(GlobalActions.activateSchedule, dispatch),
    }
};

export default connect(stateToProps, dispatchToProps)(ProgramList);
