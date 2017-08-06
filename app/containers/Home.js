import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Animated
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import IconBadge from 'react-native-icon-badge';
import ActionButton from 'react-native-action-button';
import moment from 'moment';


import * as HomeActions from '../actions/homeActions';
import * as GlobalActions from '../actions/globalActions';

import {getFontSize, calCalories} from '../actions/utils';
import GlobalStyle from './globalStyle';


import MyProfile from '../containers/profile/MyProfile';

import AvatarImage from '../components/AvatarImage';
import CustomIcon from '../components/CustomIcon';
import Loading from '../components/Loading';
import PeopleBar from '../components/PeopleBar';


let deviceHeight = Dimensions.get('window').height;

const Home = React.createClass({
    propTypes: {
        Refreshing: React.PropTypes.bool.isRequired,
        HomeIsLoading: React.PropTypes.bool.isRequired,
    },

    getInitialState() {
        return {
            modalY: new Animated.Value(-deviceHeight),
            dataDate: moment(),
            open: false,
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
        } else {
            this.props.actions.getActiveData(this.state.dataDate.format("YYYY-MM-DD"), true);
        }
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
                              style={[{paddingRight: 20}]}>
                {unread_count ?
                    <IconBadge
                        MainElement={
                            <MaterialIcon name="notifications" size={getFontSize(40)}/>
                        }
                        BadgeElement={
                            <Text style={{color: '#FFFFFF', fontSize: getFontSize(12)}}>{unread_count}</Text>
                        }

                        IconBadgeStyle={
                            {top: 0}
                        }

                    /> :
                    <MaterialIcon name="notifications" size={getFontSize(40)}/>
                }
            </TouchableOpacity>
        )
    },

    showProfile() {
        Animated.timing(this.state.modalY, {
            duration: 300,
            toValue: 0
        }).start();
        this.setState({open: true});
    },

    hideProfile() {
        Animated.timing(this.state.modalY, {
            duration: 300,
            toValue: -deviceHeight
        }).start();
        this.setState({open: false});
    },

    addDay() {
        const newDate = this.state.dataDate.add(1, 'day');
        this.setState({
            dataDate: newDate
        });
        if (!_.find(this.props.ActiveData, {date: this.state.dataDate.format("YYYY-MM-DD")})) {
            this.props.actions.getActiveData(newDate.format("YYYY-MM-DD"), false)
        }
    },

    subtractDay() {
        const newDate = this.state.dataDate.subtract(1, 'day');
        this.setState({
            dataDate: newDate
        });
        if (!_.find(this.props.ActiveData, {date: this.state.dataDate.format("YYYY-MM-DD")})) {
            this.props.actions.getActiveData(newDate.format("YYYY-MM-DD"), false)
        }
    },


    render() {
        const user = this.props.RequestUser;
        if (!user || this.props.HomeIsLoading) return <Loading />;
        const isTrainer = user.type === 1;
        let content = null;
        const {navigate} = this.props.navigation;
        const today = moment();
        if (isTrainer) {
            content = (
                <View>
                    {this.props.Clients.length ?
                        <PeopleBar navigate={navigate} people={this.props.Clients}/>
                        : <View style={styles.emptyClients}>
                            <Text style={styles.emptyClientsText}>Get started by adding new clients.</Text>
                        </View>
                    }
                    <View style={styles.templateSection}>
                        <View style={{flexDirection: 'row',}}>
                            <TouchableOpacity style={[styles.itemBox]} onPress={() => navigate('ProgramList')}>
                                <CustomIcon name="barbell" size={getFontSize(30)}/>
                                <Text style={styles.itemText}>Workouts</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.itemBox, {borderRightWidth: 0}]}
                                              onPress={() => navigate('SurveyList')}>
                                <MaterialIcon name="question-answer" size={getFontSize(30)}/>
                                <Text style={styles.itemText}>Surveys</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        } else {
            const data = _.find(this.props.ActiveData, {date: this.state.dataDate.format("YYYY-MM-DD")});
            let calories = 0;
            let fats = 0;
            let protein = 0;
            let carbs = 0;
            if (data && data.macro_plan_day) {
                fats = (data.macro_plan_day.fats) ? data.macro_plan_day.fats : 0;
                protein = (data.macro_plan_day.protein) ? data.macro_plan_day.protein : 0;
                carbs = (data.macro_plan_day.carbs) ? data.macro_plan_day.carbs : 0;
                calories = calCalories(fats, carbs, protein);
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
                    <View style={styles.templateSection}>
                        <View style={{flexDirection: 'row',}}>
                            <TouchableOpacity style={[styles.itemBox]}
                                              onPress={this._redirect.bind(null, 'ManageClients', null)}>
                                <CustomIcon name="users" size={getFontSize(30)}/>
                                <Text style={styles.itemText}>Find a trainer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.itemBox, {borderRightWidth: 0}]}
                                              onPress={() => navigate('ProgramList')}>
                                <CustomIcon name="barbell" size={getFontSize(30)}/>
                                <Text style={styles.itemText}>Workouts</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.todayTitle, {justifyContent: 'space-between'}]}>
                        <TouchableOpacity onPress={this.subtractDay}>
                            <MaterialIcon name="keyboard-arrow-left" size={getFontSize(20)}
                                          style={[{marginLeft: 10}]}/>
                        </TouchableOpacity>
                        <View style={styles.todayTitle}>
                            <MaterialIcon size={24} color='black' name="date-range"/>
                            <Text style={styles.textTitle}>
                                {this.state.dataDate.isSame(today, 'd') ? 'Today' : this.state.dataDate.format('dddd, MMM DD')}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={this.addDay}>
                            <MaterialIcon name="keyboard-arrow-right" size={getFontSize(20)}
                                          style={[{marginRight: 10}]}/>
                        </TouchableOpacity>
                    </View>
                    {!this.props.Loading_Active ?
                        <View>
                            {data && data.macro_plan_day ?
                                <View style={[styles.box, {marginBottom: 5}]}>

                                    <View style={[styles.row, {justifyContent: 'space-between', alignItems: 'center'}]}>
                                        <View style={styles.details}>
                                            <Text style={styles.sectionTitle}>Fat</Text>
                                            <Text style={styles.smallText}>{`${fats}g`}</Text>
                                        </View>
                                        <View style={styles.details}>
                                            <Text style={styles.sectionTitle}>Carbs</Text>
                                            <Text style={styles.smallText}>{`${carbs}g`}</Text>
                                        </View>
                                        <View style={styles.details}>
                                            <Text style={styles.sectionTitle}>Protein</Text>
                                            <Text style={styles.smallText}>{`${protein}g`}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.formCalories}>
                                        Calories: {calories}
                                    </Text>
                                    <TouchableOpacity onPress={this._redirect.bind(null, 'CreateMacroLog', {
                                        macro_plan_day: data.macro_plan_day,
                                        date: this.state.dataDate
                                    })}
                                                      style={styles.link}>
                                        <Text style={styles.simpleTitle}>Log Nutrition</Text>
                                    </TouchableOpacity>
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
                                <TouchableOpacity activeOpacity={.6} style={[styles.box, {
                                    marginBottom: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }]} onPress={this._toLogWorkout.bind(null, data)}>
                                    <Text style={styles.textTitle}>{data.training_day.name}</Text>
                                    <Text style={styles.h2Title}>{data.training_day.exercises.length} Exercises</Text>
                                    {!data.training_day.logged_today ?
                                        <Text style={styles.simpleTitle}>Start Workout</Text>
                                        : null
                                    }

                                </TouchableOpacity>
                                :
                                <View
                                    style={[styles.box, {
                                        marginBottom: 5,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }]}>
                                    <Text style={styles.textTitle}>No Workout</Text>
                                </View>
                            }
                        </View>
                        : <Loading style={{paddingTop: 40}}/>
                    }

                </View>
            );

        }
        let userImage = user.profile.avatar;
        if (user.profile.thumbnail)
            userImage = user.profile.thumbnail;

        return (
            <View style={GlobalStyle.noHeaderContainer}>
                <ScrollView ref='home_scroll' showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl refreshing={this.props.Refreshing}
                                                            onRefresh={() => this.getNeeded(true)}/>}
                            style={styles.scrollView} contentContainerStyle={styles.contentContainerStyle}>

                    <View style={styles.userProfile}>
                        <View style={[styles.topItem, {alignItems: 'flex-start'}]}>
                            <TouchableOpacity onPress={this.showProfile} style={[{paddingLeft: 20}]}>
                                <FontIcon size={getFontSize(40)} name="user-circle-o"/>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.topItem]} />
                        <View style={styles.topItem}>
                            {this.renderNotifications()}
                        </View>
                    </View>

                    <View style={{flex: .8}}>
                        {content}
                    </View>
                </ScrollView>

                <Animated.View style={[styles.modal, {transform: [{translateY: this.state.modalY}]}]}>
                    <MyProfile navigation={this.props.navigation} close={this.hideProfile}/>
                </Animated.View>

                {isTrainer && !this.state.open ?
                    <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right">
                        <ActionButton.Item buttonColor='#FD795B' title="Manage Clients"
                                           onPress={() => navigate('ManageClients')}>
                            <CustomIcon name="users" color="white" size={getFontSize(22)}/>
                        </ActionButton.Item>
                    </ActionButton>
                    : null
                }
            </View>
        )
    }
});


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        flexDirection: 'column'
    },
    contentContainerStyle: {
        flex: 1,
        flexDirection: 'column',
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
        backgroundColor: 'transparent',
        paddingTop: 3,
        paddingBottom: 3,
        alignItems: 'center'
    },
    formCalories: {
        fontFamily: 'Heebo-Bold',
        alignSelf: 'center',
        padding: 10,
        fontSize: getFontSize(18),
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
        fontSize: getFontSize(22),
        fontFamily: 'Heebo-Bold',
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'center'
    },
    h2Title: {
        fontSize: getFontSize(15),
        fontFamily: 'Heebo-Medium',
        paddingBottom: 5,
    },
    simpleTitle: {
        fontSize: getFontSize(16),
        color: '#b1aea5',
        fontFamily: 'Heebo-Medium',
        margin: 10,
        textAlign: 'center'
    },
    link: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    userProfile: {
        flex: .1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
    },
    avatar: {
        height: 80,
        width: 80,
        borderRadius: 40
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
    modal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    templateSection: {
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    itemBox: {
        flex: .5,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#e1e3df',
        borderRightWidth: .5,
        paddingTop: 10,
        paddingBottom: 10,
    },
    itemText: {
        fontSize: getFontSize(20),
        backgroundColor: 'transparent',
        fontFamily: 'Heebo-Medium',
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
