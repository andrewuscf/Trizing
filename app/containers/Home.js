import React from 'react';
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconBadge from 'react-native-icon-badge';
import ModalBox from 'react-native-modalbox';


import * as HomeActions from '../actions/homeActions';
import * as GlobalActions from '../actions/globalActions';

import {getFontSize} from '../actions/utils';
import GlobalStyle from './globalStyle';


import MyProfile from '../containers/profile/MyProfile';

import AvatarImage from '../components/AvatarImage';
import Loading from '../components/Loading';
import PeopleBar from '../components/PeopleBar';


const Home = React.createClass({
    propTypes: {
        Refreshing: React.PropTypes.bool.isRequired,
        HomeIsLoading: React.PropTypes.bool.isRequired,
    },

    // scrollToTopEvent(args) {
    //     if (args.routeName == 'Home') {
    //         const isTrue = true;
    //         this.refs.home_scroll.scrollTo({y: 0, isTrue});
    //     }
    // },


    componentDidMount() {
        if (!this.props.Clients.length) {
            this.getNeeded(true);
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


    _refresh() {
        this.getNeeded(true);
    },

    onEndReached() {
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
                              style={[{padding: 10, paddingRight: 20}]}>
                {unread_count ?
                    <IconBadge
                        MainElement={
                            <Icon name="notifications" size={getFontSize(50)}/>
                        }
                        BadgeElement={
                            <Text style={{color: '#FFFFFF'}}>{unread_count}</Text>
                        }

                        IconBadgeStyle={
                            {top: 0}
                        }

                    /> :
                    <Icon name="notifications" size={getFontSize(50)}/>
                }
            </TouchableOpacity>
        )
    },

    openModal() {
        this.refs.profile_modal.open();
    },

    closeModal() {
        this.refs.profile_modal.close();
    },

    onModalClose() {
        this.props.toggleTabBar(true);
    },

    onModalOpen() {
        this.props.toggleTabBar(false);
    },



    render() {
        const user = this.props.RequestUser;
        if (!user || this.props.HomeIsLoading) return <Loading />;
        const isTrainer = user.type == 1;
        let content = null;
        const {navigate} = this.props.navigation;
        if (isTrainer) {
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            const QuestionnaireDS = ds.cloneWithRows(this.props.Questionnaires);
            const SchedulesDs = ds.cloneWithRows(_.filter(this.props.Schedules, function (o) {
                return !o.training_plan;
            }));
            content = (
                <View>
                    <PeopleBar navigate={navigate} people={this.props.Clients}
                               manageClients={() => navigate('ManageClients')}/>

                    <View style={[styles.box]}>
                        <Text style={styles.textTitle}>Program Templates</Text>
                        <ListView ref='schedules_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                                  style={styles.container} enableEmptySections={true} dataSource={SchedulesDs}
                                  renderRow={(schedule) =>
                                      <TouchableOpacity style={styles.link}
                                                        onPress={this._redirect.bind(null, 'EditSchedule', {scheduleId: schedule.id})}>
                                          <Text style={styles.simpleTitle}>{schedule.name}</Text>
                                          <Icon name="keyboard-arrow-right" size={getFontSize(18)}
                                                style={styles.linkArrow}/>
                                      </TouchableOpacity>
                                  }
                        />
                        <TouchableOpacity onPress={this._redirect.bind(null, 'CreateSchedule', null)}
                                          style={styles.link}>
                            <Text style={styles.simpleTitle}>Create Program Template</Text>
                            <Icon name="add" size={getFontSize(18)} style={styles.linkArrow}/>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.box]}>
                        <Text style={styles.textTitle}>Surveys</Text>
                        <ListView ref='survey_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                                  style={styles.container} enableEmptySections={true} dataSource={QuestionnaireDS}
                                  renderRow={(questionnaire) =>
                                      <TouchableOpacity style={styles.link}
                                                        onPress={this._redirect.bind(null, 'AnswersDisplay', {questionnaire: questionnaire})}>
                                          <Text style={styles.simpleTitle}>{questionnaire.name}</Text>
                                          <Icon name="keyboard-arrow-right" size={getFontSize(18)}
                                                style={styles.linkArrow}/>
                                      </TouchableOpacity>
                                  }
                        />
                        <TouchableOpacity onPress={this._redirect.bind(null, 'CreateQuestionnaire', null)}
                                          style={styles.link}>
                            <Text style={styles.simpleTitle}>Create Survey</Text>
                            <Icon name="add" size={getFontSize(18)} style={styles.linkArrow}/>
                        </TouchableOpacity>
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
                                    <Icon size={24} color='black' name="date-range"/>
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
                                        <Icon name="keyboard-arrow-right" size={getFontSize(18)}
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
                    <View style={[styles.box, {marginBottom: 5, alignItems: 'center', justifyContent: 'center'}]}>
                        <Text style={styles.textTitle}>You have no trainer</Text>
                        <TouchableOpacity onPress={this._redirect.bind(null, 'ManageClients', null)}
                                          style={styles.link}>
                            <Text style={styles.simpleTitle}>Find a trainer</Text>
                            <Icon name="keyboard-arrow-right" size={getFontSize(18)} style={styles.linkArrow}/>
                        </TouchableOpacity>
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
                                                            onRefresh={this._refresh}/>}
                            style={styles.scrollView} contentContainerStyle={styles.contentContainerStyle}>

                    <View style={styles.userProfile}>
                        <View style={styles.topItem}/>
                        <View style={[{flex: 3.3, justifyContent: 'center', alignItems: 'center'}]}>
                            <AvatarImage style={styles.avatar} image={userImage}
                                         redirect={this.openModal}/>
                        </View>
                        <View style={styles.topItem}>
                            {this.renderNotifications()}
                        </View>
                    </View>

                    <View style={{flex: .8}}>
                        {content}
                    </View>
                </ScrollView>

                <ModalBox style={[styles.modal]} backdrop={false} ref="profile_modal"
                          onClosed={this.onModalClose} onOpened={this.onModalOpen}
                          entry='top' swipeToClose={true}>
                    <MyProfile back={this.closeModal} navigation={this.props.navigation}/>
                    <TouchableOpacity onPress={this.closeModal} style={styles.modalClose}>
                        <Icon name="keyboard-arrow-down" size={50} color='#333333'/>
                    </TouchableOpacity>
                </ModalBox>
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
        flexDirection: 'column'
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
    listItemText: {
        color: '#4d4d4e',
        fontSize: getFontSize(22),
        lineHeight: getFontSize(26),
        backgroundColor: 'transparent',
        fontFamily: 'OpenSans-Semibold',
        textDecorationLine: 'underline'
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
        // top: 0,
        // bottom: 0,
        // right: 0,
        // left: 0,
    },
    modalClose: {
        justifyContent: 'center',
        alignItems: 'center',
        // borderColor: 'black',
        // borderWidth: .5,
        // width: 500
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
        getSchedules: bindActionCreators(GlobalActions.getSchedules, dispatch),
        toggleTabBar: bindActionCreators(GlobalActions.toggleTabBar, dispatch),
    }
};

export default connect(stateToProps, dispatchToProps)(Home);
