import React, {Component} from 'react';
import {Animated} from 'react-native';
import {connect} from 'react-redux';
import {TabBarBottom, NavigationActions} from 'react-navigation';

const TAB_BAR_OFFSET = -60;

class CustomTabBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: new Animated.Value(0),
        };
    }

    componentWillReceiveProps(props) {
        const wasVisible = this.props.tabBarOpen;
        const isVisible = props.tabBarOpen;

        if (wasVisible && !isVisible) {
            Animated.timing(this.state.offset, {toValue: TAB_BAR_OFFSET, duration: 200}).start();
        } else if (isVisible && !wasVisible) {
            Animated.timing(this.state.offset, {toValue: 0, duration: 200}).start();
        }
    }


    render() {
        const {navigation, navigationState} = this.props
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


        return (
            <Animated.View style={[styles.container, {bottom: this.state.offset}]}>
                <TabBarBottom {...this.props} jumpToIndex={jumpToIndex}/>
            </Animated.View>
        );
    }
}

const styles = {
    container: {
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        elevation: 8,
    },
};

const stateToProps = (state) => {
    return {
        tabBarOpen: state.Global.tabBarOpen,
    };
};

export default connect(stateToProps)(CustomTabBar);