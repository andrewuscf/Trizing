import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    TouchableOpacity,
    Platform,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';

import * as GlobalActions from '../../actions/globalActions';
import GlobalStyle from '../globalStyle';
import {getFontSize} from '../../actions/utils';

import CustomIcon from '../../components/CustomIcon';

const ProgramList = React.createClass({
    propTypes: {
        // Refreshing: React.PropTypes.bool.isRequired,
    },


    componentDidMount() {
        this.getNeeded(true);
    },

    getNeeded(refresh = false) {
        if (this.props.RequestUser.type == 1) {
            this.props.getSchedules('?template=true', refresh);
        }
    },


    _refresh() {
        this.getNeeded(true);
    },

    onEndReached() {
    },

    _redirect(routeName, props = null) {
        this.props.navigation.navigate(routeName, props);
    },


    render() {
        const isTrainer = this.props.RequestUser.type == 1;
        const {navigate} = this.props.navigation;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const SchedulesDs = ds.cloneWithRows(_.filter(this.props.Schedules, function (o) {
            return !o.training_plan;
        }));
        return (
            <View style={{flex: 1}}>
                <ListView ref='schedules_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                          enableEmptySections={true} dataSource={SchedulesDs}
                          renderRow={(schedule) =>
                              <TouchableOpacity style={styles.link}
                                                onPress={this._redirect.bind(null, 'EditSchedule', {scheduleId: schedule.id})}>
                                  <Text style={styles.simpleTitle}>{schedule.name}</Text>
                                  <MaterialIcon name="keyboard-arrow-right" size={getFontSize(18)}
                                                style={styles.linkArrow}/>
                              </TouchableOpacity>
                          }
                />
                {isTrainer ?
                    <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right">
                        <ActionButton.Item buttonColor='#9b59b6' title="New Workout template"
                                           onPress={() => navigate('CreateSchedule')}>
                            <CustomIcon name="barbell" color="white" size={getFontSize(30)}/>
                        </ActionButton.Item>
                    </ActionButton>
                    : null
                }
            </View>
        )
    }
});


const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    simpleTitle: {
        fontSize: getFontSize(18),
        color: '#b1aea5',
        fontFamily: 'OpenSans-Semibold',
        margin: 10,
        flex: 17
    },
    link: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderColor: '#e1e3df',
    },
    linkArrow: {
        flex: 1
    }
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        Schedules: state.Global.Schedules,
    };
};

const dispatchToProps = (dispatch) => {
    return {
        getSchedules: bindActionCreators(GlobalActions.getSchedules, dispatch),
    }
};

export default connect(stateToProps, dispatchToProps)(ProgramList);
