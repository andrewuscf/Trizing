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
import CreateWorkout from './containers/sub/CreateWorkout';

// Edit Pages
import EditProfile from './containers/edit/EditProfile';

// Create Pages

var MAIN_ROUTES = [
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
];

export function getRoute(routeName, props) {
    const index = _.findIndex(MAIN_ROUTES, {name: routeName});
    if (props)
        return {component: MAIN_ROUTES[index].component, name: routeName, passProps: props};
    else
        return {component: MAIN_ROUTES[index].component, name: routeName};
}
