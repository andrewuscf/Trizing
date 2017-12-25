import React from 'react';

const CreateClass = require('create-react-class');
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    TouchableOpacity,
    Platform,
    LayoutAnimation,
    Alert,
    Switch
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';
import RNFetchBlob from 'react-native-fetch-blob';
import _ from 'lodash';

import * as GlobalActions from '../../actions/globalActions';
import GlobalStyle from '../globalStyle';
import {API_ENDPOINT, getFontSize, setHeaders, isATrainer, convertSkill, trunc} from '../../actions/utils';

import CustomIcon from '../../components/CustomIcon';
import EditButton from '../../components/EditButton';
import Loading from '../../components/Loading';

const MacroPlanList = CreateClass({
    getInitialState() {
        return {
            isActionButtonVisible: true,
            nutrition_plans: [],
            next: null,
            loading: false,
            refresh: false,
            isTrainer: isATrainer(this.props.RequestUser.type)
        }
    },

    componentDidMount() {
        this.getNeeded(true);
    },

    _listViewOffset: 0,

    _onScroll(event) {
        const CustomLayoutLinear = {
            duration: 100,
            create: {type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity},
            update: {type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity},
            delete: {type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity}
        };
        const currentOffset = event.nativeEvent.contentOffset.y;
        const direction = (currentOffset > 0 && currentOffset > this._listViewOffset) ? 'down' : 'up';
        const isActionButtonVisible = direction === 'up';
        if (isActionButtonVisible !== this.state.isActionButtonVisible) {
            LayoutAnimation.configureNext(CustomLayoutLinear);
            this.setState({isActionButtonVisible})
        }
        this._listViewOffset = currentOffset;
    },

    getNeeded(refresh = false, url = `${API_ENDPOINT}training/macros/?all_plans=true`) {
        this.setState({loading: true});
        if (refresh) {
            this.setState({refresh: true});
        }
        RNFetchBlob.fetch('GET', url, setHeaders(this.props.UserToken))
            .then((res) => {
                let json = res.json();
                this.setState({
                    nutrition_plans: json.results,
                    next: json.next,
                    loading: false,
                    refresh: false
                });

            }).catch((errorMessage, statusCode) => {
            this.setState({loading: false});
            console.log(errorMessage)
        });
    },

    _refresh() {
        this.getNeeded(true);
    },

    onEndReached() {
        if (this.state.next && !this.state.loading) {
            this.getNeeded(false, this.state.next);
        }
    },

    _redirect(routeName, props = null) {
        this.props.navigation.navigate(routeName, props);
    },

    convertToMap() {
        const nutritionMap = {'My Plans': [], 'Trainer Plans': []};
        this.state.nutrition_plans.forEach((plan) => {
            if (plan.trainer && plan.trainer.id === this.props.RequestUser.id) {
                nutritionMap['My Plans'].push(plan);
            } else {
                nutritionMap['Trainer Plans'].push(plan);
            }
        });
        return nutritionMap;

    },

    renderSectionHeader(sectionData, category) {
        if (!sectionData.length) return null;
        return (
            <View style={[{backgroundColor: 'white', marginLeft: 10}]}>
                <Text style={styles.sectionTitle}>{category}</Text>
            </View>
        );
    },


    _activate(plan) {
        Alert.alert(
            'Activate Nutrition Plan?',
            `This will override your current nutrition plan. Nutrition plans can be overwritten by trainers.`,
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Yes', onPress: () => this.props.activateMacroPlan(plan.id)},
            ]
        );
    },

    onSwitchChange(value, program) {
        if (value) {
            this._activate(program)
        }
    },


    renderRow(plan) {
        console.log(plan)
        let averageCarbs = _.meanBy(plan.macro_plan_days, 'carbs');
        let averageFat = _.meanBy(plan.macro_plan_days, 'fats');
        let averageProtein = _.meanBy(plan.macro_plan_days, 'protein');
        return (
            <TouchableOpacity style={styles.link}>

                <View style={styles.leftSection}>
                    <Text style={[styles.simpleTitle, {padding: '2%'}]}>{plan.name}</Text>
                    <View style={[styles.row, {borderColor: '#e1e3df', borderTopWidth: 1, padding: '2%'}]}>
                        <Text style={styles.smallText}>Fats: </Text>
                        <Text style={{textAlign: 'center', paddingRight: '2%'}}>
                            {averageFat}
                        </Text>
                        <Text style={styles.smallText}>Carbs: </Text>
                        <Text style={{textAlign: 'center', paddingRight: '2%'}}>
                            {averageCarbs}
                        </Text>
                        <Text style={styles.smallText}>Protein: </Text>
                        <Text style={{textAlign: 'center', paddingRight: '2%'}}>
                            {averageProtein}
                        </Text>
                    </View>
                </View>
                <Switch value={this.props.RequestUser.profile.active_macro_plan === plan.id}
                        style={{alignSelf: 'center'}}
                        onValueChange={(value) => this.onSwitchChange(value, plan)} onTintColor='#00AFA3'/>
            </TouchableOpacity>
        )
    },

    addPlan(data) {
        this.setState({
            nutrition_plans: [
                data,
                ...this.state.nutrition_plans
            ]
        });
    },

    renderHeader() {
        return null;
    },

    renderFooter() {
        return null;
    },


    render() {
        if (this.state.loading) {
            return <Loading/>;
        }
        const {navigate} = this.props.navigation;
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });
        const planDs = ds.cloneWithRowsAndSections(this.convertToMap());
        return (
            <View style={GlobalStyle.container}>
                <ListView ref='nutrition_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                          refreshControl={<RefreshControl refreshing={this.state.refresh}
                                                          onRefresh={this._refresh}/>}
                          enableEmptySections={true} dataSource={planDs} showsVerticalScrollIndicator={false}
                          renderRow={this.renderRow}
                          renderHeader={this.renderHeader}
                          onScroll={this._onScroll}
                          renderFooter={this.renderFooter}
                          onEndReached={this.onEndReached}
                          onEndReachedThreshold={400}
                          renderSectionHeader={this.renderSectionHeader}
                          contentContainerStyle={{paddingBottom: 100}}
                />
                {this.state.isActionButtonVisible ?
                    <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right"
                                  onPress={() => navigate('CreateMacroPlan', {addMacroPlan: this.addPlan})}/>
                    : null
                }
            </View>
        )
    }
});

