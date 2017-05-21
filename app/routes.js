import React from 'react'
import {Platform} from 'react-native';
import {TabNavigator, StackNavigator, NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Save from './components/NavBarSave';

// Main Pages
import Home from './containers/Home';
import Calendar from './containers/Calendar';
import Feed from './containers/Feed';
import Chat from './containers/Chat';
import Profile from './containers/Profile';
import Login from './containers/Login';
import SplashScreen from './containers/SplashScreen';

// Sub Pages
import Notifications from './containers/sub/Notifications';
import TrainingPlan from './containers/sub/TrainingPlan';
import ManageClients from './containers/sub/ManageClients';

// Edit Pages
import EditProfile from './containers/edit/EditProfile';
import EditSchedule from './containers/edit/EditSchedule';
import EditWorkout from './containers/edit/EditWorkout';

// Detail Pages
import WorkoutDayDetail from './containers/detail/WorkoutDayDetail';
import ChatRoom from './containers/detail/ChatRoom';
import EventDetail from './containers/detail/EventDetail';
import PostDetail from './containers/detail/PostDetail';
import MacroPlanDetail from './containers/detail/MacroPlanDetail';
import ScheduleDetail from './containers/detail/ScheduleDetail';
import WorkoutDetail from './containers/detail/WorkoutDetail';
import WorkoutDaySession from './containers/detail/WorkoutDaySession';
import AnswerQuestionnaire from './containers/detail/AnswerQuestionnaire';
import AnswersDisplay from './containers/detail/AnswersDisplay';

// Create Pages
import CreateWorkout from './containers/sub/CreateWorkout';
import CreateSchedule from './containers/sub/CreateSchedule';
import CreateWorkoutDay from './containers/sub/CreateWorkoutDay';
import CreateExercise from './containers/sub/CreateExercise';
import CreateEvent from './containers/sub/CreateEvent';
import CreateChatRoom from './containers/sub/CreateChatRoom';
import CreateMacroLog from './containers/sub/CreateMacroLog';
import CreateQuestionnaire from './containers/sub/CreateQuestionnaire';


const paramsToProps = (SomeComponent) => {
// turns this.props.navigation.state.params into this.params.<x>
    return class extends React.Component {
        static navigationOptions = SomeComponent.navigationOptions;
        // everything else, call as SomeComponent
        render() {
            const {navigation, ...otherProps} = this.props;
            const {state: {params}} = navigation;
            return <SomeComponent {...this.props} {...params} />
        }
    }
};

const navBlue = 'blue';

const MainTabNav = TabNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            header: null,
            tabBarIcon: (focused, tintColor) => <Icon size={24} color={focused ? navBlue : tintColor} name="home"/>
        },
    },
    Calendar: {
        // path: 'calendar/',
        screen: Calendar,
        navigationOptions: {
            header: null,
            tabBarIcon: (focused, tintColor) => <Icon size={24} color={focused ? navBlue : tintColor}
                                                      name="date-range"/>
        }
    },
    Feed: {
        screen: Feed,
        navigationOptions: {
            header: null,
            tabBarIcon: (focused, tintColor) => <Icon size={24} color={focused ? navBlue : tintColor} name="list"/>
        }
    },
    Chat: {
        screen: Chat,
        navigationOptions: {
            header: null,
            tabBarIcon: (focused, tintColor) => <Icon size={24} color={focused ? navBlue : tintColor} name="comment"/>
        }
    },
    Profile: {
        screen: paramsToProps(Profile),
        path: 'profile/:id',
        navigationOptions: {
            headerStyle: {
                position: 'absolute',
                // zIndex: 99,
                right: 0,
                top: 0,
                left: 0,
                backgroundColor: 'transparent',
            },
            // title: '',
            tabBarIcon: (focused, tintColor) => <Icon size={24} color={focused ? navBlue : tintColor}
                                                      name="account-circle"/>
        }
    },
}, {
    tabBarComponent: props => {
        const {navigation, navigationState} = props;
        const jumpToIndex = index => {
            const lastPosition = navigationState.index;
            const tab = navigationState.routes[index];
            const tabRoute = tab.routeName;
            const firstTab = tab.routes[0].routeName;

            lastPosition !== index && navigation.dispatch(NavigationActions.navigate({routeName: tabRoute}));
            lastPosition === index && navigation.dispatch(NavigationActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: firstTab})]
            }))
        };
        return <TabView.TabBarBottom {...props} jumpToIndex={jumpToIndex}/>
    },
    tabBarPosition: 'bottom',
    lazy: true,
    swipeEnabled: true,
    animationEnabled: false,
    tabBarOptions: {
        showLabel: false,
        activeTintColor: navBlue
    }
});

export const AppNavigator = StackNavigator({
    SplashScreen: {
        screen: SplashScreen,
        // headerMode: 'none',
        navigationOptions: {
            header: null,
        },

    },
    Login: {
        screen: Login,
        navigationOptions: {
            header: null
        },
    },

    EditProfile: {
        screen: EditProfile,
    },

    ManageClients: {screen: ManageClients},

    Notifications: {screen: Notifications},


    PostDetail: {screen: paramsToProps(PostDetail)},

    CreateEvent: {screen: CreateEvent},
    EventDetail: {screen: paramsToProps(EventDetail)},


    CreateChatRoom: {screen: CreateChatRoom},

    ChatRoom: {screen: paramsToProps(ChatRoom)},


    CreateQuestionnaire: {screen: CreateQuestionnaire},


    AnswerQuestionnaire: {screen: paramsToProps(AnswerQuestionnaire)},
    AnswersDisplay: {screen: paramsToProps(AnswersDisplay)},


    MacroPlanDetail: {screen: paramsToProps(MacroPlanDetail)},
    ScheduleDetail: {screen: paramsToProps(ScheduleDetail)},


    TrainingPlan: {screen: paramsToProps(TrainingPlan)},
    CreateWorkout: {screen: paramsToProps(CreateWorkout)},
    EditWorkout: {screen: paramsToProps(EditWorkout)},
    CreateWorkoutDay: {screen: paramsToProps(CreateWorkoutDay)},
    CreateExercise: {screen: paramsToProps(CreateExercise)},
    WorkoutDayDetail: {screen: paramsToProps(WorkoutDayDetail)},
    CreateSchedule: {screen: paramsToProps(CreateSchedule)},
    EditSchedule: {screen: paramsToProps(EditSchedule)},
    CreateMacroLog: {screen: paramsToProps(CreateMacroLog)},
    WorkoutDetail: {screen: paramsToProps(WorkoutDetail)},
    WorkoutDaySession: {screen: paramsToProps(WorkoutDaySession)},


    Home: {screen: MainTabNav},
}, {
    headerMode: 'screen',
    initialRouteName: 'SplashScreen',
    navigationOptions: ({navigation}) => {
        const {state, setParams} = navigation;
        return {
            headerRight: state.params && state.params.handleSave ? <Save save={state.params.handleSave}/> : null,
            headerStyle: {
                backgroundColor: 'white'
            }
        };
    },
    cardStyle: {
        // flex: 1,
        // marginTop: (Platform.OS === 'ios') ? 20 : 0,
        backgroundColor: 'white'
    }
});