import React from 'react'
import {Platform, View} from 'react-native';
import {TabNavigator, StackNavigator, TabBarBottom, DrawerNavigator, NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Save from './components/NavBarSave';

// Main Pages
import Home from './containers/Home';
import Calendar from './containers/Calendar';
// import Feed from './containers/Feed';
import Chat from './containers/Chat';
import Login from './containers/Login';
import SplashScreen from './containers/SplashScreen';

// Sub Pages
import Notifications from './containers/sub/Notifications';
import TrainingPlan from './containers/sub/TrainingPlan';
import ManageClients from './containers/sub/ManageClients';

// Edit Pages
import EditSchedule from './containers/edit/EditSchedule';
import EditWorkout from './containers/edit/EditWorkout';

// Detail Pages
import WorkoutDayDetail from './containers/detail/WorkoutDayDetail';
import ChatRoom from './containers/detail/ChatRoom';
import EventDetail from './containers/detail/EventDetail';
// import PostDetail from './containers/detail/PostDetail';
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


// Profile Pages
import Profile from './containers/profile/Profile';
import EditProfile from './containers/profile/EditProfile';


// Trainer Pages
import ProgramList from './containers/trainer/ProgramList';
import SurveyList from './containers/trainer/SurveyList';
import CreateMacroPlan from './containers/trainer/CreateMacroPlan';

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

const lightGreen = '#00AFA3';

const defaultNavigationOptions = {
    headerStyle: {
        backgroundColor: 'white'
    },
    headerBackTitle: null,
    headerTitleStyle: {
        alignSelf: 'center',
    },
    headerTintColor: lightGreen,
    gesturesEnabled: true
}


const HomeNav = StackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            header: null,
        }
    },
    ManageClients: {screen: ManageClients},
    Notifications: {
        screen: Notifications,
        navigationOptions: {
            headerTitle: 'Notifications',
        }
    },
    CreateMacroLog: {screen: paramsToProps(CreateMacroLog)},

    EditProfile: {screen: EditProfile},

    Profile: {
        screen: paramsToProps(Profile),
    },


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
    WorkoutDetail: {screen: paramsToProps(WorkoutDetail)},
    WorkoutDaySession: {screen: paramsToProps(WorkoutDaySession)},

    EventDetail: {screen: paramsToProps(EventDetail)},


    ProgramList: {screen: ProgramList},
    SurveyList: {screen: SurveyList},

    CreateMacroPlan: {
        screen: paramsToProps(CreateMacroPlan)
    }


}, {
    headerMode: 'screen',
    initialRouteName: 'Home',
    navigationOptions: ({navigation}) => {
        const {state, setParams} = navigation;
        return {
            headerRight: state.params && state.params.handleSave ?
                <Save save={state.params.handleSave} text={state.params.saveText ? state.params.saveText : null}
                      disabled={state.params.disabled ? state.params.disabled : false}/>
                : <View />,
            headerTitle: state.params && state.params.headerTitle ? state.params.headerTitle : null,
            ...defaultNavigationOptions,
        };
    },
    cardStyle: {
        backgroundColor: 'white'
    }
});


const prevGetStateHomeNav = HomeNav.router.getStateForAction;
HomeNav.router = {
    ...HomeNav.router,
    getStateForAction(action, state) {
        if (state && action.type === 'ReplaceCurrentScreen') {
            const routes = state.routes.slice(0, state.routes.length - 1);
            routes.push(action);
            return {
                ...state,
                routes,
                index: routes.length - 1,
            };
        }
        return prevGetStateHomeNav(action, state)
    }
}

