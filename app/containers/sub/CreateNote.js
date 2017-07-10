import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Keyboard,
    TouchableOpacity,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as GlobalActions from '../../actions/globalActions';


const CreateNote = React.createClass({
    propTypes: {
        type: React.PropTypes.string.isRequired,
        object_id: React.PropTypes.number.isRequired
    },

    asyncActions(start){
        if (start) {
            this.refs.postbutton.setState({busy: true});
        } else {
            this.refs.postbutton.setState({busy: false});
            this.props.navigation.goBack();
        }
    },

    submit() {

    },

    render: function () {
        return (
            <View style={{flex: 1}}>
                <ScrollView style={styles.flexCenter} keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.contentContainerStyle}>

                    <View style={{marginBottom: 10}}>
                        <Text>test</Text>
                    </View>


                </ScrollView>
                <View style={styles.footer}>

                </View>
            </View>
        )
    }
});

const iconColor = '#8E8E8E';

const styles = StyleSheet.create({
    flexCenter: {
        flex: .9,
    },
    footer: {
        borderTopWidth: 1,
        borderColor: '#e1e3df',
        alignItems: 'center',
        minHeight: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: .1
    }
});


const stateToProps = (state) => {
    return state.Global;
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch)
    }
};

export default connect(stateToProps, dispatchToProps)(CreateNote);
