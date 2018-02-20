import React from 'react';
const CreateClass = require('create-react-class');
import {TabNavigator, StackNavigator, TabBarBottom, NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Save from './components/NavBarSave';

// Main Pages
import Home from './containers/Home';
import Calendar from './containers/Calendar';
import Chat from './containers/Chat';
import Login from './containers/Login';
import ResetPassword from './containers/ResetPassword';
import SignUp from './containers/SignUp';
import SplashScreen from './containers/SplashScreen';

// Sub Pages
import Notifications from './containers/sub/Notifications';
import TrainingPlan from './containers/sub/TrainingPlan';
import ManageClients from './containers/sub/ManageClients';

// Edit Pages
import EditSchedule from './containers/edit/EditSchedule';
import EditWorkout from './containers/edit/EditWorkout';
import EditWorkoutDay from './containers/edit/EditWorkoutDay';

// Detail Pages
// import ChatRoom from './containers/detail/ChatRoom';
import EventDetail from './containers/detail/EventDetail';
import MacroPlanDetail from './containers/detail/MacroPlanDetail';
import ScheduleDetail from './containers/detail/ScheduleDetail';
import WorkoutDetail from './containers/detail/WorkoutDetail';
import WorkoutDaySession from './containers/detail/WorkoutDaySession';
import AnswerQuestionnaire from './containers/detail/AnswerQuestionnaire';
import AnswersDisplay from './containers/detail/AnswersDisplay';
import MacroLogDetail from './containers/detail/MacroLogDetail';
import WorkoutDayDetail from './containers/detail/WorkoutDayDetail';
import SetGroupDetail from './containers/detail/SetGroupDetail';

// Create Pages
import CreateSchedule from './containers/sub/CreateSchedule';
import CreateWorkoutDay from './containers/sub/CreateWorkoutDay';
import CreateExercise from './containers/sub/CreateExercise';
// import CreateEvent from './containers/sub/CreateEvent';
// import CreateChatRoom from './containers/sub/CreateChatRoom';
import CreateMacroLog from './containers/sub/CreateMacroLog';
import CreateQuestionnaire from './containers/sub/CreateQuestionnaire';
import CreateNote from './containers/sub/CreateNote';
import CreateWeightLog from './containers/sub/CreateWeightLog';

// Profile Pages
import Profile from './containers/profile/Profile';
import MyProfile from './containers/profile/MyProfile';
import EditProfile from './containers/profile/EditProfile';

// Trainer Pages
import ProgramList from './containers/trainer/ProgramList';
import FindPrograms from './containers/trainer/FindPrograms';
import SurveyList from './containers/trainer/SurveyList';
import CreateMacroPlan from './containers/trainer/CreateMacroPlan';
import MacroPlanList from './containers/trainer/MacroPlanList';

// Payments
import PayoutInfo from './containers/payment/PayoutInfo';
import Payment from './containers/payment/Payment';
import Earnings from './containers/payment/Earnings';

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

const globalBlue = '#00AFA3';

const defaultNavigationOptions = {
    headerStyle: {
        backgroundColor: 'white'
    },
    headerBackTitle: null,
    headerTitleStyle: {
        fontFamily: 'Heebo-Bold',
    },
    headerTintColor: globalBlue,
    gesturesEnabled: true
};

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
            headerTitle: 'Login',
        }
    },
    ResetPassword: {
        screen: ResetPassword,
        navigationOptions: {
            headerTitle: 'Reset Password',
        }
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            headerTitle: 'Create an account',
        }
    },
    EditProfile: {screen: EditProfile},

    Home: {
        screen: Home,
        navigationOptions: {
            headerTitle: null,
        }
    },
    ManageClients: {screen: ManageClients},
    Notifications: {
        screen: Notifications,
        navigationOptions: {
            headerTitle: 'Notifications',
        }
    },
    CreateMacroLog: {
        screen: paramsToProps(CreateMacroLog)
    },
    CreateWeightLog: {
        screen: paramsToProps(CreateWeightLog),
        navigationOptions: {
            headerTitle: 'Log Weight',
        }
    },

    Profile: {
        screen: paramsToProps(Profile),
    },

    MyProfile: {
        screen: MyProfile,
    },


    CreateQuestionnaire: {screen: CreateQuestionnaire},


    AnswerQuestionnaire: {screen: paramsToProps(AnswerQuestionnaire)},
    AnswersDisplay: {screen: paramsToProps(AnswersDisplay)},


    MacroPlanDetail: {screen: paramsToProps(MacroPlanDetail)},
    ScheduleDetail: {screen: paramsToProps(ScheduleDetail)},


    TrainingPlan: {screen: paramsToProps(TrainingPlan)},
    EditWorkout: {screen: paramsToProps(EditWorkout)},
    CreateWorkoutDay: {screen: paramsToProps(CreateWorkoutDay)},
    CreateExercise: {screen: paramsToProps(CreateExercise)},
    EditWorkoutDay: {screen: paramsToProps(EditWorkoutDay)},
    CreateSchedule: {screen: paramsToProps(CreateSchedule)},
    EditSchedule: {screen: paramsToProps(EditSchedule)},
    WorkoutDetail: {screen: paramsToProps(WorkoutDetail)},
    WorkoutDayDetail: {screen: paramsToProps(WorkoutDayDetail)},
    WorkoutDaySession: {screen: paramsToProps(WorkoutDaySession)},
    SetGroupDetail: {screen: paramsToProps(SetGroupDetail)},

    EventDetail: {screen: paramsToProps(EventDetail)},


    ProgramList: {screen: paramsToProps(ProgramList)},
    SurveyList: {screen: SurveyList},
    MacroPlanList: {screen: MacroPlanList},

    CreateMacroPlan: {
        screen: paramsToProps(CreateMacroPlan)
    },

    MacroLogDetail: {
        screen: paramsToProps(MacroLogDetail)
    },

    CreateNote: {
        screen: paramsToProps(CreateNote),
        navigationOptions: {
            headerTitle: 'Add Note',
        }
    },


    // Payments
    Earnings: {
        screen: Earnings,
        navigationOptions: {
            headerTitle: 'Earnings',
        }
    },
    PayoutInfo: {
        screen: paramsToProps(PayoutInfo)
    },
    Payment: {
        screen: Payment,
        navigationOptions: {
            headerTitle: 'Payment',
        }
    },
    FindPrograms: {
        screen: FindPrograms,
    }
}, {
    headerMode: 'screen',
    initialRouteName: 'SplashScreen',
    navigationOptions: ({navigation}) => {
        const {state, setParams} = navigation;
        let headerRight = null;
        if (state.params) {
            if(state.params.handleSave) {
                headerRight = <Save save={state.params.handleSave} text={state.params.saveText ? state.params.saveText : null}
                                    disabled={state.params.disabled ? state.params.disabled : false}/>;
            } else if (state.params.right) {
                headerRight = state.params.right
            }
        }
        return {
            headerRight: headerRight,
            headerTitle: state.params && state.params.headerTitle ? state.params.headerTitle : null,
            ...defaultNavigationOptions,
        };
    },
    cardStyle: {
        flex: 1,
        backgroundColor: 'white'
    }
});

const prevGetStateForAction = AppNavigator.router.getStateForAction;
AppNavigator.router.getStateForAction = (action, state) => {
    if (action.type === 'Navigation/BACK' && state && state.routes[state.index].routeName === 'SplashScreen') {
        return null;
    } else if (state && action.type === 'ReplaceCurrentScreen') {
        const routes = state.routes.slice(0, state.routes.length - 1);
        routes.push(action);
        return {
            ...state,
            routes,
            index: routes.length - 1,
        };
    }
    return prevGetStateForAction(action, state);
};
