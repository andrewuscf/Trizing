import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    Platform,
    Dimensions,
    Animated
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IconBadge from 'react-native-icon-badge';
import ActionButton from 'react-native-action-button';


import * as HomeActions from '../actions/homeActions';
import * as GlobalActions from '../actions/globalActions';

import {getFontSize} from '../actions/utils';
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
            modalY: new Animated.Value(-deviceHeight)
        }
    },


    componentDidMount() {
        if (!this.props.Clients.length) {
            this.getNeeded(true);
        }
    },

    getNeeded(refresh = false) {
        if (this.props.RequestUser.type == 1) {
            this.props.actions.getClients(refresh);
        } else {
            this.props.actions.getActiveData(refresh);
        }
        if (refresh) {
            this.props.getNotifications(refresh);
        }
    },

    _redirect(routeName, props = null) {
        this.props.navigation.navigate(routeName, props);
    },

    _toLogWorkout() {
        if (this.props.ActiveData && this.props.ActiveData.training_day && !this.props.ActiveData.training_day.logged_today) {
            this._redirect('WorkoutDaySession', {workout_day: this.props.ActiveData.training_day})
        }
    },

    renderNotifications() {
        const unread_count = _.filter(this.props.Notifications, function (o) {
            return o.unread;
        }).length;
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Notifications')}
                              style={[{padding: 10, paddingTop: 0, paddingRight: 20}]}>
                {unread_count ?
                    <IconBadge
                        MainElement={
                            <MaterialIcon name="notifications" size={getFontSize(50)}/>
                        }
                        BadgeElement={
                            <Text style={{color: '#FFFFFF'}}>{unread_count}</Text>
                        }

                        IconBadgeStyle={
                            {top: 0}
                        }

                    /> :
                    <MaterialIcon name="notifications" size={getFontSize(50)}/>
                }
            </TouchableOpacity>
        )
    },

    showProfile() {
        Animated.timing(this.state.modalY, {
            duration: 300,
            toValue: 0
        }).start();
    },

    hideProfile() {
        Animated.timing(this.state.modalY, {
            duration: 300,
            toValue: -deviceHeight
        }).start();
    },


    render() {
        const user = this.props.RequestUser;
        if (!user || this.props.HomeIsLoading) return <Loading />;
        const isTrainer = user.type == 1;
        let content = null;
        const {navigate} = this.props.navigation;
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
                                <CustomIcon name="barbell" size={getFontSize(45)}/>
                                <Text style={styles.itemText}>Workouts</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.itemBox, {borderRightWidth: 0}]}
                                              onPress={() => navigate('SurveyList')}>
                                <MaterialIcon name="question-answer" size={getFontSize(45)}/>
                                <Text style={styles.itemText}>Surveys</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        } else {
            const data = this.props.ActiveData;
            if (data && (data.macro_plan_day || data.training_day)) {
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
                                <View style={styles.todayTitle}>
                                    <MaterialIcon size={24} color='black' name="date-range"/>
                                    <Text style={styles.textTitle}>{`Today`}</Text>
                                </View>

                                <View style={[styles.row, {justifyContent: 'space-between', alignItems: 'center'}]}>
                                    <View style={styles.details}>
                                        <Text style={styles.sectionTitle}>Fats</Text>
                                        <Text style={styles.smallText}>{`${data.macro_plan_day.fats}g`}</Text>
                                    </View>
                                    <View style={styles.details}>
                                        <Text style={styles.sectionTitle}>Carbs</Text>
                                        <Text style={styles.smallText}>{`${data.macro_plan_day.carbs}g`}</Text>
                                    </View>
                                    <View style={styles.details}>
                                        <Text style={styles.sectionTitle}>Protein</Text>
                                        <Text style={styles.smallText}>{`${data.macro_plan_day.protein}g`}</Text>
                                    </View>
                                </View>
                                <Text style={styles.formCalories}>
                                    Calories: {calories}
                                </Text>
                                {!data.macro_plan_day.logged_today ?
                                    <TouchableOpacity
                                        onPress={this._redirect.bind(null, 'CreateMacroLog', {macro_plan_day: data.macro_plan_day})}
                                        style={styles.link}>
                                        <Text style={styles.simpleTitle}>Log Today</Text>
                                        <MaterialIcon name="keyboard-arrow-right" size={getFontSize(18)}
                                                      style={styles.linkArrow}/>
                                    </TouchableOpacity>
                                    : null
                                }
                            </View>
                            : <View
                                style={[styles.box, {marginBottom: 5, alignItems: 'center', justifyContent: 'center'}]}>
                                <Text style={styles.textTitle}>No Nutrition Plan Today</Text>
                            </View>
                        }
                        {data.training_day ?
                            <TouchableOpacity activeOpacity={.6} style={[styles.box, {
                                marginBottom: 5,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }]} onPress={this._toLogWorkout}>
                                <Text style={styles.textTitle}>{`Today's Workout`}</Text>
                                <Text style={styles.h2Title}>{data.training_day.name}</Text>
                                <Text>Exercises: {data.training_day.exercises.length}</Text>
                                <Text>Start Workout</Text>

                            </TouchableOpacity>
                            :
                            <View
                                style={[styles.box, {marginBottom: 5, alignItems: 'center', justifyContent: 'center'}]}>
                                <Text style={styles.textTitle}>No Workout Today</Text>
                            </View>
                        }

                    </View>
                )
            } else {
                content = (
                    <View>
                        <View style={styles.emptyClients}>
                            <Text style={styles.emptyClientsText}>Get started by finding a trainer</Text>
                            <Text style={styles.emptyClientsText}>or workout program.</Text>
                        </View>
                        <View style={styles.templateSection}>
                            <View style={{flexDirection: 'row',}}>
                                <TouchableOpacity style={[styles.itemBox]}
                                                  onPress={this._redirect.bind(null, 'ManageClients', null)}>
                                    <CustomIcon name="users" size={getFontSize(45)}/>
                                    <Text style={styles.itemText}>Find a trainer</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.itemBox, {borderRightWidth: 0}]} onPress={() => navigate('ProgramList')}>
                                    <CustomIcon name="barbell" size={getFontSize(45)}/>
                                    <Text style={styles.itemText}>Workouts</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )
            }

        }
        let userImage = user.profile.avatar;
        if (user.profile.thumbnail)
            userImage = user.profile.thumbnail;

        return (
            <View style={GlobalStyle.noHeaderContainer}>
                <ScrollView ref='home_scroll'
                            refreshControl={<RefreshControl refreshing={this.props.Refreshing}
                                                            onRefresh={()=>this.getNeeded(true)}/>}
                            style={styles.scrollView} contentContainerStyle={styles.contentContainerStyle}>

                    <View style={styles.userProfile}>
                        <View style={styles.topItem}/>
                        <View style={[{flex: 3.3, justifyContent: 'center', alignItems: 'center'}]}>
                            <AvatarImage style={styles.avatar} image={userImage}
                                         redirect={this.showProfile}/>
                        </View>
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

                {isTrainer && this.state.modalY != 0 ?
                    <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right">
                        <ActionButton.Item buttonColor='#FD795B' title="Manage Clients"
                                           onPress={() => navigate('ManageClients')}>
                            <CustomIcon name="users" color="white" size={getFontSize(30)}/>
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
        alignItems: 'center',
        borderTopWidth: 0.5,
        borderColor: '#e1e3df',
    },
    linkArrow: {
        flex: 1
    },
    userProfile: {
        flex: .15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#e1e3df',
        borderBottomWidth: 1,
    },
    avatar: {
        height: 60,
        width: 60,
        borderRadius: 30
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
        fontSize: getFontSize(24),
        backgroundColor: 'transparent',
        fontFamily: 'OpenSans-Semibold',
    },
    emptyClients: {
        height:50,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#e1e3df',
        borderBottomWidth: 1
    },
    emptyClientsText: {
        fontSize: getFontSize(24),
        fontFamily: 'OpenSans-Semibold',
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
