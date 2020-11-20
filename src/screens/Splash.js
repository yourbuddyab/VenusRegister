import React, { Component } from 'react'
import { Image, StyleSheet, ActivityIndicator } from 'react-native'
import { Container, Content } from 'native-base'
import { PRIMARY_COLOR } from '../Colors'
import AsyncStorage from '@react-native-community/async-storage'
import { StackActions } from '@react-navigation/native'
export default class Splash extends Component {
    async componentDidMount() {
        try {
            const response = await fetch('http://venus.joinvenus.in/api/venus/category')
            const responseJson = await response.json();
            try {
                const isLoggedIn = await AsyncStorage.getItem('isLoggedIn')
                this.props.navigation.dispatch(
                    StackActions.replace(isLoggedIn != '1' ? 'Login' : 'Home', { catagory: responseJson })
                )
            } catch (e) {
                console.error(e);
            }

        } catch (error) {
            console.log(error)
        }
    }
    render() {
        return (
            <Container style={styles.container}>
                <Content padder contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../assets/images/logo.png')} style={{ width: 300, height: 150 }} />
                </Content>
                <ActivityIndicator size="large" color="#000" style={{ marginBottom: '25%' }} />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: PRIMARY_COLOR,
        marginVertical: '2%',
        marginTop: '15%',
    },
})  