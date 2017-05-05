import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ListView,
    Platform
} from 'react-native';
import {connect} from 'react-redux';

import GlobalStyle from '../globalStyle';
import {getFontSize, API_ENDPOINT, checkStatus, fetchData} from '../../actions/utils';
import {getRoute} from '../../routes';

import BackBar from '../../components/BackBar';


const AnswersDisplay = React.createClass({
    propTypes: {
        questionnaire: React.PropTypes.object.isRequired,
        client: React.PropTypes.number.isRequired,
        UserToken: React.PropTypes.string.isRequired
    },

    getInitialState() {
        return {
            answers: []
        }
    },

    componentDidMount() {
        fetch(`${API_ENDPOINT}training/questionnaires/responses/?client=${this.props.client}&questionnaire=${this.props.questionnaire.id}`,
            fetchData('GET', null, this.props.UserToken)).then(checkStatus)
            .then((responseJson) => {this.setState({answers: responseJson.results})});
    },


    back() {
        this.props.navigator.pop();
    },


    render() {
        console.log(this.props.questionnaire)
        const questionnaire = this.props.questionnaire;

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(this.state.answers);
        return (
            <View style={styles.container}>
                <BackBar back={this.back}/>
                <View style={[{padding: 20}]}>
                    <Text style={[{fontSize: getFontSize(26), color: 'grey'}]}>
                        {questionnaire.name}
                    </Text>
                </View>
                <ListView ref='answer_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                          keyboardShouldPersistTaps="handled"
                          style={[styles.container, {margin: 20}]} enableEmptySections={true}
                          dataSource={dataSource}
                          renderRow={(question, sectionID, rowID) => <Text>test</Text>}
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
    }
});

const stateToProps = (state) => {
    return {
        UserToken: state.Global.UserToken
    };
};

export default connect(stateToProps, null)(AnswersDisplay);



