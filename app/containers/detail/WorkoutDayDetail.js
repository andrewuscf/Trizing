import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    RefreshControl,
    FlatList,
    TouchableOpacity
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';

import * as GlobalActions from '../../actions/globalActions';
import {trunc, fetchData, API_ENDPOINT, checkStatus, getFontSize} from '../../actions/utils';
import {DAYS_OF_WEEK} from '../../assets/constants';
import GlobalStyle from '../../containers/globalStyle';

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

    _toDetail(props) {
        this.props.navigation.navigate('SetGroupDetail', {
            ...props,
            date: this.props.date,
            workout: this.state.workout_day.workout
        });
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

    _renderItem(object){
        const set_group = object.item;
        return (
            <TouchableOpacity style={[styles.displayWorkoutBox, {flexDirection: 'row', alignItems: 'center'}]}
                              onPress={this._toDetail.bind(null, {set_group: set_group})}>
                <View style={{flexDirection: 'column', flex: 1}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={styles.simpleTitle}>{set_group.exercise.name}</Text>
                    </View>
                </View>
                <View style={[styles.setCircle, {borderColor: '#ff473d'}]}>
                    <Text style={[{fontSize: getFontSize(12)}, {color: '#ff473d'}]}>
                        {set_group.sets.length}
                    </Text>
                    <Text style={[{fontSize: getFontSize(10)}, {color: '#ff473d'}]}>
                        {set_group.sets.length === 1 ? 'SET' : 'SETS'}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    },

    _renderHeader() {
        if (!this.state.workout_day.notes || !this.state.workout_day.notes.length) return null;
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

    render() {
        if (!this.state.workout_day) return <Loading/>;

        return <FlatList removeClippedSubviews={false} ListHeaderComponent={this._renderHeader}
                         showsVerticalScrollIndicator={false} data={this.state.workout_day.exercises}
                         refreshControl={<RefreshControl refreshing={this.state.refreshing}
                                                         onRefresh={() => this.getWorkoutDay(true)}/>}
                         renderItem={this._renderItem} extraData={this.state} keyExtractor={(item, index) => index}/>;

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
    },
    displayWorkoutBox: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
        borderColor: '#e1e3df',
        borderBottomWidth: .5,
    },
    setCircle: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 25,
        width: 50,
        height: 50,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    simpleTitle: {
        fontSize: getFontSize(18),
        fontFamily: 'Heebo-Bold',
        marginBottom: 5,
    },
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
