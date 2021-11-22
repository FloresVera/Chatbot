import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow';

import { dialogflowConfig } from './env';

const botAvatar = require('./assets/t_a16e6647052e49739c12419019c64d13_name_asfsa.jpg')

const BOT = {
  _id: 2,
  name: 'Sr. Bot',
  avatar: botAvatar
}
class App extends Component {

  state = {
    messages: [{ _id: 2, text: 'Soy el Sr. Bot', createdAt: new Date(), user: BOT }, { _id: 1, text: 'Hola', createdAt: new Date(), user: BOT }],
    id: 1,
    name: ''
  }

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_SPANISH,
      dialogflowConfig.project_id,
    );
  }

  handleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];

    this.sendBotResponse(text);
  }

  sendBotResponse(text) {
    let msg;

    if (text == 'viajar') {
      msg = {
        _id: this.state.messages.length + 1,
        text: 'Te gustaría conocer la perla del sur?',
        image: 'https://infonegocios.com.py/uploads/encartacion-404anios-plus-marzo3.jpg',
        createdAt: new Date(),
        user: BOT,
      };
    } else if (text == 'mostrar opciones') {
      msg = {
        _id: this.state.messages.length + 1,
        text: 'Eliga su bus',
        createdAt: new Date(),
        user: BOT,
        isOptions: true,
        data: [
          {
            title: 'El Tigre',
            image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQcbtVRAeDYiTytsgTsbBRMlOgW1geB5p6fbD8TYhBp_Sk-aor2',
          },
          {
            title: 'Beato',
            image: 'https://www.disfrutandoparaguay.com/data/article/images/95/beato.jpg',
          },
          {
            title: 'NSA',
            image: 'https://www.ticketonline.com.ar/assets/img/empresas-pages/nuestra-senora-de-la-asuncion/nuestra-senora-de-la-asuncion-1.jpg',
          },
        ],
      };
      /*msg = {
        _id: this.state.messages.length + 1,
        text: 'Aquí puedes seleccionar con que colectivo viajar!',
        createdAt: new Date(),
        user: BOT,
        quickReplies: {
          type: 'radio',
          keepIt: true,
          values: [
            {title: 'El Tigre', value: 'El tigre', bColor: '#A0522D', bgColor: '#A0522D'},
            {title: 'Beato', value: 'Beato', bColor: '#A0522D', bgColor: '#A0522D'},
            {title: 'NSA', value: 'NSA', bColor: '#A0522D', bgColor: '#A0522D'},
          ],
        },
      };*/
    } else {
      msg = {
        _id: this.state.messages.length + 1,
        text,
        createdAt: new Date(),
        user: BOT,
      };
    }

    this.setState((previouseState) => ({
      messages: GiftedChat.append(previouseState.messages, [msg]),
    }));

  }

  onSend(messages = []) {
    this.setState((previouseState) => ({
      messages: GiftedChat.append(previouseState.messages, messages)
    }))

    let message = messages[0].text;

    Dialogflow_V2.requestQuery(
      message,
      (result) => this.handleGoogleResponse(result),
      (error) => console.log(error)
    )
  }

  onQuickReply(quickReply) {
    this.setState((previouseState) => ({
      messages: GiftedChat.append(previouseState.messages, quickReply)
    }))

    let message = quickReply[0].value;

    Dialogflow_V2.requestQuery(
      message,
      (result) => this.handleGoogleResponse(result),
      (error) => console.log(error)
    )
  }

  renderBubble = props => {

    if (props.currentMessage.isOptions) {
      return (
        <ScrollView>
          {props.currentMessage.data.map((item) => (
            <Card
              containerStyle={{
                padding: 0,
                borderRadius: 15, paddingBottom: 7, overflow: 'hidden',
              }}
              key={item.title}>
              <Card.Image style={{ width: 220, height: 110 }} resizeMode="cover" source={{ uri: item.image }}></Card.Image>
              <Card.Divider />
              <Card.Title>{item.title}</Card.Title>
              <Button
                title="Escoger"
                style={{ height: 35 }}
                onPress={() => this.sendBotResponse
                  (item.title)}
              />
            </Card>
          ))}
        </ScrollView>
      )
    }

    return (
      <Bubble
        {...props}
        textStyle={{ right: { color: 'white' } }}
        wrapperStyle={{
          left: { backgroundColor: 'gray' },
          right: { backgroundColor: 'blue' },
        }}
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={(message) => this.onSend(message)}
          onQuickReply={(quickReply) => this.onQuickReply(quickReply)}
          renderBubble={this.renderBubble}
          user={{ _id: 1 }} />
      </View>
    );
  }
}

export default App;