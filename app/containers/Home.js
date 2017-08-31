import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    Platform
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import IconBadge from 'react-native-icon-badge';
import ActionButton from 'react-native-action-button';
import moment from 'moment';
import {Circle} from 'react-native-progress';


import * as HomeActions from '../actions/homeActions';
import * as GlobalActions from '../actions/globalActions';

import {getFontSize, calCalories} from '../actions/utils';
import GlobalStyle from './globalStyle';


import CustomIcon from '../components/CustomIcon';
import Loading from '../components/Loading';
import PeopleBar from '../components/PeopleBar';
import SubmitButton from '../components/SubmitButton';


const Home = React.createClass({
    propTypes: {
        Refreshing: React.PropTypes.bool.isRequired,
        HomeIsLoading: React.PropTypes.bool.isRequired,
    },

    getInitialState() {
        return {
            dataDate: moment(),
        }
    },


    componentDidMount() {
        if (this.props.RequestUser.type === 1 && !this.props.Clients.length) {
            this.getNeeded();
        } else if (this.props.RequestUser.type === 2 && !this.props.ActiveData.length) {
            this.props.actions.getActiveData(this.state.dataDate.format("YYYY-MM-DD"), false)
        }
    },

    getNeeded(refresh = false) {
        if (this.props.RequestUser.type === 1) {
            this.props.actions.getClients(refresh);
        }
        this.props.actions.getActiveData(this.state.dataDate.format("YYYY-MM-DD"), refresh);
        if (refresh) {
            this.props.getNotifications(refresh);
        }
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

    renderNotifications() {
        const unread_count = _.filter(this.props.Notifications, function (o) {
            return o.unread;
        }).length;
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Notifications')}
                              style={[{paddingLeft: 10}]}>
                {unread_count ?
                    <IconBadge
                        MainElement={
                            <MaterialIcon name="notifications" size={getFontSize(30)}/>
                        }
                        BadgeElement={
                            <Text style={{color: '#FFFFFF', fontSize: getFontSize(12)}}>{unread_count}</Text>
                        }

                        IconBadgeStyle={
                            {top: 0}
                        }

                    /> :
                    <MaterialIcon name="notifications" size={getFontSize(30)}/>
                }
            </TouchableOpacity>
        )
    },

    addDay() {
        const isTrainer = this.props.RequestUser.type === 1;
        const newDate = this.state.dataDate.add(1, 'day');
        this.setState({
            dataDate: newDate
        });
        if (!_.find(this.props.ActiveData, {date: this.state.dataDate.format("YYYY-MM-DD")}) && !isTrainer) {
            this.props.actions.getActiveData(newDate.format("YYYY-MM-DD"), false)
        }
    },

    subtractDay() {
        const isTrainer = this.props.RequestUser.type === 1;
        const newDate = this.state.dataDate.subtract(1, 'day');
        this.setState({
            dataDate: newDate
        });
        if (!_.find(this.props.ActiveData, {date: this.state.dataDate.format("YYYY-MM-DD")}) && !isTrainer) {
            this.props.actions.getActiveData(newDate.format("YYYY-MM-DD"), false)
        }
    },


    render() {
        const user = this.props.RequestUser;
        if (!user || this.props.HomeIsLoading) return <Loading/>;
        const isTrainer = user.type === 1;
        let content = null;
        const {navigate} = this.props.navigation;
        const today = moment();
        const data = _.find(this.props.ActiveData, {date: this.state.dataDate.format("YYYY-MM-DD")});
        if (isTrainer) {
            content = (
                <View>
                    {this.props.Clients.length ?
                        <View>
                            <Text style={{paddingLeft: 12, paddingBottom: 5, paddingTop: 5, fontFamily: 'Heebo-Bold'}}>
                                Clients
                            </Text>
                            <PeopleBar navigate={navigate} people={this.props.Clients}/>
                        </View>
                        : <View style={styles.emptyClients}>
                            <Text style={styles.emptyClientsText}>Get started by adding new clients.</Text>
                        </View>
                    }
                </View>
            )
        } else {
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

            content = (
                <View>
                    {!data && !this.props.Loading_Active ?
                        <View style={styles.emptyClients}>
                            <Text style={styles.emptyClientsText}>Get started by finding a trainer</Text>
                            <Text style={styles.emptyClientsText}>or workout program.</Text>
                        </View>
                        : null
                    }
                    {!this.props.Loading_Active ?
                        <View>
                            {data && data.macro_plan_day ?
                                <View style={[styles.box, {marginBottom: 5}]}>
                                    <View style={styles.boxHeader}>
                                        <MaterialIcon name="donut-small" size={getFontSize(22)}/>
                                        <Text style={styles.formCalories}>
                                            NUTRITION PLAN
                                        </Text>
                                    </View>
                                    <View style={[styles.row, {alignItems: 'center'}]}>
                                        <View style={[styles.calorieBox, {justifyContent: 'flex-end'}]}>
                                            <View style={{paddingRight: 20}}>
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
                                                fontSize: getFontSize(24),
                                            }}>{currentCal}</Text>
                                        </View>
                                        <View style={{flex: .1}}/>
                                        <View style={[styles.calorieBox]}>
                                            <Text style={{
                                                fontFamily: 'Heebo-Bold',
                                                color: 'black',
                                                fontSize: getFontSize(24)
                                            }}>{calories - currentCal}</Text>
                                            <View style={{paddingLeft: 20}}>
                                                <Text style={{fontFamily: 'Heebo-Medium', textAlign: 'left'}}>CAL</Text>
                                                <Text
                                                    style={{fontFamily: 'Heebo-Medium', textAlign: 'left'}}>LEFT</Text>
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
                                            <Circle size={getFontSize(60)} progress={currentFats / fats}
                                                    unfilledColor={unfilledColor} borderWidth={0} color="#1fc16c"
                                                    thickness={5} formatText={() => "Fats"} showsText={true}/>
                                            <Text
                                                style={[styles.smallText, (fats - currentFats < 0) ? GlobalStyle.redText : null]}>
                                                {`${fats - currentFats}g left`}
                                            </Text>
                                        </View>
                                        <View style={styles.details}>
                                            <Circle size={getFontSize(60)} progress={currentProtein / protein}
                                                    unfilledColor={unfilledColor} borderWidth={0} color="#07a8e2"
                                                    thickness={5} formatText={() => "Protein"} showsText={true}/>
                                            <Text
                                                style={[styles.smallText, (protein - currentProtein < 0) ? GlobalStyle.redText : null]}>
                                                {`${protein - currentProtein}g left`}
                                            </Text>
                                        </View>
                                        <View style={styles.details}>
                                            <Circle size={getFontSize(60)} progress={currentCarbs / carbs}
                                                    unfilledColor={unfilledColor} borderWidth={0} color="#a56dd1"
                                                    thickness={5} formatText={() => "Carbs"} showsText={true}/>
                                            <Text
                                                style={[styles.smallText, (carbs - currentCarbs < 0) ? GlobalStyle.redText : null]}>
                                                {`${carbs - currentCarbs}g left`}
                                            </Text>
                                        </View>
                                    </View>
                                    <SubmitButton onPress={this._redirect.bind(null, 'CreateMacroLog', {
                                        macro_plan_day: data.macro_plan_day,
                                        date: this.state.dataDate
                                    })} text="LOG NUTRITION" buttonStyle={styles.logButton}/>

                                </View>
                                : <View
                                    style={[styles.box, {
                                        marginBottom: 5,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }]}>
                                    <Text style={styles.textTitle}>No Nutrition Plan Today</Text>
                                </View>
                            }
                            {data && data.training_day ?
                                <View style={[styles.box, {marginBottom: 5}]}>
                                    <View
                                        style={[styles.boxHeader, {borderBottomWidth: 1, borderColor: unfilledColor}]}>
                                        <MaterialIcon name="directions-run" size={getFontSize(22)}/>
                                        <Text style={styles.formCalories}>
                                            WORKOUT
                                        </Text>
                                    </View>
                                    <View style={[{marginLeft: 40, paddingTop: 5}]}>
                                        <Text style={{
                                            fontSize: getFontSize(18),
                                            fontFamily: 'Heebo-Medium'
                                        }}>{data.training_day.name}</Text>
                                        <View style={[styles.boxHeader, {paddingLeft: 10}]}>
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
                                <View style={[styles.box, {marginBottom: 5}]}>
                                    <View
                                        style={[styles.boxHeader, {borderBottomWidth: 1, borderColor: unfilledColor}]}>
                                        <MaterialIcon name="directions-run" size={getFontSize(22)}/>
                                        <Text style={styles.formCalories}>
                                            WORKOUT
                                        </Text>
                                    </View>
                                    <View style={[{paddingTop: 20, paddingBottom: 20}]}>
                                        <Text style={{
                                            fontSize: getFontSize(18),
                                            fontFamily: 'Heebo-Medium',
                                            textAlign: 'center',
                                        }}>NO WORKOUT TODAY</Text>

                                    </View>

                                </View>
                            }
                        </View>
                        : <Loading style={{paddingTop: 40}}/>
                    }

                </View>
            );

        }

        return (
            <View style={GlobalStyle.noHeaderContainer}>
                <View style={styles.topBar}>
                    <View style={[styles.topItem, {alignItems: 'flex-start'}]}>
                        {this.renderNotifications()}
                    </View>
                    <View style={[styles.topItem]}/>
                    <View style={styles.topItem}>
                        <TouchableOpacity onPress={() => navigate('MyProfile')} style={[{paddingRight: 10}]}>
                            <FontIcon size={getFontSize(25)} name="user-circle-o"/>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView ref='home_scroll' showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl refreshing={this.props.Refreshing}
                                                            onRefresh={() => this.getNeeded(true)}/>}
                            style={styles.scrollView} contentContainerStyle={styles.contentContainerStyle}>

                    {/*<View style={{flex: .8}}>*/}
                    <View style={[styles.todayTitle, {justifyContent: 'space-between'}]}>
                        <TouchableOpacity onPress={this.subtractDay} style={styles.arrowStyle}>
                            <MaterialIcon name="keyboard-arrow-left" size={getFontSize(24)} color='#00AFA3'/>
                        </TouchableOpacity>
                        <View style={styles.todayTitle}>
                            <MaterialIcon size={24} color='black' name="date-range"/>
                            <Text style={styles.textTitle}>
                                {this.state.dataDate.isSame(today, 'd') ? 'TODAY' : this.state.dataDate.format('ddd, MMM DD').toUpperCase()}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={this.addDay} style={styles.arrowStyle}>
                            <MaterialIcon name="keyboard-arrow-right" size={getFontSize(24)} color='#00AFA3'/>
                        </TouchableOpacity>
                    </View>
                    {content}
                </ScrollView>


                <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right"
                              icon={isTrainer? null : <MaterialIcon name="search" size={getFontSize(20)} color="white"/>}>
                    <ActionButton.Item buttonColor='#FD795B' title="Workouts"
                                       onPress={() => navigate('ProgramList')}>
                        <CustomIcon name="weight" size={getFontSize(22)} color="white"/>
                    </ActionButton.Item>
                    {isTrainer ?
                        <ActionButton.Item buttonColor='#FD795B' title="Surveys"
                                           onPress={() => navigate('SurveyList')}>
                            <MaterialIcon name="question-answer" size={getFontSize(22)} color="white"/>
                        </ActionButton.Item>
                        : <View/>
                    }
                    <ActionButton.Item buttonColor='#FD795B'
                                       title={isTrainer ? "Clients" : "Trainers"}
                                       onPress={() => navigate('ManageClients')}>
                        <CustomIcon name="users" color="white" size={getFontSize(22)}/>
                    </ActionButton.Item>

                </ActionButton>
            </View>
        )
    }
});

