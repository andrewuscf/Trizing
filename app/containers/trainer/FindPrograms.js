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
} from 'react-native';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from 'react-native-action-button';
import RNFetchBlob from 'react-native-fetch-blob';

import GlobalStyle from '../globalStyle';
import {API_ENDPOINT, getFontSize, setHeaders, isATrainer} from '../../actions/utils';

import CustomIcon from '../../components/CustomIcon';
import Loading from '../../components/Loading';

const FindPrograms = CreateClass({
    propTypes: {},

    getInitialState() {
        return {
            isActionButtonVisible: true,
            forSale: [],
            forSaleNext: null,
            loading: false,
            refresh: false,
            isTrainer: isATrainer(this.props.RequestUser.type)
        }
    },

    componentDidMount() {
        this.getForSale();
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


    getForSale(refresh = false) {
        this.setState({loading: true});
        if (refresh) {
            this.setState({refresh: true});
        }

        const url = `${API_ENDPOINT}training/program/sale/`;
        RNFetchBlob.fetch('GET', url, setHeaders(this.props.UserToken))
            .then((res) => {
                let json = res.json();
                this.setState({
                    forSale: json.results,
                    forSaleNext: json.next,
                    loading: false,
                    refresh: false
                });

            }).catch((errorMessage, statusCode) => {
            this.setState({loading: false});
            console.log(errorMessage)
        });
    },

    _refresh() {
        this.getForSale(true);
    },

    onEndReached() {
    },


    goToProgram(program) {
        if (isATrainer(this.props.RequestUser.type) || program.trainer.id === this.props.RequestUser.id) {
            this.props.navigation.navigate('EditSchedule', {scheduleId: program.id});
        } else {
            this.props.navigation.navigate('ScheduleDetail', {schedule: program});
        }
    },

    renderRow(program) {
        let duration = 0;
        program.workouts.forEach((workout) => duration += workout.duration);
        return (
            <TouchableOpacity style={styles.link} onPress={this.goToProgram.bind(null, program)}>
                <View style={styles.leftSection}>
                    <Text style={[styles.simpleTitle, {padding: '2%'}]}>{program.name}</Text>
                    <View style={[styles.row, {borderColor: '#e1e3df', borderTopWidth: 1, padding: '2%'}]}>
                        <MaterialIcon name="timer" size={getFontSize(18)} style={styles.timerIcon}/>
                        <Text style={styles.smallText}>
                            {duration} {duration === 1 ? 'week' : 'weeks'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    },

    renderHeader() {
        return null;
    },

    renderFooter() {
        const length = this.state.forSale.length;
        if (length > 0 || this.state.loading) return null;
        return (
            <View style={styles.empty}>
                <CustomIcon name="weight" size={getFontSize(60)} color="#b1aea5"/>
                <Text style={styles.emptyText}>
                        There are currently no workout programs for sale
                </Text>
            </View>
        )
    },


    render() {
        if (this.state.loading) {
            return (
                <View style={GlobalStyle.container}>
                    {this.renderHeader()}
                    <Loading/>
                </View>
            )
        }
        const {navigate} = this.props.navigation;
        const ProgramsDs = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        }).cloneWithRows(this.state.forSale);
        return (
            <View style={GlobalStyle.container}>
                <ListView ref='for_sale_list' removeClippedSubviews={(Platform.OS !== 'ios')}
                          refreshControl={<RefreshControl refreshing={this.state.refresh}
                                                          onRefresh={this._refresh}/>}
                          enableEmptySections={true} dataSource={ProgramsDs} showsVerticalScrollIndicator={false}
                          renderRow={this.renderRow}
                          renderHeader={this.renderHeader}
                          onScroll={this._onScroll}
                          renderFooter={this.renderFooter}
                          contentContainerStyle={{paddingBottom: 100}}
                />
                {this.state.isTrainer && this.state.isActionButtonVisible ?
                    <ActionButton buttonColor="rgba(0, 175, 163, 1)" position="right"
                                  offsetX={10} offsetY={20}
                                  onPress={() => navigate('CreateSchedule', {allow_sale: true})}/>
                    : null
                }
            </View>
        )
    }
});

FindPrograms.navigationOptions = {
    title: 'Find Programs',
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
        UserToken: state.Global.UserToken,
    };
};

export default connect(stateToProps, null)(FindPrograms);
