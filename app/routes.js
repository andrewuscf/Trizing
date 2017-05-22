import React from 'react'
import {Platform} from 'react-native';
import {TabNavigator, StackNavigator, NavigationActions, TabBarBottom, DrawerNavigator} from 'react-navigation';
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
import MyProfile from './containers/profile/MyProfile';


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

const navBlue = '#000000';


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

    MyProfile: {
        path: 'profile/me',
        screen: paramsToProps(MyProfile),
    },
    EditProfile: {screen: EditProfile},

    Profile: {screen: paramsToProps(Profile)},



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


}, {
    headerMode: 'screen',
    initialRouteName: 'Home',
    navigationOptions: ({navigation}) => {
        const {state, setParams} = navigation;
        return {
            headerRight: state.params && state.params.handleSave ?
                <Save save={state.params.handleSave} text={state.params.saveText ? state.params.saveText : null}/>
                : null,
            headerStyle: {
                backgroundColor: 'white'
            },
            headerBackTitle: null
        };
    },
    cardStyle: {
        // flex: 1,
        // marginTop: (Platform.OS === 'ios') ? 20 : 0,
        backgroundColor: 'white'
    }
});

const CalendarNav = StackNavigator({
    Calendar: {
        screen: Calendar,
        navigationOptions: {
            header: null,
        }
    },
    CreateEvent: {screen: CreateEvent},
    EventDetail: {screen: paramsToProps(EventDetail)},
    Profile: {screen: paramsToProps(Profile)},
}, {
    initialRouteName: 'Calendar',
    navigationOptions: ({navigation}) => {
        const {state, setParams} = navigation;
        return {
            headerRight: state.params && state.params.handleSave ?
                <Save save={state.params.handleSave} text={state.params.saveText ? state.params.saveText : null}/>
                : null,
            headerStyle: {
                backgroundColor: 'white'
            }
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
    CreateChatRoom: {screen: CreateChatRoom},
    ChatRoom: {screen: paramsToProps(ChatRoom)},
}, {
    initialRouteName: 'Chat',
    navigationOptions: ({navigation}) => {
        const {state, setParams} = navigation;
        return {
            headerRight: state.params && state.params.handleSave ?
                <Save save={state.params.handleSave} text={state.params.saveText ? state.params.saveText : null}/>
                : null,
            headerStyle: {
                backgroundColor: 'white'
            }
        };
    },
    cardStyle: {
        backgroundColor: 'white'
    }
});

// const ProfileNav = StackNavigator({
//     MyProfile: {
//         path: 'profile/me',
//         screen: paramsToProps(MyProfile),
//         navigationOptions: {
//             header: null,
//         }
//     },
//     EditProfile: {screen: EditProfile},
//
//     Profile: {screen: paramsToProps(Profile)},
// }, {
//     initialRouteName: 'MyProfile',
//     navigationOptions: ({navigation}) => {
//         const {state, setParams} = navigation;
//         return {
//             headerRight: state.params && state.params.handleSave ?
//                 <Save save={state.params.handleSave} text={state.params.saveText ? state.params.saveText : null}/>
//                 : null,
//             headerStyle: {
//                 backgroundColor: 'white'
//             }
//         };
//     },
//     cardStyle: {
//         backgroundColor: 'white'
//     }
// });


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
    // Chat: {
    //     screen: ChatNav,
    //     navigationOptions: {
    //         tabBarIcon: (data) => <Icon size={24} color={data.tintColor} name="comment"/>
    //     }
    // },
    // MyProfile: {
    //     screen: ProfileNav,
    //     navigationOptions: {
    //         headerStyle: {
    //             position: 'absolute',
    //             right: 0,
    //             top: 0,
    //             left: 0,
    //             backgroundColor: 'transparent',
    //         },
    //         tabBarIcon: (data) => <Icon size={24} color={data.tintColor}
    //                                     name="account-circle"/>
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
    swipeEnabled: true,
    animationEnabled: false,
    navigationOptions: {
        header: null,
    },
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

    // PostDetail: {screen: paramsToProps(PostDetail)},


    Main: {screen: MainTabNav},
}, {
    headerMode: 'screen',
    initialRouteName: 'SplashScreen',
    navigationOptions: ({navigation}) => {
        const {state, setParams} = navigation;
        return {
            headerRightheaderRight: state.params && state.params.handleSave ?
                <Save save={state.params.handleSave} text={state.params.saveText ? state.params.saveText : null}/>
                : null,
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