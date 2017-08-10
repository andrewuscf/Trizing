import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    TouchableOpacity,
    Platform,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';

import * as GlobalActions from '../../actions/globalActions';
import GlobalStyle from '../globalStyle';
import {getFontSize} from '../../actions/utils';

import CustomIcon from '../../components/CustomIcon';

const ProgramList = React.createClass({
    propTypes: {
        Refreshing: React.PropTypes.bool.isRequired,
    },


    componentDidMount() {
        if (!this.props.Schedules.length) this.getNeeded();
    },

    getNeeded(refresh = false) {
        if (this.props.RequestUser.type === 1) {
            this.props.getSchedules('?template=true', refresh);
        }
    },


    _refresh() {
        this.getNeeded(true);
    },

    onEndReached() {
    },

    _redirect(routeName, props = null) {
        this.props.navigation.navigate(routeName, props);
    },

    convertToMap: function () {
        const chatMap = {'Workout Templates': [], 'Messages': []};
        this.props.ChatRooms.forEach((chatroom) => {
            if (chatroom.team || chatroom.activity) {
                chatMap['Group Chats'].push(chatroom);
            } else {
                chatMap['Messages'].push(chatroom);
            }
        });
        return chatMap;

    },

    renderSectionHeader: function (sectionData, category) {
        if (!sectionData.length) return null;

        return <Text style={styles.sectionTitle}>{category}</Text>;
    },


    renderRow(program) {
        let duration = 0;
        program.workouts.forEach((workout) => duration += workout.duration);
        return (
            <TouchableOpacity style={styles.link}
                              onPress={this._redirect.bind(null, 'EditSchedule', {scheduleId: program.id})}>
                <View style={styles.leftSection}>
                    <Text style={styles.simpleTitle}>{program.name}</Text>
                    <View style={styles.row}>
                        <MaterialIcon name="timer" size={getFontSize(18)} style={styles.timerIcon}/>
                        <Text style={styles.smallText}>
                            {duration} {duration === 1 ? 'week' : 'weeks'}
                        </Text>
                    </View>
                </View>
                <MaterialIcon name="keyboard-arrow-right" size={getFontSize(18)}
                              style={styles.linkArrow}/>
            </TouchableOpacity>
        )
    },


    render() {
        const isTrainer = this.props.RequestUser.type === 1;
        const {navigate} = this.props.navigation;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const ProgramsDs = ds.cloneWithRows(_.filter(this.props.Schedules, function (o) {
            return !o.training_plan;
        }));
        return (
            <View style={{flex: 1}}>
                <ListView ref='schedules_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                          refreshControl={<RefreshControl refreshing={this.props.Refreshing}
                                                          onRefresh={this._refresh}/>}
                          enableEmptySections={true} dataSource={ProgramsDs} showsVerticalScrollIndicator={false}
                          renderRow={this.renderRow}
                />
                {isTrainer ?
                    <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right">
                        <ActionButton.Item buttonColor='#3498db' title="New Workout template"
                                           onPress={() => navigate('CreateSchedule')}>
                            <CustomIcon name="barbell" color="white" size={getFontSize(30)}/>
                        </ActionButton.Item>
                    </ActionButton>
                    : null
                }
            </View>
        )
    }
});

ProgramList.navigationOptions = {
    title: 'Workout Programs',
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
        flex: .9,
        margin: 10,
        // flexDirection: 'row'
    },
    link: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderColor: '#e1e3df',
    },
    linkArrow: {
        flex: .1
    }
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        Schedules: state.Global.Schedules,
        Refreshing: state.Global.Refreshing,
    };
};

const dispatchToProps = (dispatch) => {
    return {
        getSchedules: bindActionCreators(GlobalActions.getSchedules, dispatch),
    }
};

export default connect(stateToProps, dispatchToProps)(ProgramList);
