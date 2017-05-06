import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ListView,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import _ from 'lodash';

import GlobalStyle from '../globalStyle';
import {getFontSize, API_ENDPOINT, checkStatus, fetchData} from '../../actions/utils';
import {getRoute} from '../../routes';

import BackBar from '../../components/BackBar';


const AnswersDisplay = React.createClass({
    propTypes: {
        questionnaire: React.PropTypes.object.isRequired,
        UserToken: React.PropTypes.string.isRequired,
        client: React.PropTypes.object,
    },

    getInitialState() {
        return {
            answers: []
        }
    },

    componentDidMount() {
        if (this.props.client) {
            fetch(`${API_ENDPOINT}training/questionnaires/responses/?client=${this.props.client.id}&questionnaire=${this.props.questionnaire.id}`,
                fetchData('GET', null, this.props.UserToken)).then(checkStatus)
                .then((responseJson) => {
                    if (responseJson.results) this.setState({answers: responseJson.results})
                });
        }
    },


    back() {
        this.props.navigator.pop();
    },

    renderRow(question, sectionID, rowID) {
        const answer = _.find(this.state.answers, {question: question.id});
        return (
            <View style={styles.box}>
                <Text style={styles.questionText}>
                    {`${parseInt(rowID) + 1}. ${question.text}`}
                </Text>
                {answer ?
                    <View style={styles.answerBox}>
                        <Text style={styles.answerText}>{answer.text}</Text>
                    </View>
                    : null
                }
            </View>
        )
    },


    render() {
        const questionnaire = this.props.questionnaire;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(this.props.questionnaire.questions);
        return (
            <View style={styles.container}>
                <BackBar back={this.back}/>
                <View style={[{padding: 20}]}>
                    <Text style={[{fontSize: getFontSize(26)}]}>
                        {questionnaire.name}
                    </Text>
                    {this.props.client ?
                        <Text style={[{fontSize: getFontSize(14), paddingTop: 5, color: 'grey'}]}>
                            Answered by: {this.props.client.profile.first_name} {this.props.client.profile.last_name}
                        </Text>
                        : null
                    }
                </View>
                <ListView ref='answer_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                          keyboardShouldPersistTaps="handled"
                          style={[styles.container, {margin: 20}]} enableEmptySections={true}
                          dataSource={dataSource}
                          renderRow={this.renderRow}
                />
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: .2,
        margin: 20,
    },
    buttonStyle: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
    },
    questionText: {
        fontSize: getFontSize(22),
        paddingBottom: 5
        // color: 'grey'
    },
    box: {
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        marginBottom: 10
    },
    answerBox: {
        borderTopWidth: 1,
        borderColor: 'grey',
    },
    answerText: {
        fontSize: getFontSize(20),
        color: 'grey',
        paddingTop: 10
    }
});

const stateToProps = (state) => {
    return {
        UserToken: state.Global.UserToken
    };
};

export default connect(stateToProps, null)(AnswersDisplay);



