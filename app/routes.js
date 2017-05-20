import _ from 'lodash';
import {Platform} from 'react-native';

import {StackNavigator} from 'react-navigation';

// Main Pages
import Home from './containers/Home';
import Calendar from './containers/Calendar';
import Feed from './containers/Feed';
import Chat from './containers/Chat';
import Profile from './containers/Profile';
import Login from './containers/Login';
import Loading from './components/Loading';
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

const MAIN_ROUTES = [
    // {component: Home, name: 'Home'},
    // {component: Calendar, name: 'Calendar'},
    {component: Feed, name: 'Feed'},
    {component: Chat, name: 'Chat'},
    // {component: Profile, name: 'Profile'},
    // {component: Login, name: 'Login'},
    {component: Loading, name: 'Loading'},
    // {component: EditProfile, name: 'EditProfile'},
    // {component: ManageClients, name: 'ManageClients'},
    {component: Notifications, name: 'Notifications'},
    {component: TrainingPlan, name: 'TrainingPlan'},
    {component: CreateWorkout, name: 'CreateWorkout'},
    {component: EditWorkout, name: 'EditWorkout'},
    {component: CreateWorkoutDay, name: 'CreateWorkoutDay'},
    {component: CreateExercise, name: 'CreateExercise'},
    {component: WorkoutDayDetail, name: 'WorkoutDayDetail'},
    {component: EventDetail, name: 'EventDetail'},
    {component: PostDetail, name: 'PostDetail'},
    {component: CreateEvent, name: 'CreateEvent'},
    {component: ChatRoom, name: 'ChatRoom'},
    {component: CreateSchedule, name: 'CreateSchedule'},
    {component: EditSchedule, name: 'EditSchedule'},
    {component: CreateChatRoom, name: 'CreateChatRoom'},
    {component: MacroPlanDetail, name: 'MacroPlanDetail'},
    {component: CreateMacroLog, name: 'CreateMacroLog'},
    {component: ScheduleDetail, name: 'ScheduleDetail'},
    {component: WorkoutDetail, name: 'WorkoutDetail'},
    {component: WorkoutDaySession, name: 'WorkoutDaySession'},
    {component: CreateQuestionnaire, name: 'CreateQuestionnaire'},
    {component: AnswerQuestionnaire, name: 'AnswerQuestionnaire'},
    {component: AnswersDisplay, name: 'AnswersDisplay'},
];

export function getRoute(routeName, props) {
    const index = _.findIndex(MAIN_ROUTES, {name: routeName});
    if (props)
        return {component: MAIN_ROUTES[index].component, name: routeName, passProps: props};
    else
        return {component: MAIN_ROUTES[index].component, name: routeName};
}

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

export const AppNavigator = StackNavigator({
    SplashScreen: {
        screen: SplashScreen,
        headerMode: 'none',
        navigationOptions: {
            headerMode: 'none',
        },

    },
    Login: {screen: Login},

    Profile: {screen: Profile},
    EditProfile: {screen: EditProfile},

    ManageClients: {screen: ManageClients},


    Home: {screen: Home},
    Calendar: {
        path: 'calendar/',
        screen: Calendar,
    },

}, {
    headerMode: 'screen',
    initialRouteName: 'SplashScreen',
    navigationOptions: {header: null},
    cardStyle: {
        flex: 1,
        marginTop: (Platform.OS === 'ios') ? 20 : 0,
        backgroundColor: 'white'
    }
});