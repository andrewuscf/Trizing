import React from 'react';

const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    Platform,
    LayoutAnimation,
    AppState
} from 'react-native';
import FCM, {
    FCMEvent,
} from 'react-native-fcm';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import moment from 'moment';
import {Circle} from 'react-native-progress';


import * as HomeActions from '../actions/homeActions';
import * as GlobalActions from '../actions/globalActions';

import {getFontSize, calCalories} from '../actions/utils';
import GlobalStyle from './globalStyle';


import CustomIcon from '../components/CustomIcon';
import EditButton from '../components/EditButton';
import Loading from '../components/Loading';
import NotificationBox from '../components/NotificationBox';
import WeightGraph from '../components/WeightGraph';
import PeopleBar from '../components/PeopleBar';
import SubmitButton from '../components/SubmitButton';


const Home = CreateClass({
    propTypes: {
        Refreshing: PropTypes.bool.isRequired,
        HomeIsLoading: PropTypes.bool.isRequired,
    },

    getInitialState() {
        return {
            dataDate: moment(),
            isActionButtonVisible: true,
            weightTimeFrame: 'month',
            appState: AppState.currentState
        }
    },

    componentDidMount() {
        this.setUpNotifications();
        this.props.actions.getActiveData(this.state.dataDate.format("YYYY-MM-DD"), true);
        if (this.props.RequestUser.type === 1) {
            this.props.actions.getClients(true);
        } else if (this.props.RequestUser.type === 2) {
            // this.props.actions.getWeightLogs(this.state.weightTimeFrame, true);
        }

        this.props.navigation.setParams({
            right: (
                <TouchableOpacity onPress={() => this.props.navigation.navigate('MyProfile')} style={[{paddingRight: 10}]}>
                    <FontIcon size={getFontSize(25)} name="user-circle-o"/>
                </TouchableOpacity>
            )
        });
    },

    componentDidUpdate(prevProps, prevState) {
        const user = this.props.RequestUser;
        if (this.props.Notifications && this.props.Notifications.length && Platform.OS === 'ios') {
            let unreadcount = 0;
            this.props.Notifications.forEach((notification) => {
                if (notification.unread) {
                    unreadcount = unreadcount + 1;
                }
            });
            if (FCM) FCM.setBadgeNumber(unreadcount);
        }
        if ((!!user && !!prevProps.RequestUser &&
                (user.profile.active_macro_plan !== prevProps.RequestUser.profile.active_macro_plan ||
                    user.profile.active_program !== prevProps.RequestUser.profile.active_program))
            || (prevState.dataDate !== this.state.dataDate)) {
            this.props.actions.getActiveData(this.state.dataDate.format("YYYY-MM-DD"), true);
        }
    },

    setUpNotifications() {
        const self = this;
        FCM.requestPermissions();
        FCM.getFCMToken().then(token => {
            if (token) self.props.actions.setDeviceForNotification(token);
        });
        this.notificationListener = FCM.on(FCMEvent.Notification, async (notification) => {
            const action = notification.action ? JSON.parse(notification.action) : null;

            if (action && notification.user && notification.id) {
                const newNotification = {
                    ...notification,
                    action: action,
                    user: JSON.parse(notification.user),
                    id: parseInt(action.id),
                    unread: notification.unread === "true"
                };
                this.props.actions.addNewNotification(newNotification);
            }

            if (notification.opened_from_tray && action) {

                if (action.action_object.profile)
                    this.props.navigation.navigate('Profile', {id: action.action_object.id});
                else if (action.action_object.room)
                    this.props.navigation.navigate('ChatRoom', {roomId: action.action_object.room});
                else if (action.action_object.macro_plan || action.action_object.questionnaire || action.action_object.workout) {
                    this.props.navigation.navigate('Profile', {id: action.action_object.client});
                } else if (action.action_object.liked_by) {
                    // console.log('this is a post')
                } else if (action.action_object.from_user) {
                    this.props.navigation.navigate('Profile', {
                        id: action.action_object.from_user.id,
                        request: action.action_object
                    });
                } else if (action.action_object.event_type) {
                    this.props.navigation.navigate('EventDetail', {eventId: action.action_object.id});
                } else if (action.action_object.macro_plan_days) {
                    this.props.navigation.navigate('MacroPlanDetail', {macro_plan: action.action_object});
                } else if (action.action_object.macro_plan_day) {
                    this.props.navigation.navigate('MacroLogDetail', {macro_log: action.action_object});
                } else if (action.action_object.workouts) {
                    this.props.navigation.navigate('ScheduleDetail', {schedule: action.action_object});
                } else if (action.action_object.questions) {
                    if (action.verb.toLowerCase().indexOf('answered') === -1) {
                        this.props.navigation.navigate('AnswerQuestionnaire', {questionnaire: action.action_object});
                    } else {
                        this.props.navigation.navigate('AnswersDisplay', {
                            questionnaire: action.action_object,
                            client: action.actor
                        })
                    }
                }
                FCM.removeAllDeliveredNotifications();
            } else if (!notification.opened_from_tray && action) {
                console.log(action)
                // if (action.object_type === 'message') {
                //     this.props.addMessageToChatRoom(action.action_object, true);
                //     FCM.removeAllDeliveredNotifications();
                // }
            }
        });
        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
            if (token) self.props.actions.setDeviceForNotification(token);
        });
        AppState.addEventListener('change', this._handleAppStateChange);
    },

    componentWillUnmount() {
        this.notificationListener.remove();
        this.refreshTokenListener.remove();
    },

    _handleAppStateChange(nextAppState) {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.props.actions.getActiveData(this.state.dataDate.format("YYYY-MM-DD"), true);
        }
        this.setState({appState: nextAppState});
    },


    _refresh() {
        if (this.props.RequestUser.type === 1) {
            this.props.actions.getClients(true);
        } else {
            // this.props.actions.getWeightLogs(this.state.weightTimeFrame, true);
        }
        this.props.actions.getActiveData(this.state.dataDate.format("YYYY-MM-DD"), true);
    },

    _redirect(routeName, props = null) {
        this.props.navigation.navigate(routeName, props);
    },

    _toLogWorkout(data) {
        if (data && data.training_day && !data.training_day.logged_today) {
            this._redirect('WorkoutDaySession', {
                workout_day: data.training_day,
                date: this.state.dataDate.format("YYYY-MM-DD")
            })
        }
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

    addDay() {
        const newDate = this.state.dataDate.add(1, 'day');
        this.setState({
            dataDate: newDate
        });
        // if (!_.find(this.props.ActiveData, {date: this.state.dataDate.format("YYYY-MM-DD")})) {
        //     this.props.actions.getActiveData(newDate.format("YYYY-MM-DD"), false)
        // }
    },

    subtractDay() {
        const newDate = this.state.dataDate.subtract(1, 'day');
        this.setState({
            dataDate: newDate
        });
        // if (!_.find(this.props.ActiveData, {date: this.state.dataDate.format("YYYY-MM-DD")})) {
        //     this.props.actions.getActiveData(newDate.format("YYYY-MM-DD"), false)
        // }
    },

    changeTimeFrame(timeFrame) {
        if (this.state.weightTimeFrame !== timeFrame) {
            this.setState({weightTimeFrame: timeFrame});
            // this.props.actions.getWeightLogs(timeFrame)
        }
    },

    render() {
        const user = this.props.RequestUser;
        if (!user) return <Loading/>;
        const isTrainer = user.type === 1;
        let content = null;
        const {navigate} = this.props.navigation;
        const today = moment();
        const data = _.find(this.props.ActiveData, {date: this.state.dataDate.format("YYYY-MM-DD")});

        let calories = 0;
        let fats = 0;
        let protein = 0;
        let carbs = 0;

        let currentCarbs;
        let currentProtein;
        let currentCal;
        let currentFats = currentCarbs = currentProtein = currentCal = 0;
        if (data && data.macro_plan_day) {
            fats = (data.macro_plan_day.fats) ? data.macro_plan_day.fats : 0;
            protein = (data.macro_plan_day.protein) ? data.macro_plan_day.protein : 0;
            carbs = (data.macro_plan_day.carbs) ? data.macro_plan_day.carbs : 0;
            calories = calCalories(fats, carbs, protein);

            currentFats = data.macro_plan_day.current_logs.fats;
            currentCarbs = data.macro_plan_day.current_logs.carbs;
            currentProtein = data.macro_plan_day.current_logs.protein;
            currentCal = calCalories(currentFats, currentCarbs, currentProtein);
        }

        if (isTrainer) {
            content = (
                <View>
                    <View style={[styles.box]}>
                        <View style={styles.boxHeader}>
                            <FontIcon name="users" size={getFontSize(22)}/>
                            <Text style={styles.formCalories}>
                                Clients
                            </Text>
                        </View>
                        {this.props.Clients.length ?
                            <PeopleBar navigate={navigate} people={this.props.Clients}
                                       style={{borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}/> :
                            <View>
                                <Text style={styles.textTitle}>Get started by adding new clients.</Text>
                                <SubmitButton onPress={() => navigate('ManageClients')} text="ADD CLIENTS"
                                              buttonStyle={styles.logButton}/>
                            </View>
                        }
                    </View>
                </View>
            )
        } else {
            //
            // let weightLogs = this.props.WeightLogs.month.results;
            // if (this.state.weightTimeFrame === 'three_months') {
            //     weightLogs = this.props.WeightLogs.three_months.results;
            // } else if (this.state.weightTimeFrame === 'year') {
            //     weightLogs = this.props.WeightLogs.year.results;
            // }

            content = (
                <View>
                    {!data && !this.props.HomeIsLoading ?
                        <View style={styles.emptyClients}>
                            <Text style={styles.emptyClientsText}>Get started by finding a trainer</Text>
                            <Text style={styles.emptyClientsText}>or workout program.</Text>
                        </View>
                        : null
                    }
                </View>
            );

        }

        return (
            <View style={GlobalStyle.container}>
                <ScrollView ref='home_scroll' showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl refreshing={this.props.Refreshing}
                                                            onRefresh={this._refresh}/>}
                            onScroll={this._onScroll}
                            scrollEventThrottle={15}
                            contentContainerStyle={{paddingBottom: 80}}
                            style={styles.scrollView}>

                    <View style={[styles.todayTitle, {justifyContent: 'space-between'}]}>
                        <TouchableOpacity onPress={this.subtractDay} style={styles.arrowStyle}>
                            <MaterialIcon name="keyboard-arrow-left" size={getFontSize(24)} color='#00AFA3'/>
                        </TouchableOpacity>
                        <View style={styles.todayTitle}>
                            <MaterialIcon size={24} color='#00AFA3' name="date-range"/>
                            <Text style={[styles.textTitle, {fontFamily: 'Heebo-Bold', color: '#00AFA3'}]}>
                                {this.state.dataDate.isSame(today, 'd') ? 'TODAY' : this.state.dataDate.format('ddd, MMM DD').toUpperCase()}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={this.addDay} style={styles.arrowStyle}>
                            <MaterialIcon name="keyboard-arrow-right" size={getFontSize(24)} color='#00AFA3'/>
                        </TouchableOpacity>
                    </View>
                    {content}
                    {data && data.macro_plan_day ?
                        <View style={[styles.box, {marginBottom: 5}]}>
                            <View style={[styles.boxHeader, {justifyContent: 'space-between'}]}>
                                <View style={styles.mainHeader}>
                                    <MaterialIcon name="donut-small" size={getFontSize(22)}/>
                                    <Text style={styles.formCalories}>
                                        Nutrition Plan
                                    </Text>
                                </View>
                                <Text style={styles.viewAll} onPress={() => navigate('MacroPlanList')}>
                                    View All
                                </Text>
                            </View>
                            <View style={[styles.row, {alignItems: 'center'}]}>
                                <View style={[styles.calorieBox, {justifyContent: 'flex-end'}]}>
                                    <View style={{paddingRight: 10}}>
                                        <Text
                                            style={{fontFamily: 'Heebo-Medium', textAlign: 'right'}}>CAL</Text>
                                        <Text style={{
                                            fontFamily: 'Heebo-Medium',
                                            textAlign: 'right'
                                        }}>EATEN</Text>
                                    </View>
                                    <Text style={{
                                        fontFamily: 'Heebo-Bold',
                                        color: 'black',
                                        fontSize: 20,
                                    }}>{currentCal}</Text>
                                </View>
                                <View style={{flex: .1}}/>
                                <View style={[styles.calorieBox]}>
                                    <Text style={{
                                        fontFamily: 'Heebo-Bold',
                                        color: 'black',
                                        fontSize: 20
                                    }}>{calories - currentCal}</Text>
                                    <View style={{paddingLeft: 10}}>
                                        <Text style={{fontFamily: 'Heebo-Medium', textAlign: 'left'}}>CAL</Text>
                                        <Text
                                            style={{fontFamily: 'Heebo-Medium', textAlign: 'right'}}>LEFT</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.row, {
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: 10,
                                paddingBottom: 10
                            }]}>
                                <View style={styles.details}>
                                    <Circle size={getFontSize(60)}
                                            progress={currentFats !== 0 ? (currentFats / fats) : currentFats}
                                            unfilledColor={unfilledColor} borderWidth={0} color="#1fc16c"
                                            thickness={5} formatText={() => "Fats"} showsText={true}/>
                                    <Text
                                        style={[styles.smallText, (fats - currentFats < 0) ? GlobalStyle.redText : null]}>
                                        {`${(fats - currentFats).toFixed(0)}g ${(fats - currentFats < 0) ? 'over' : 'left'}`}
                                    </Text>
                                </View>
                                <View style={styles.details}>
                                    <Circle size={getFontSize(60)}
                                            progress={currentCarbs !== 0 ? (currentCarbs / carbs) : currentCarbs}
                                            unfilledColor={unfilledColor} borderWidth={0} color="#a56dd1"
                                            thickness={5} formatText={() => "Carbs"} showsText={true}/>
                                    <Text
                                        style={[styles.smallText, (carbs - currentCarbs < 0) ? GlobalStyle.redText : null]}>
                                        {`${(carbs - currentCarbs).toFixed(0)}g ${(carbs - currentCarbs < 0) ? 'over' : 'left'}`}
                                    </Text>
                                </View>
                                <View style={styles.details}>
                                    <Circle size={getFontSize(60)}
                                            progress={currentProtein !== 0 ? (currentProtein / protein) : currentProtein}
                                            unfilledColor={unfilledColor} borderWidth={0} color="#07a8e2"
                                            thickness={5} formatText={() => "Protein"} showsText={true}/>
                                    <Text
                                        style={[styles.smallText, (protein - currentProtein < 0) ? GlobalStyle.redText : null]}>
                                        {`${(protein - currentProtein).toFixed(0)}g ${(protein - currentProtein < 0) ? 'over' : 'left'}`}
                                    </Text>
                                </View>
                            </View>
                            <SubmitButton onPress={this._redirect.bind(null, 'CreateMacroLog', {
                                macro_plan_day: data.macro_plan_day,
                                date: this.state.dataDate
                            })} text="LOG NUTRITION" buttonStyle={styles.logButton}/>

                        </View>
                        :
                        <View style={[styles.box]}>
                            <View style={[styles.boxHeader, {justifyContent: 'space-between'}]}>
                                <View style={styles.mainHeader}>
                                    <MaterialIcon name="donut-small" size={getFontSize(22)}/>
                                    <Text style={styles.formCalories}>
                                        Nutrition Plan
                                    </Text>
                                </View>
                                <Text style={styles.viewAll} onPress={() => navigate('MacroPlanList')}>
                                    View All
                                </Text>
                            </View>
                            <Text style={styles.textTitle}>No Nutrition Plan Today</Text>
                            <SubmitButton onPress={() => navigate('CreateMacroPlan')} text="CREATE PLAN"
                                          buttonStyle={styles.logButton}/>
                        </View>
                    }
                    {data && data.training_day ?
                        <View style={[styles.box]}>
                            <View style={[styles.boxHeader, {justifyContent: 'space-between'}]}>
                                <View style={styles.mainHeader}>
                                    <MaterialIcon name="directions-run" size={getFontSize(22)}/>
                                    <Text style={styles.formCalories}>
                                        Workout
                                    </Text>
                                </View>
                                <Text style={styles.viewAll} onPress={() => navigate('ProgramList')}>
                                    View All
                                </Text>
                            </View>
                            <View style={[{marginLeft: 40, paddingTop: 5}]}>
                                <Text style={{
                                    fontSize: getFontSize(18),
                                    fontFamily: 'Heebo-Medium'
                                }}>{data.training_day.name}</Text>
                                <View style={[styles.boxHeader, {paddingLeft: 10, borderBottomWidth: 0}]}>
                                    <FontIcon name="circle" size={getFontSize(8)} color="grey"/>
                                    <Text style={styles.h2Title}>
                                        {data.training_day.exercises.length} {data.training_day.exercises.length === 1 ? 'Exercise' : 'Exercises'}
                                    </Text>
                                </View>
                            </View>

                            {!data.training_day.logged_today ?
                                <SubmitButton onPress={this._toLogWorkout.bind(null, data)} text="START WORKOUT"
                                              buttonStyle={styles.logButton}/>
                                : null
                            }

                        </View>
                        :
                        <View style={[styles.box]}>
                            <View style={[styles.boxHeader, {justifyContent: 'space-between'}]}>
                                <View style={styles.mainHeader}>
                                    <MaterialIcon name="directions-run" size={getFontSize(22)}/>
                                    <Text style={styles.formCalories}>
                                        Workout
                                    </Text>
                                </View>
                                <Text style={[{
                                    paddingRight: 10, textDecorationLine: 'underline', fontFamily: 'Heebo-Bold',
                                    color: 'black'
                                }]} onPress={() => navigate('ProgramList')}>
                                    View All
                                </Text>
                            </View>
                            <Text style={styles.textTitle}>No Workout Today</Text>
                            <SubmitButton onPress={() => navigate('ProgramList')} text="MY PROGRAMS"
                                          buttonStyle={styles.logButton}/>
                        </View>
                    }
                    {this.state.dataDate.isSameOrBefore(today, 'd') ? <View style={[styles.box]}>
                        <View style={[styles.boxHeader, {justifyContent: 'space-between'}]}>
                            <View style={styles.mainHeader}>
                                <MaterialIcon name="update" size={getFontSize(22)}/>
                                <Text style={styles.formCalories}>
                                    Updates
                                </Text>
                            </View>
                            <Text style={styles.viewAll} onPress={() => navigate('Notifications')}>
                                View All
                            </Text>
                        </View>
                        {!data || !data.notifications.length ?
                            <Text style={styles.textTitle}>No updates today</Text> :
                            data.notifications.map((notification, i) => <NotificationBox key={i}
                                                                                         navigate={this.props.navigation.navigate}
                                                                                         notification={notification}
                                                                                         readNotification={this.props.readNotification}/>)
                        }
                    </View> : null
                    }
                </ScrollView>


                <EditButton icon={<MaterialIcon name="search" size={getFontSize(20)} color="white"/>}
                            isActionButtonVisible={this.state.isActionButtonVisible}>
                    <ActionButton.Item buttonColor='#FD795B' title="Find Workouts"
                                       onPress={() => navigate('FindPrograms')}>
                        <CustomIcon name="weight" size={getFontSize(22)} color="white"/>
                    </ActionButton.Item>
                    {/*{isTrainer ?*/}
                    {/*<ActionButton.Item buttonColor='#FD795B' title="Surveys"*/}
                    {/*onPress={() => navigate('SurveyList')}>*/}
                    {/*<MaterialIcon name="question-answer" size={getFontSize(22)} color="white"/>*/}
                    {/*</ActionButton.Item>*/}
                    {/*: <View/>*/}
                    {/*}*/}
                    <ActionButton.Item buttonColor='#FD795B'
                                       title={isTrainer ? "Clients" : "Trainers"}
                                       onPress={() => navigate('ManageClients')}>
                        <CustomIcon name="users" color="white" size={getFontSize(22)}/>
                    </ActionButton.Item>

                </EditButton>
            </View>
        )
    }
});