const unfilledColor = 'rgba(0, 0, 0, 0.1)';

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        flexDirection: 'column',
    },
    contentContainerStyle: {
        paddingBottom: 50,
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
        alignItems: 'center'
    },
    formCalories: {
        fontFamily: 'Heebo-Bold',
        fontSize: getFontSize(18),
        color: 'black',
        paddingLeft: 10,
    },
    calorieBox: {
        flex: .4,
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
        borderWidth: .5,
        borderColor: '#e1e3df',
        borderRadius: 5,
        backgroundColor: 'white'
    },
    textTitle: {
        fontSize: getFontSize(22),
        fontFamily: 'Heebo-Bold',
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
        borderColor: '#e1e3df',
        borderBottomWidth: 1
    },
    emptyClientsText: {
        fontSize: getFontSize(20),
        fontFamily: 'Heebo-Medium',
        color: 'rgba(0, 175, 163, 1)'
    },
    arrowStyle: {
        borderColor: '#00AFA3',
        backgroundColor: 'white',
        borderWidth: .5,
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
        getNotifications: bindActionCreators(GlobalActions.getNotifications, dispatch),
        readNotification: bindActionCreators(GlobalActions.readNotification, dispatch),
        toggleTabBar: bindActionCreators(GlobalActions.toggleTabBar, dispatch),
    }
};

export default connect(stateToProps, dispatchToProps)(Home);
