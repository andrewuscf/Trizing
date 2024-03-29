import React from 'react';

const CreateClass = require('create-react-class');
import {Platform, AsyncStorage, Linking, View, StyleSheet, Text} from 'react-native';
import {connect} from 'react-redux';
import {MenuProvider} from 'react-native-popup-menu';
import {
    setCustomText,
    setCustomTouchableOpacity,
    setCustomScrollView,
    setCustomListView,
} from 'react-native-global-props';
import t from 'tcomb-form-native';

import {AppNavigator} from './routes';
import {getFontSize} from './actions/utils';
import tCombStylesheet from "./assets/tcombStylesheet";


setCustomText({
    style: {
        fontSize: getFontSize(14),
        fontFamily: 'Heebo-Regular',
    }
});
setCustomTouchableOpacity({
    hitSlop: {top: 5, right: 5, left: 5, bottom: 5},
    activeOpacity: .9,
});
setCustomListView({
    contentContainerStyle: {paddingBottom: 30}
});
setCustomScrollView({
    contentContainerStyle: {paddingBottom: 30}
});

const App = CreateClass({
    componentDidMount() {
        Linking.addEventListener('url', this.handleURL);
        Linking.getInitialURL().then(this.handleURL);
    },

    handleURL(url) {
        if (url && !this.props.RequestUser) AsyncStorage.setItem('deep_link', url.url ? url.url : url);
    },

    render() {
        const prefix = Platform.OS === 'android' ? 'trainerbase://trainerbase/' : 'trainerbase://';
        return (
            <MenuProvider lazyRender={200}>
                <AppNavigator uriPrefix={prefix}/>
                {this.props.Error ?
                    <View style={[styles.appMessage,
                        this.props.Error && this.props.Error.bColor ?
                            {backgroundColor: this.props.Error.bColor, borderColor: this.props.Error.bColor}: null]}>
                        <Text style={styles.appMessageText}>
                            {this.props.Error && this.props.Error.title ? this.props.Error.title : 'Action could not be performed.'}
                        </Text>
                        {this.props.Error && this.props.Error.text ? <Text style={styles.appMessageText}>
                                {this.props.Error.text}
                            </Text>
                            : null
                        }
                    </View> : null}
            </MenuProvider>
        );
    }
});

const styles = StyleSheet.create({
    appMessage: {
        flexWrap: 'wrap',
        position: 'absolute',
        alignSelf: 'center',
        bottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'grey',
        padding: 10,
        paddingRight: 20,
        paddingLeft: 20,
        borderWidth: 1,
        borderColor: 'grey'
    },
    appMessageText: {
        textAlign: 'center',
        color: 'white'
    }
});

// override tcomb globally
const templates = {
    ...t.form.Form.templates,
    select: require("./components/tcomb/select"),
    datepicker: require("./components/tcomb/datepicker"),
};
t.form.Form.templates = templates;
t.form.Form.defaultProps = {
    ...t.form.Form.defaultProps,
    templates: templates
};
t.form.Form.defaultProps.stylesheet = tCombStylesheet;


const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        Error: state.Global.Error
    }
};

export default connect(stateToProps, null)(App);

