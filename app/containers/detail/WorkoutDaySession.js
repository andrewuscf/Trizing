import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    Platform,
    ListView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

import {getFontSize} from '../../actions/utils';
import GlobalStyle from '../globalStyle';
import {getRoute} from '../../routes';

import BackBar from '../../components/BackBar';

const WorkoutDaySession = React.createClass({
    propTypes: {
        workout_day: React.PropTypes.object.isRequired,
    },


    render: function () {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(this.props.workout_day.exercises);
        console.log(this.props.workout_day.exercises)
        return (
            <ListView ref='exercise_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                      keyboardShouldPersistTaps="handled"
                      style={styles.container} enableEmptySections={true}
                      dataSource={dataSource}
                      renderRow={(exercise, sectionID, rowID) =>
                          <Text>test</Text>
                      }
            />
        );
    }
});


const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'white',
    },
    dayTitle: {
        fontSize: getFontSize(30),
        fontFamily: 'OpenSans-Semibold',
        textAlign: 'center'
    }
});

export default WorkoutDaySession;
