import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    RefreshControl,
    Platform,
    ListView,
    Alert,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';

import * as GlobalActions from '../../actions/globalActions';
import {trunc, fetchData, API_ENDPOINT, checkStatus, getFontSize} from '../../actions/utils';
import {DAYS_OF_WEEK} from '../../assets/constants';
import GlobalStyle from '../../containers/globalStyle';

import CustomIcon from '../../components/CustomIcon';
import DisplayExerciseBox from '../../components/trainer/DisplayExerciseBox';
import Loading from '../../components/Loading';

const EditWorkoutDay = React.createClass({
    propTypes: {
        workout_day_id: React.PropTypes.number,
    },

    getInitialState() {
        return {
            workout_day: this.props.workout_day,
            refreshing: false,
        }
    },

    componentDidMount() {
        if (!this.props.workout_day) {
            this.getWorkoutDay();
        }
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.state.workout_day !== prevState.workout_day) {
            const dayOfWeek = _.find(DAYS_OF_WEEK, {id: this.state.workout_day.day});
            this.props.navigation.setParams({headerTitle: `${trunc(this.state.workout_day.name, 14)} (${dayOfWeek.day})`})
        }
    },

    getWorkoutDay(refresh) {
        if (refresh) this.setState({refreshing: true});

        fetch(`${API_ENDPOINT}training/workout/day/${this.props.workout_day_id}/`,
            fetchData('GET', null, this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                let newState = {refreshing: false};
                if (responseJson.id) {
                    newState = {
                        ...newState,
                        workout_day: responseJson
                    }
                }
                this.setState(newState);
            }).catch((error) => {
            console.log(error)
        })
    },

    renderHeader() {
        if (!this.state.workout_day.notes.length) {
            return null;
        }
        return (
            <View style={[GlobalStyle.simpleBottomBorder, styles.headerContainer]}>
                <Text style={styles.smallBold}>Notes:</Text>
                {this.state.workout_day.notes.map((note, i) =>
                    <Text key={i} style={[{
                        paddingLeft: 15,
                        paddingRight: 15,
                        paddingBottom: 10
                    }, styles.notBold]}>{i + 1}. {note.text}</Text>)
                }
            </View>
        )
    },

    render: function () {
        if (!this.state.workout_day) return <Loading/>;

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(this.state.workout_day.exercises);

        return (
            <View style={styles.container}>
                <ListView ref='workout_day_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                          keyboardShouldPersistTaps="handled"
                          refreshControl={<RefreshControl refreshing={this.state.refreshing}
                                                          onRefresh={() => this.getWorkoutDay(true)}/>}
                          enableEmptySections={true}
                          dataSource={dataSource}
                          renderHeader={this.renderHeader}
                          showsVerticalScrollIndicator={false}
                          contentContainerStyle={{paddingBottom: 20}}
                          renderRow={(set_group, sectionID, rowID) =>
                              <DisplayExerciseBox set_group={set_group}/>
                          }
                />
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f3'
    },
    headerContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: 'white'
    },
    smallBold: {
        fontSize: getFontSize(16),
        fontFamily: 'Heebo-Bold',
        paddingLeft: 10,
        paddingBottom: 5
    },
    notBold: {
        color: 'grey',
        fontFamily: 'Heebo-Medium',
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

export default connect(stateToProps, dispatchToProps)(EditWorkoutDay);