const CalendarNav = StackNavigator({
    Calendar: {
        screen: Calendar,
        navigationOptions: {
            header: null,
        }
    },
    CreateEvent: {screen: paramsToProps(CreateEvent)},
    EventDetail: {screen: paramsToProps(EventDetail)},
    Profile: {screen: paramsToProps(Profile)},
}, {
    headerMode: 'screen',
    initialRouteName: 'Calendar',
    navigationOptions: ({navigation}) => {
        const {state, setParams} = navigation;
        return {
            headerRight: state.params && state.params.handleSave ?
                <Save save={state.params.handleSave} text={state.params.saveText ? state.params.saveText : null}
                      disabled={state.params.disabled ? state.params.disabled : false}/>
                : <View />,
            ...defaultNavigationOptions,
        };
    },
    cardStyle: {
        backgroundColor: 'white'
    }
});

const ChatNav = StackNavigator({
    Chat: {
        path: 'chat/',
        screen: Chat,
        navigationOptions: {
            header: null,
        }
    },
    CreateChatRoom: {screen: paramsToProps(CreateChatRoom)},
    ChatRoom: {screen: paramsToProps(ChatRoom)},
}, {
    headerMode: 'screen',
    initialRouteName: 'Chat',
    navigationOptions: ({navigation}) => {
        const {state, setParams} = navigation;
        return {
            headerRight: state.params && state.params.handleSave ?
                <Save save={state.params.handleSave} text={state.params.saveText ? state.params.saveText : null}
                      disabled={state.params.disabled ? state.params.disabled : false}/>
                : <View />,
            ...defaultNavigationOptions,
        };
    },
    cardStyle: {
        backgroundColor: 'white'
    }
});


const MainTabNav = TabNavigator({
    Chat: {
        screen: ChatNav,
        navigationOptions: {
            tabBarIcon: (data) => <Icon size={24} color={data.tintColor} name="comment"/>
        }
    },
    Home: {
        screen: HomeNav,
        navigationOptions: {
            tabBarIcon: (data) => <Icon size={24} color={data.tintColor} name="home"/>
        },
    },
    Calendar: {
        path: 'calendar/',
        screen: CalendarNav,
        navigationOptions: {
            tabBarIcon: (data) => <Icon size={24} color={data.tintColor} name="date-range"/>
        }
    },
    // Feed: {
    //     screen: Feed,
    //     navigationOptions: {
    //         header: null,
    //         tabBarIcon: (data) => <Icon size={24} color={data.tintColor} name="list"/>
    //     }
    // },
}, {
    tabBarComponent: props => {
        const {navigation, navigationState} = props
        const jumpToIndex = index => {
            const lastPosition = navigationState.index
            const tab = navigationState.routes[index]
            const tabRoute = tab.routeName;
            if (!tab.routes) {
                navigation.dispatch(NavigationActions.navigate({routeName: tabRoute}));
                return;
            }
            const firstTab = tab.routes[0].routeName;

            lastPosition !== index && navigation.dispatch(NavigationActions.navigate({routeName: tabRoute}))
            lastPosition === index && navigation.dispatch(NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({routeName: firstTab}),
                ],
            }));
        };
        return <TabBarBottom {...props} jumpToIndex={jumpToIndex}/>
    },
    initialRouteName: 'Home',
    tabBarPosition: 'bottom',
    lazy: true,
    swipeEnabled: false,
    animationEnabled: false,
    navigationOptions: {
        header: null,
    },
    tabBarOptions: {
        showLabel: false,
        activeTintColor: lightGreen
    }
});

export const AppNavigator = StackNavigator({
    SplashScreen: {
        screen: SplashScreen,
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
    EditProfile: {screen: EditProfile},

    Main: {screen: MainTabNav},
}, {
    headerMode: 'screen',
    initialRouteName: 'SplashScreen',
    navigationOptions: ({navigation}) => {
        const {state, setParams} = navigation;
        return {
            headerRight: state.params && state.params.handleSave ?
                <Save save={state.params.handleSave} text={state.params.saveText ? state.params.saveText : null}
                      disabled={state.params.disabled ? state.params.disabled : false}/>
                : <View />,
            ...defaultNavigationOptions,
        };
    },
    cardStyle: {
        backgroundColor: 'white'
    }
});