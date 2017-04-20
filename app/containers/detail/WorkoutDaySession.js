import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    Platform,
    ListView,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

import {getFontSize} from '../../actions/utils';
import GlobalStyle from '../globalStyle';
import {getRoute} from '../../routes';

import BackBar from '../../components/BackBar';
import SetLogBox from '../../components/SetLogBox';


const window = Dimensions.get('window');

const WorkoutDaySession = React.createClass({
    propTypes: {
        workout_day: React.PropTypes.object.isRequired,
    },

    renderHeader() {
        return (
            <BackBar back={this.props.navigator.pop}>
                <Text style={styles.header}>{this.props.workout_day.name}</Text>
            </BackBar>
        )
    },


    render: function () {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(this.props.workout_day.exercises);
        console.log(this.props.workout_day.exercises)
        return (
            <ListView ref='exercise_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                      keyboardShouldPersistTaps="handled"
                      renderHeader={this.renderHeader}
                      style={styles.container} enableEmptySections={true}
                      dataSource={dataSource}
                      renderRow={(exercise, sectionID, rowID) =>
                          <View style={styles.exerciseBox}>
                              <Text style={styles.exerciseName}>{exercise.name}</Text>
                              <View style={styles.setsHeader}>
                                  <Text style={styles.setColumn}>Set</Text>
                                  <Text style={styles.setColumn}>LBS</Text>
                                  <Text style={styles.setColumn}>REPS</Text>
                              </View>
                              {exercise.sets.map((set, index)=>{
                                  return <SetLogBox key={index} set={set}/>
                              })}
                          </View>
                      }
            />
        );
    }
});


const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'white',
    },
    header: {
        fontSize: getFontSize(30),
        fontFamily: 'OpenSans-bold',
    },
    exerciseBox: {
        marginBottom: 5,
        backgroundColor: 'white',

    },
    exerciseName: {
        fontSize: getFontSize(26),
        fontFamily: 'OpenSans-Semibold',
        textAlign: 'center',
        padding: 5,
    },
    setsHeader: {
        flexDirection: 'row',
    },
    setColumn: {
        width: window.width / 3,
        // borderWidth: .5,
        // borderColor: '#e1e3df',
        textAlign: 'center'
    }
});

export default WorkoutDaySession;
