import _ from 'lodash';

import EditProfile from './containers/edit/EditProfile';
import Home from './containers/Home';

var MAIN_ROUTES = [
    {component: Home, name: 'Home'},
    {component: EditProfile, name: 'EditProfile'},
];

export function getRoute(routeName, props = null) {
    const index = _.findIndex(MAIN_ROUTES, {name: routeName});
    return {
        component: MAIN_ROUTES[index].component, name: routeName, passProps: props
    }
}
