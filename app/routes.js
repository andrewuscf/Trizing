import _ from 'lodash';

// Main Pages
import Home from './containers/Home';
import Profile from './containers/Profile';

// Edit Pages
import EditProfile from './containers/edit/EditProfile';

// Create Pages
import ManageClients from './containers/create/ManageClients';

var MAIN_ROUTES = [
    {component: Home, name: 'Home'},
    {component: Profile, name: 'Profile'},
    {component: EditProfile, name: 'EditProfile'},
    {component: ManageClients, name: 'ManageClients'},
];

export function getRoute(routeName, props) {
    const index = _.findIndex(MAIN_ROUTES, {name: routeName});
    if (props)
        return {component: MAIN_ROUTES[index].component, name: routeName, passProps: props};
    else
        return {component: MAIN_ROUTES[index].component, name: routeName};
}
