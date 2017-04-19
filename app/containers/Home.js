import React from 'react';
import Subscribable from 'Subscribable';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    Platform
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import FCM from 'react-native-fcm';

import * as HomeActions from '../actions/homeActions';
import * as GlobalActions from '../actions/globalActions';

import {getRoute} from '../routes';
import {getFontSize} from '../actions/utils';
import GlobalStyle from './globalStyle';

import NotificationBox from '../components/NotificationBox';
import PeopleBar from '../components/PeopleBar';


const Home = React.createClass({
    mixins: [Subscribable.Mixin],
    propTypes: {
        Refreshing: React.PropTypes.bool.isRequired,
        openModal: React.PropTypes.func.isRequired
    },

    scrollToTopEvent(args) {
        if (args.routeName == 'Home') this.refs.home_scroll.scrollTo({y: 0, true});
    },

    componentDidMount() {
        this.addListenerOn(this.props.events, 'scrollToTopEvent', this.scrollToTopEvent);
        if (!this.props.Clients.length) {
            this.getNeeded(true);
        }
        // this.getToken();
    },

    componentDidUpdate(prevProps) {
        if (this.props.Notifications && this.props.Notifications.length && Platform.OS === 'ios') {
            let unreadcount = 0;
            this.props.Notifications.forEach((notification, i) => {
                if (notification.unread) {
                    unreadcount = unreadcount + 1;
                }
            });
            FCM.setBadgeNumber(unreadcount);
        }
    },

    getNeeded(refresh = false) {
        if (this.props.RequestUser.type == 1) {
            this.props.actions.getClients(refresh);
            this.props.getSchedules('?template=true', refresh);
            this.props.getQuestionnaires(refresh);
        } else {
            this.props.actions.getActiveData(refresh);
        }
        if (refresh) {
            this.props.getNotifications(refresh);
        }
    },

    // getToken() {
    //     const self = this;
    //     FCM.requestPermissions(); // for iOS
    //     FCM.getFCMToken().then(token => {
    //         if (token) self.props.actions.setDeviceForNotification(token);
    //     });
    // },


    _refresh() {
        this.getNeeded(true);
    },

    onEndReached() {
        console.log('End reach')
    },

    _redirect(routeName, props = null) {
        this.props.navigator.push(getRoute(routeName, props));
    },


    render() {
        const user = this.props.RequestUser;
        const isTrainer = user.type == 1;
        let content = null;
        if (isTrainer) {
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            const QuestionnaireDS = ds.cloneWithRows(this.props.Questionnaires);
            const SchedulesDs = ds.cloneWithRows(_.filter(this.props.Schedules, function (o) {
                return !o.training_plan;
            }));
            content = (
                <View>
                    <PeopleBar navigator={this.props.navigator} people={this.props.Clients}
                               manageClients={this._redirect.bind(null, 'ManageClients', null)}/>

                    <View style={[styles.box]}>
                        <Text style={styles.textTitle}>Program Templates</Text>
                        <ListView ref='schedules_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                                  style={styles.container} enableEmptySections={true} dataSource={SchedulesDs}
                                  renderRow={(schedule) =>
                                      <TouchableOpacity style={styles.link}
                                                        onPress={this._redirect.bind(null, 'EditSchedule', {scheduleId: schedule.id})}>
                                          <Text style={styles.simpleTitle}>{schedule.name}</Text>
                                          <Icon name="angle-right" size={getFontSize(18)} style={styles.linkArrow}/>
                                      </TouchableOpacity>
                                  }
                        />
                        <TouchableOpacity onPress={this._redirect.bind(null, 'CreateSchedule', null)}
                                          style={styles.link}>
                            <Text style={styles.simpleTitle}>Create Program Template</Text>
                            <Icon name="plus" size={getFontSize(18)} style={styles.linkArrow}/>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.box]}>
                        <Text style={styles.textTitle}>Surveys</Text>
                        <ListView ref='survey_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                                  style={styles.container} enableEmptySections={true} dataSource={QuestionnaireDS}
                                  renderRow={(survey) =>
                                      <TouchableOpacity style={styles.link}>
                                          <Text style={styles.simpleTitle}>{survey.name}</Text>
                                          <Icon name="angle-right" size={getFontSize(18)} style={styles.linkArrow}/>
                                      </TouchableOpacity>
                                  }
                        />
                        <TouchableOpacity onPress={this.props.openModal} style={styles.link}>
                            <Text style={styles.simpleTitle}>Create Survey</Text>
                            <Icon name="plus" size={getFontSize(18)} style={styles.linkArrow}/>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else {
            const data = this.props.ActiveData;
            if (data) {
                console.log(data)
                let calories = 0;
                if (data.macro_plan_day) {
                    const fats = (data.macro_plan_day.fats) ? data.macro_plan_day.fats : 0;
                    const protein = (data.macro_plan_day.protein) ? data.macro_plan_day.protein : 0;
                    const carbs = (data.macro_plan_day.carbs) ? data.macro_plan_day.carbs : 0;
                    calories = (9 * fats) + (4 * protein) + (4 * carbs);
                }
                content = (
                    <View>
                        {data.macro_plan_day ?
                            <View style={[styles.box, {marginBottom: 5, marginTop: 0}]}>
                                <Text style={styles.textTitle}>{`Today`}</Text>
                                <View style={[styles.row, {justifyContent: 'space-between', alignItems: 'center'}]}>
                                    <View style={styles.details}>
                                        <Text style={styles.sectionTitle}>Carbs</Text>
                                        <Text style={styles.smallText}>{`${data.macro_plan_day.carbs}g`}</Text>
                                    </View>
                                    <View style={styles.details}>
                                        <Text style={styles.sectionTitle}>Fats</Text>
                                        <Text style={styles.smallText}>{`${data.macro_plan_day.fats}g`}</Text>
                                    </View>
                                    <View style={styles.details}>
                                        <Text style={styles.sectionTitle}>Protein</Text>
                                        <Text style={styles.smallText}>{`${data.macro_plan_day.protein}g`}</Text>
                                    </View>
                                </View>
                                <Text style={styles.formCalories}>
                                    Calories: {calories}
                                </Text>
                                <TouchableOpacity
                                    onPress={this._redirect.bind(null, 'CreateMacroLog', {macro_plan_day: data.macro_plan_day.id})}
                                    style={styles.link}>
                                    <Text style={styles.simpleTitle}>Log Nutrition</Text>
                                    <Icon name="angle-right" size={getFontSize(18)} style={styles.linkArrow}/>
                                </TouchableOpacity>
                            </View>
                            : null
                        }
                        {data.training_day ?
                            <TouchableOpacity activeOpacity={.6} style={[styles.box, {
                                marginBottom: 5,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} onPress={this._redirect.bind(null, 'WorkoutDaySession', {workout_day: data.training_day})}>
                                <Text style={styles.textTitle}>{`Today's Workout`}</Text>
                                <Text style={styles.h2Title}>{data.training_day.name}</Text>
                                <Text>Exercises: {data.training_day.exercises.length}</Text>
                                <Text>Start Workout</Text>

                            </TouchableOpacity>
                            :
                            <View style={[styles.box, {
                                marginBottom: 5,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]}>
                                <Text style={styles.textTitle}>No Workout Today</Text>
                            </View>
                        }

                    </View>
                )
            } else {
                content = null;
            }

        }
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const dataSource = ds.cloneWithRows(this.props.Notifications.slice(0, 4));
        return (
            <View style={GlobalStyle.container}>
                <ScrollView ref='home_scroll'
                            refreshControl={<RefreshControl refreshing={this.props.Refreshing}
                                                            onRefresh={this._refresh}/>}
                            style={styles.scrollView} contentContainerStyle={styles.contentContainerStyle}>

                    {content}
                    {dataSource.getRowCount() > 0 ?
                        <View style={styles.box}>
                            <ListView ref='notification_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                                      style={styles.container} enableEmptySections={true} dataSource={dataSource}
                                      renderRow={(notification) => <NotificationBox
                                          navigator={this.props.navigator} notification={notification}
                                          readNotification={this.props.readNotification}/>}
                            />
                            <TouchableOpacity onPress={this._redirect.bind(null, 'Notifications', null)}
                                              style={styles.link}>
                                <Text style={styles.simpleTitle}>View All Notifications</Text>
                                <Icon name="angle-right" size={getFontSize(18)} style={styles.linkArrow}/>
                            </TouchableOpacity>
                        </View>
                        : null
                    }
                </ScrollView>
            </View>
        )
    }
});


const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#f1f1f1'
    },
    contentContainerStyle: {
        backgroundColor: '#f1f1f1'
    },
    row: {
        flexDirection: 'row',
    },
    sectionTitle: {
        fontSize: getFontSize(20),
        lineHeight: getFontSize(26),
        fontFamily: 'OpenSans-Bold',
    },
    details: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: 3,
        paddingBottom: 3,
        alignItems: 'center'
    },
    formCalories: {
        fontFamily: 'OpenSans-Bold',
        alignSelf: 'center',
        padding: 10,
        fontSize: getFontSize(22),
    },
    box: {
        marginTop: 5,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5,
        borderColor: '#e1e3df',
    },
    textTitle: {
        fontSize: getFontSize(26),
        fontFamily: 'OpenSans-Bold',
        margin: 10,
        alignSelf: 'center'
    },
    h2Title: {
        fontSize: getFontSize(22),
        fontFamily: 'OpenSans-SemiBold',
    },
    simpleTitle: {
        fontSize: getFontSize(18),
        color: '#b1aea5',
        fontFamily: 'OpenSans-Semibold',
        margin: 10,
        flex: 17
    },
    link: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        borderTopWidth: 0.5,
        borderColor: '#e1e3df',
    },
    linkArrow: {
        flex: 1
    },
    listItemText: {
        color: '#4d4d4e',
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        fontFamily: 'OpenSans-Semibold',
        textDecorationLine: 'underline'
    }
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        Questionnaires: state.Global.Questionnaires,
        Schedules: state.Global.Schedules,
        ...state.Home
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(HomeActions, dispatch),
        getNotifications: bindActionCreators(GlobalActions.getNotifications, dispatch),
        readNotification: bindActionCreators(GlobalActions.readNotification, dispatch),
        getQuestionnaires: bindActionCreators(GlobalActions.getQuestionnaires, dispatch),
        getSchedules: bindActionCreators(GlobalActions.getSchedules, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(Home);