MacroPlanList.navigationOptions = {
    title: 'Workout Programs',
};


const styles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    timerIcon: {
        color: '#b1aea5',
        alignSelf: 'center',
        paddingRight: 5
    },
    simpleTitle: {
        fontSize: getFontSize(18),
        fontFamily: 'Heebo-Medium',
    },
    smallText: {
        fontSize: getFontSize(12),
        color: '#b1aea5',
        fontFamily: 'Heebo-Medium',
        textAlign: 'center'
    },
    leftSection: {
        flex: 1,
    },
    link: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#e1e3df',

        padding: 10,
        backgroundColor: 'white',
        margin: 10,
        marginBottom: 0,
        borderRadius: 7,
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
    selectedTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#00AFA3',
    },
    selectedText: {
        color: '#00AFA3',
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20
    },
    emptyText: {
        fontSize: getFontSize(22),
        color: '#b1aeb9',
        textAlign: 'center',
        paddingTop: 20,
        fontFamily: 'Heebo-Medium'
    },
    sectionTitle: {
        paddingTop: 5,
        paddingLeft: 10,
        fontSize: getFontSize(22),
        fontFamily: 'Heebo-Bold',
    }
});

const stateToProps = (state) => {
    return {
        RequestUser: state.Global.RequestUser,
        Schedules: state.Global.Schedules,
        UserToken: state.Global.UserToken,
        SchedulesLoading: state.Global.SchedulesLoading
    };
};

const dispatchToProps = (dispatch) => {
    return {
        activateMacroPlan: bindActionCreators(GlobalActions.activateMacroPlan, dispatch),
    }
};

export default connect(stateToProps, dispatchToProps)(MacroPlanList);
