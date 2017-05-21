import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ListView,
    Platform
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import * as GlobalActions from '../../actions/globalActions';

import GlobalStyle from '../globalStyle';
import {getFontSize} from '../../actions/utils';

import AnswerQuestionBox from '../../components/AnswerQuestionBox';
import BackBar from '../../components/BackBar';
import SubmitButton from '../../components/SubmitButton';


const AnswerQuestionnaire = React.createClass({
    propTypes: {
        questionnaire: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            success: false
        }
    },

    rows: [],

    asyncActions(start) {
        if (start) {
            this.refs.post_button.setState({busy: true});
        } else {
            this.refs.post_button.setState({busy: false});
            this.setState({success: true});
            setTimeout(() => {
                this.setState({success: false});
                this._back();
            }, 2000);
        }
    },

    _back() {
        this.props.navigation.goBack()
    },

    onPress() {
        let completed = true;
        let answers = [];
        const rows = _.uniqBy(this.rows, function (e) {
            if (e && e.props.question) return e.props.question;
        });
        for (const row of rows) {
            if (row && row.refs.form) {
                const formValues = row.refs.form.getValue();
                if (formValues) {
                    answers.push({
                        question: row.props.question.id,
                        text: formValues.text
                    })
                } else {
                    completed = false;
                    // break;
                }
            }
        }
        if (completed) {
            this.props.actions.answerQuestionnaire(answers, this.asyncActions);
        }
    },


    render() {
        const questionnaire = this.props.questionnaire;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(this.props.questionnaire.questions);
        return (
            <View style={styles.container}>
                {this.state.success ?
                    <View style={{flex: .2, backgroundColor: 'green', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontSize: getFontSize(24)}}>
                            Success
                        </Text>
                    </View>
                    :
                    <BackBar back={this._back}/>
                }
                <View style={[{padding: 20}]}>
                    <Text style={[{fontSize: getFontSize(26), color: 'grey'}]}>
                        {questionnaire.name}
                    </Text>
                </View>
                <ListView ref='questionnaire_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                          keyboardShouldPersistTaps="handled"
                          style={[styles.container, {margin: 20}]} enableEmptySections={true}
                          dataSource={dataSource}
                          renderRow={(question, sectionID, rowID) =>
                              <AnswerQuestionBox ref={(row) => this.rows.push(row)}
                                                 question={question} number={parseInt(rowID) + 1}/>}
                />
                {!this.state.success ?
                    <View style={styles.content}>
                        <SubmitButton ref="post_button" onPress={this.onPress} buttonStyle={styles.buttonStyle}
                                      text="Continue"/>
                    </View>
                    : null
                }
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
    }
});

const stateToProps = (state) => {
    return {};
};

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch),
    }
};

export default connect(stateToProps, dispatchToProps)(AnswerQuestionnaire);


