import React, { Component } from 'react';
import {
  Container,
  Content,
  Item,
  Input,
  View,
  Label,
  Textarea,
  Button,
  Text,
  H1,
} from 'native-base';
import { Picker } from '@react-native-picker/picker';
import {
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { PRIMARY_COLOR, WHITE_COLOR, BUTTON_COLOR } from '../Colors';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Feather';
export default class Home extends Component {
  state = {
    sname: '',
    soname: '',
    mnumber: '',
    wnumber: '',
    email: '',
    gst: '',
    local: '',
    address: '',
    shopcategory: '',
    otherShopcategory: '',
    isSubmitted: false,
    user_id: '',
    remark: '',
    category: [],
    counter: '',
  };
  async componentDidMount() {
    this.setState({
      user_id: await AsyncStorage.getItem('user_id'),
      name: await AsyncStorage.getItem('name'),
      category: await this.props.route.params.catagory,
    });
    const counter = await fetch(
      `http://venus.joinvenus.in/api/venus/counter/${this.state.user_id}`,
      {
        method: 'POST',
      },
    );
    const responseJson = await counter.json();
    this.setState({
      counter: responseJson,
    });
  }
  clear = () => {
    this.setState({
      sname: '',
      soname: '',
      mnumber: '',
      wnumber: '',
      email: '',
      gst: '',
      local: '',
      address: '',
      shopcategory: '',
      otherShopcategory: '',
      isSubmitted: false,
      remark: '',
    });
  };
  render() {
    const { container, inputbox, labelStyle } = styles;
    const {
      sname,
      soname,
      mnumber,
      wnumber,
      email,
      gst,
      otherShopcategory,
      shopcategory,
      local,
      address,
      isSubmitted,
      user_id,
      category,
      remark,
      name,
      counter: { count, todaycount },
    } = this.state;
    const { navigation } = this.props;
    const ImagePath = require('../../assets/images/logo.png');

    const Validate = () => {
      if (
        sname.length &&
        soname.length &&
        mnumber.length &&
        (shopcategory == 'Other'
          ? otherShopcategory.length
          : shopcategory.length) &&
        local.length
      ) {
        return true;
      }
      return false;
    };
    const submit = () => {
      if (Validate()) {
        const data = {
          shopname: sname,
          name: soname,
          shopcategory:
            shopcategory == 'Other' ? otherShopcategory : shopcategory,
          number: {
            0: mnumber,
            1: wnumber,
          },
          email: email,
          gstno: gst,
          location: local,
          address: address,
          user_id: user_id,
          remark: remark,
        };
        fetch('http://venus.joinvenus.in/api/venus/otp', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then((e) => e.json())
          .then((eJson) => {
            if (eJson) {
              this.clear();
              console.log(data);
              navigation.navigate('OTP', { data });
            } else {
              Alert.alert('Error', 'Something went wrong contact admin.');
            }
          });
      } else {
        Alert.alert('Required', 'Please fill the required fields');
      }
    };

    return (
      <Container>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: '2%',
          }}>
          <Image source={ImagePath} style={{ width: 300, height: 150 }} />
        </View>
        <Content padder style={container}>
          <View>
            <H1 style={{ textAlign: 'center' }}>Hey,{`${name}`} </H1>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: '2%',
            }}>
            <Text>Total Reg : {count}</Text>
            <Text>Today Reg : {todaycount}</Text>
          </View>
          <View>
            <Label style={labelStyle}>Shop Name</Label>
            <Item style={inputbox} bordered>
              <Input
                placeholder="Please enter the shop Name"
                placeholderTextColor="#0003"
                onChangeText={(sname) => this.setState({ sname })}
                value={sname}
                editable={!isSubmitted}
              />
            </Item>
          </View>
          <View>
            <Label style={labelStyle}>Owner Name</Label>
            <Item style={inputbox} bordered>
              <Input
                placeholder="Please enter the name of owner."
                placeholderTextColor="#0003"
                onChangeText={(soname) => this.setState({ soname })}
                value={soname}
                editable={!isSubmitted}
              />
            </Item>
          </View>
          <View>
            <Label style={labelStyle}>Shop Category</Label>
            <Picker
              selectedValue={shopcategory}
              style={{ height: 50, width: 100 }}
              onValueChange={(shopcategory, itemIndex) =>
                this.setState({ shopcategory})
              }>
                <FlatList
                // data={category}
                renderItem={({y})=>(<Picker.Item label={y.category} value={y.category} />)}
                />  
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
          {shopcategory.length ? (
            shopcategory == 'Other' ? (
              <View>
                <Item style={inputbox} bordered>
                  <Input
                    placeholder="Please enter the category"
                    placeholderTextColor="#0003"
                    onChangeText={(otherShopcategory) =>
                      this.setState({ otherShopcategory })
                    }
                    value={otherShopcategory}
                    editable={!isSubmitted}
                  />
                </Item>
              </View>
            ) : null
          ) : null}
          <View>
            <Label style={labelStyle}>Mobile Number</Label>
            <Item style={inputbox} bordered>
              <Input
                placeholder="Please enter the primary mobile number"
                placeholderTextColor="#0003"
                keyboardType="number-pad"
                maxLength={10}
                onChangeText={(mnumber) => this.setState({ mnumber })}
                value={mnumber}
                editable={!isSubmitted}
              />
            </Item>
          </View>
          <View>
            <Label style={labelStyle}>Whatsapp number</Label>
            <Item style={inputbox} bordered>
              <Input
                placeholder="Please entter the whatsapp number (if available)"
                placeholderTextColor="#0003"
                keyboardType="number-pad"
                maxLength={10}
                onChangeText={(wnumber) => this.setState({ wnumber })}
                value={wnumber}
                editable={!isSubmitted}
              />
            </Item>
          </View>
          <View>
            <Label style={labelStyle}>Email</Label>
            <Item style={inputbox} bordered>
              <Input
                placeholder="Please enter the email address of owner"
                placeholderTextColor="#0003"
                keyboardType="email-address"
                onChangeText={(email) => this.setState({ email })}
                value={email}
                editable={!isSubmitted}
              />
            </Item>
          </View>
          <View>
            <Label style={labelStyle}>GST Number</Label>
            <Item style={inputbox} bordered>
              <Input
                placeholder="GST Number"
                placeholderTextColor="#0003"
                onChangeText={(gst) => this.setState({ gst })}
                value={gst}
                editable={!isSubmitted}
              />
            </Item>
          </View>
          <View>
            <Label style={labelStyle}>Locality</Label>
            <Item style={inputbox} bordered>
              <Input
                placeholder="The are you are in"
                placeholderTextColor="#0003"
                onChangeText={(local) => this.setState({ local })}
                value={local}
                editable={!isSubmitted}
              />
            </Item>
          </View>
          <View>
            <Label style={labelStyle}>Address</Label>
            <Item style={inputbox} bordered>
              <Textarea
                rowSpan={5}
                placeholder="Address"
                placeholderTextColor="#0003"
                multiline={true}
                onChangeText={(address) => this.setState({ address })}
                value={address}
                editable={!isSubmitted}
              />
            </Item>
          </View>
          <View>
            <Label style={labelStyle}>Remark</Label>
            <Item style={inputbox} bordered>
              <Textarea
                rowSpan={5}
                placeholder="Remark"
                placeholderTextColor="#0003"
                multiline={true}
                onChangeText={(remark) => this.setState({ remark })}
                value={remark}
                editable={!isSubmitted}
              />
            </Item>
          </View>
          <Button
            disabled={isSubmitted}
            style={{
              backgroundColor: BUTTON_COLOR,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => submit()}>
            <Text style={{ textAlign: 'center', alignSelf: 'center' }}>SUBMIT</Text>
          </Button>
        </Content>
        <ActivityIndicator
          style={
            isSubmitted
              ? {
                display: 'flex',
                position: 'absolute',
                top: '50%',
                left: '50%',
                right: '50%',
                bottom: '50%',
              }
              : { display: 'none' }
          }
          size="large"
          color="#000"
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PRIMARY_COLOR,
    marginVertical: '2%',
  },
  inputbox: {
    backgroundColor: WHITE_COLOR,
    marginVertical: '2%',
  },
  labelStyle: {
    textTransform: 'uppercase',
    fontSize: 14,
    letterSpacing: 2,
  },
});
