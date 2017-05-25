import React from 'react'
import {Platform} from 'react-native';
import {TabNavigator, StackNavigator, TabBarBottom, DrawerNavigator} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import CustomTabBar from './components/CustomTabBar';
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

const defaultNavigationOptions = {
    headerStyle: {
        backgroundColor: 'white'
    },
    headerBackTitle: null,
    headerTitleStyle: {
        textAlign: 'center',
    }
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


}, {
    headerMode: 'screen',
    initialRouteName: 'Home',
    navigationOptions: ({navigation}) => {
        const {state, setParams} = navigation;
        return {
            headerRight: state.params && state.params.handleSave ?
                <Save save={state.params.handleSave} text={state.params.saveText ? state.params.saveText : null}/>
                : null,
            ...defaultNavigationOptions,
        };
    },
    cardStyle: {
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
    headerMode: 'screen',
    initialRouteName: 'Calendar',
    navigationOptions: ({navigation}) => {
        const {state, setParams} = navigation;
        return {
            headerRight: state.params && state.params.handleSave ?
                <Save save={state.params.handleSave} text={state.params.saveText ? state.params.saveText : null}/>
                : null,
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
                <Save save={state.params.handleSave} text={state.params.saveText ? state.params.saveText : null}/>
                : null,
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
    tabBarComponent: CustomTabBar,
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

    // PostDetail: {screen: paramsToProps(PostDetail)},


    Main: {screen: MainTabNav},
}, {
    headerMode: 'screen',
    initialRouteName: 'SplashScreen',
    navigationOptions: ({navigation}) => {
        const {state, setParams} = navigation;
        return {
            headerRight: state.params && state.params.handleSave ?
                <Save save={state.params.handleSave} text={state.params.saveText ? state.params.saveText : null}/>
                : null,
            ...defaultNavigationOptions,
        };
    },
    cardStyle: {
        backgroundColor: 'white'
    }
});