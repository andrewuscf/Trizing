import _ from 'lodash';

// Main Pages
import Home from './containers/Home';
import Calendar from './containers/Calendar';
import Feed from './containers/Feed';
import Chat from './containers/Chat';
import Profile from './containers/Profile';


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

// Create Pages
import CreateWorkout from './containers/sub/CreateWorkout';
import CreateSchedule from './containers/sub/CreateSchedule';
import CreateWorkoutDay from './containers/sub/CreateWorkoutDay';
import CreateExercise from './containers/sub/CreateExercise';
import CreateEvent from './containers/sub/CreateEvent';
import CreateChatRoom from './containers/sub/CreateChatRoom';

const MAIN_ROUTES = [
    {component: Home, name: 'Home'},
    {component: Calendar, name: 'Calendar'},
    {component: Feed, name: 'Feed'},
    {component: Chat, name: 'Chat'},
    {component: Profile, name: 'Profile'},
    {component: EditProfile, name: 'EditProfile'},
    {component: ManageClients, name: 'ManageClients'},
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
    {component: CreateChatRoom, name: 'CreateChatRoom'}
];

export function getRoute(routeName, props) {
    const index = _.findIndex(MAIN_ROUTES, {name: routeName});
    if (props)
        return {component: MAIN_ROUTES[index].component, name: routeName, passProps: props};
    else
        return {component: MAIN_ROUTES[index].component, name: routeName};
}
