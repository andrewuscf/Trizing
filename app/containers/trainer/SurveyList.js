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
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';

import * as GlobalActions from '../../actions/globalActions';


import GlobalStyle from '../globalStyle';
import {getFontSize} from '../../actions/utils';

import CustomIcon from '../../components/CustomIcon';

const SurveyList = React.createClass({
    propTypes: {
        // Refreshing: React.PropTypes.bool.isRequired,
    },


    componentDidMount() {
        this.getNeeded(true);
    },

    getNeeded(refresh = false) {
        if (this.props.RequestUser.type == 1) {
            this.props.getQuestionnaires(refresh);
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
        const QuestionnaireDS = ds.cloneWithRows(this.props.Questionnaires);
        return (
            <View style={{flex: 1}}>
                <ListView ref='survey_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                          style={styles.container} enableEmptySections={true} dataSource={QuestionnaireDS}
                          renderRow={(questionnaire) =>
                              <TouchableOpacity style={styles.link}
                                                onPress={this._redirect.bind(null, 'AnswersDisplay', {questionnaire: questionnaire})}>
                                  <Text style={styles.simpleTitle}>{questionnaire.name}</Text>
                                  <MaterialIcon name="keyboard-arrow-right" size={getFontSize(18)}
                                                style={styles.linkArrow}/>
                              </TouchableOpacity>
                          }
                />
                {isTrainer ?
                    <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right">
                        <ActionButton.Item buttonColor='#3498db' title="New Survey"
                                           onPress={() => navigate('CreateQuestionnaire')}>
                            <CustomIcon name="new-note" color="white" size={getFontSize(30)}/>
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
        Questionnaires: state.Global.Questionnaires,
    };
};

const dispatchToProps = (dispatch) => {
    return {
        getQuestionnaires: bindActionCreators(GlobalActions.getQuestionnaires, dispatch),
    }
};

export default connect(stateToProps, dispatchToProps)(SurveyList);
