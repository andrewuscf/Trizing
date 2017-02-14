import _ from 'lodash';

// Main Pages
import Home from './containers/Home';

// Edit Pages
import EditProfile from './containers/edit/EditProfile';

// Create Pages
import AddClient from './containers/create/AddClient';

var MAIN_ROUTES = [
    {component: Home, name: 'Home'},
    {component: EditProfile, name: 'EditProfile'},
    {component: AddClient, name: 'AddClient'}
];

export function getRoute(routeName, props) {
    const index = _.findIndex(MAIN_ROUTES, {name: routeName});
    if (props)
        return {component: MAIN_ROUTES[index].component, name: routeName, passProps: props};
    else
        return {component: MAIN_ROUTES[index].component, name: routeName};
}
