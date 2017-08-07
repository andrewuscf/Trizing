import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ListView,
    Platform,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import {connect} from 'react-redux';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import {Bar} from 'react-native-pathjs-charts';
import FontIcon from 'react-native-vector-icons/FontAwesome';


import {fetchData, API_ENDPOINT, trunc, checkStatus, getFontSize} from '../../actions/utils';
import GlobalStyle from '../globalStyle';

import MacroLogBox from '../../components/MacroLogBox';

const {width: deviceWidth} = Dimensions.get('window');

let MacroLogList = React.createClass({
    propTypes: {
        logs: React.PropTypes.array.isRequired,
        macro_plan_day: React.PropTypes.object.isRequired,
        logged_data: React.PropTypes.object.isRequired,
    },

    renderHeader() {
        // let calories = 0;
        const fats = (this.props.macro_plan_day.fats) ? this.props.macro_plan_day.fats : 0;
        const protein = (this.props.macro_plan_day.protein) ? this.props.macro_plan_day.protein : 0;
        const carbs = (this.props.macro_plan_day.carbs) ? this.props.macro_plan_day.carbs : 0;
        // calories = (9 * fats) + (4 * protein) + (4 * carbs);


        const {currentFats, currentcarbs, currentprotein} = this.props.logged_data;
        // let calories = (9 * currentFats) + (4 * currentcarbs) + (4 * currentprotein);
        return (
            <View>
                <View style={[styles.row, {justifyContent: 'space-between', alignItems: 'center', paddingTop: 10}]}>
                    <View style={styles.details}>
                        <Text style={styles.sectionTitle}>Fats</Text>
                        <Text style={styles.smallText}>{`${fats}g`}</Text>
                        <Progress.Bar progress={currentFats / fats} width={80}
                                      borderWidth={0} height={5} borderRadius={20} unfilledColor="grey"/>
                        <Text style={styles.smallText}>{`${fats - currentFats}g left`}</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.sectionTitle}>Carbs</Text>
                        <Text style={styles.smallText}>{`${carbs}g`}</Text>
                        <Progress.Bar progress={currentcarbs / carbs} width={80}
                                      borderWidth={0} height={5} borderRadius={20} unfilledColor="grey"/>
                        <Text style={styles.smallText}>{`${carbs - currentcarbs}g left`}</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.sectionTitle}>Protein</Text>
                        <Text style={styles.smallText}>{`${protein}g`}</Text>
                        <Progress.Bar progress={currentprotein / protein} width={80}
                                      borderWidth={0} height={5} borderRadius={20} unfilledColor="grey"/>
                        <Text style={styles.smallText}>{`${protein - currentprotein}g left`}</Text>
                    </View>
                </View>
                <Text style={[styles.sectionTitle, {paddingLeft: 10}]}>Nutrition Logs</Text>
            </View>
        )
    },

    renderRow(log, set, key) {
        return <MacroLogBox log={log}/>
    },

    render() {
        const ListData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.props.logs);
        return (
            <ListView ref='schedules_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                      enableEmptySections={true} dataSource={ListData} showsVerticalScrollIndicator={false}
                      styles={{flex: 1}}
                      contentContainerStyle={{paddingBottom: 20}}
                      renderHeader={this.renderHeader}
                      renderRow={this.renderRow}
            />
        )
    }
});


