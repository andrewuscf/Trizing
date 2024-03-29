import React from 'react';

const CreateClass = require('create-react-class');
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    ListView,
    Platform
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';

import * as GlobalActions from '../../actions/globalActions';

import {getFontSize} from '../../actions/utils';

import AnswerQuestionBox from '../../components/AnswerQuestionBox';

const AnswerQuestionnaire = CreateClass({
    propTypes: {
        questionnaire: PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            disabled: false
        }
    },

    componentDidMount() {
        this.props.navigation.setParams({handleSave: this.onPress});
    },

    rows: [],

    asyncActions(success) {
        if (success) {
            this.props.actions.appMessage("Survey submitted", null, "green");
            setTimeout(() => {
                this.props.navigation.goBack();
            }, 2000);
        } else {
            this.props.actions.appMessage("Couldn't submit log .", null, "red");
        }
        this.setState({disabled: false});
    },

    onPress() {
        if (this.state.disabled) return;

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
            this.setState({disabled: true});
            this.props.actions.answerQuestionnaire(answers, this.asyncActions);
        }
    },


    render() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(this.props.questionnaire.questions);
        return (
            <ListView ref='questionnaire_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                      style={[styles.container, {margin: 20}]} enableEmptySections={true}
                      dataSource={dataSource}
                      renderRow={(question, sectionID, rowID) =>
                          <AnswerQuestionBox ref={(row) => this.rows.push(row)}
                                             question={question} number={parseInt(rowID) + 1}/>}
            />
        );
    }
});

AnswerQuestionnaire.navigationOptions = ({navigation}) => {
    const {state, setParams} = navigation;
    return {
        headerTitle: state.params && state.params.questionnaire ?
            state.params.questionnaire.name
            : null,
    };
};

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

const dispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GlobalActions, dispatch),
    }
};

export default connect(null, dispatchToProps)(AnswerQuestionnaire);