const unfilledColor = 'rgba(0, 0, 0, 0.1)';

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f2f3f8'
    },
    row: {
        flexDirection: 'row',
    },
    sectionTitle: {
        fontSize: getFontSize(20),
        fontFamily: 'Heebo-Bold',
    },
    details: {
        flexDirection: 'column',
        flex: 1,
        paddingTop: 5,
        alignItems: 'center'
    },
    boxHeader: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: .5,
        borderColor: '#e1e3df'
    },
    formCalories: {
        fontFamily: 'Heebo-Bold',
        fontSize: getFontSize(18),
        color: 'black',
        paddingLeft: 10,
    },
    calorieBox: {
        flex: .45,
        padding: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: unfilledColor,
        flexDirection: 'row'
    },
    logButton: {
        margin: 10,
        marginLeft: 0,
        marginRight: 0,
        width: 150,
        alignSelf: 'center',
        borderRadius: 30,
        height: 35,
    },
    box: {
        justifyContent: 'center',
        margin: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    textTitle: {
        fontSize: getFontSize(16),
        // fontFamily: 'Heebo-Bold',
        color: '#7f7f7f',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        alignSelf: 'center'
    },
    h2Title: {
        fontFamily: 'Heebo-Medium',
        paddingLeft: 5,
        color: '#b1aea5',
    },
    topBar: {
        height: Platform.OS === 'ios' ? 44 : 56,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
    },
    topItem: {
        flex: 3.3,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    todayTitle: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    emptyClients: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        // borderColor: '#e1e3df',
        // borderBottomWidth: 1
    },
    emptyClientsText: {
        fontSize: getFontSize(20),
        fontFamily: 'Heebo-Medium',
        color: 'rgba(0, 175, 163, 1)'
    },
    arrowStyle: {
        // borderColor: '#00AFA3',
        backgroundColor: 'white',
        // borderWidth: .5,
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 10,
        padding: 8,
        justifyContent: 'center'
    },
    smallText: {
        paddingTop: 5,
        color: '#00AFA3',
    },
    weightChangeButton: {
        borderColor: 'blue',
        borderWidth: .5,
        flex: 1 / 3,
        alignItems: 'center'
    },
    viewAll: {
        paddingRight: 10,
        textDecorationLine: 'underline',
        fontFamily: 'Heebo-Bold',
        color: 'black'
    },
    mainHeader: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        ...state.Home
    };
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(HomeActions, dispatch),
        readNotification: bindActionCreators(GlobalActions.readNotification, dispatch),
    }
};

export default connect(stateToProps, dispatchToProps)(Home);