const MacroLogDetail = React.createClass({
    propTypes: {
        macro_log: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            macro_response: {
                results: [],
                next: null
            },
            refreshing: false,
            disabled: false,
            tab: 1
        }
    },

    componentDidMount() {
        this.getMacroLogs()
    },

    // getMacroLogs(start_date, end_date) {
    //     let url = `${API_ENDPOINT}training/macros/logs/?date=${this.props.macro_log.date.format("YYYY-MM-DD")}&user=${this.props.macro_log.user.id}`;
    //
    //     fetch(url,
    //         fetchData('GET', null, this.props.UserToken))
    //         .then(checkStatus)
    //         .then((responseJson) => {
    //             this.setState({
    //                 macro_response: responseJson,
    //                 refreshing: false
    //             })
    //         });
    // },

    getMacroLogs(start_date, end_date) {
        const initDate = moment(this.props.macro_log.date);
        let url = `${API_ENDPOINT}training/macros/logs/?date=${initDate.format("YYYY-MM-DD")}&client=${this.props.macro_log.user.id}`;

        fetch(url,
            fetchData('GET', null, this.props.UserToken))
            .then(checkStatus)
            .then((responseJson) => {
                this.setState({
                    macro_response: responseJson,
                    refreshing: false
                })
            }).catch((error) => {
            console.log(error)
        })
    },

    _onTabPress(tab) {
        if (tab !== this.state.tab) this.setState({tab: tab});
    },

    render() {
        console.log(this.state.macro_response);

        let currentFats = 0;
        let currentcarbs = 0;
        let currentprotein = 0;
        this.state.macro_response.results.forEach((log) => {
            currentFats += log.fats;
            currentcarbs += log.carbs;
            currentprotein += log.protein;
        });

        const data = [
            [
                {
                    "v": this.props.macro_log.macro_plan_day.carbs,
                    "name": "carbs"
                },
                {
                    "v": currentcarbs,
                    "name": "Logged carbs"
                }
            ],
            [
                {
                    "v": this.props.macro_log.macro_plan_day.protein,
                    "name": "protein"
                },
                {
                    "v": currentprotein,
                    "name": "Logged protein"
                }
            ],
            [
                {
                    "v": this.props.macro_log.macro_plan_day.fats,
                    "name": "fats"
                },
                {
                    "v": currentFats,
                    "name": "Logged fats"
                }
            ]
        ];
        return (
            <View style={styles.container}>
                <View style={[styles.tabbarView, GlobalStyle.simpleBottomBorder]}>
                    <TouchableOpacity style={[styles.tabView, (this.state.tab === 1) ? styles.selectedTab : null]}
                                      onPress={this._onTabPress.bind(null, 1)}>
                        <FontIcon name="list" style={(this.state.tab === 1) ? styles.selectedText : null} size={getFontSize(14)}/>
                        <Text style={(this.state.tab === 1) ? styles.selectedText : null}>Logs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabView, (this.state.tab === 2) ? styles.selectedTab : null]}
                                      onPress={this._onTabPress.bind(null, 2)}>
                        <FontIcon name="bar-chart" style={(this.state.tab === 2) ? styles.selectedText : null} size={getFontSize(14)}/>
                        <Text style={(this.state.tab === 2) ? styles.selectedText : null}>Graph</Text>
                    </TouchableOpacity>
                </View>
                {this.state.tab === 1
                    ? <MacroLogList logs={this.state.macro_response.results}
                                    macro_plan_day={this.props.macro_log.macro_plan_day}
                                    logged_data={{currentFats, currentcarbs, currentprotein}}/>
                    : <View style={{paddingTop: 20}}><Bar data={data} options={options} accessorKey='v'/></View>
                }
            </View>
        )
    }
});

let options = {
    width: deviceWidth - 50,
    flex: 1,
    height: 300,
    margin: {
        top: 20,
        left: 25,
        bottom: 50,
        right: 20
    },
    color: '#2980B9',
    gutter: 20,
    animate: {
        type: 'oneByOne',
        duration: 200,
        fillTransition: 3
    },
    axisX: {
        showAxis: true,
        showLines: true,
        showLabels: true,
        showTicks: true,
        zeroAxis: false,
        orient: 'bottom',
        label: {
            fontFamily: 'Arial',
            fontSize: 8,
            fontWeight: true,
            fill: '#34495E'
        }
    },
    axisY: {
        showAxis: true,
        showLines: true,
        showLabels: true,
        showTicks: true,
        zeroAxis: false,
        orient: 'left',
        label: {
            fontFamily: 'Arial',
            fontSize: 8,
            fontWeight: true,
            fill: '#34495E'
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabbarView: {
        height: 50,
        opacity: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    tabView: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: getFontSize(20),
        fontFamily: 'Heebo-Bold',
        color: '#00AFA3'
    },
    selectedTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#00AFA3',
        marginLeft: 5,
        marginRight: 5,
    },
    selectedText: {
        color: '#00AFA3',
        fontFamily: 'Heebo-Medium',
    },
    row: {
        flexDirection: 'row'
    },
    details: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: 3,
        paddingBottom: 3,
        alignItems: 'center'
    },
    totalBox: {
        paddingTop: 10,
        paddingBottom: 10,
        marginRight: 10,
        marginLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

const stateToProps = (state) => {
    return {
        UserToken: state.Global.UserToken
    };
};

export default connect(stateToProps, null)(MacroLogDetail);
