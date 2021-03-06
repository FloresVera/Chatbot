import { StatusBar } from 'expo-status-bar';
import React, { Component, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Linking, Alert } from 'react-native';
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

const OpenURLButton = ({ url, children }) => {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Button title={children} onPress={handlePress} />;
};
class App extends Component {

  state = {
    messages: [{ _id: 2, text: 'Soy el Sr. Bot y seré tu guía en esta página web.', createdAt: new Date(), user: BOT }, { _id: 1, text: 'Hola', createdAt: new Date(), user: BOT }],
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
        text: 'Encarnación, conocido como la perla del sur.\nEs una excelente opción para el verano, te enseño algunos lugares?',
        image: 'https://infonegocios.com.py/uploads/encartacion-404anios-plus-marzo3.jpg',
        createdAt: new Date(),
        user: BOT,
      };
    } else if (text == 'mostrar opciones') {
      msg = {
        _id: this.state.messages.length + 1,
        text: 'Entre los más populares se encuentran...',
        createdAt: new Date(),
        user: BOT,
        isOptions: true,
        data: [
          {
            title: 'Playa San José',
            image: 'https://www.venus.com.py/wp-content/uploads/2020/11/playa-san-jose-simulacro.jpeg',
            url: 'https://g.co/kgs/uWC5zy',
          },
          {
            title: 'Santuario de la virgen de Itacua',
            image: 'https://fastly.4sqi.net/img/general/600x600/28865169_OxI7CCqNp2Kb75JSkaQAXQpzs-4a47vf2K0Nzj-Ry-g.jpg',
            url: 'https://g.co/kgs/T73e4M',
          },
          {
            title: 'Plaza de Armas',
            image: 'https://media-cdn.tripadvisor.com/media/photo-s/06/83/d6/b6/plaza-de-armas.jpg',
            url: 'https://g.co/kgs/grqb9c',
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
    } else if (text == 'restaurant') {
      msg = {
        _id: this.state.messages.length + 1,
        text: 'Hay varias opciones para diferentes gustos.',
        createdAt: new Date(),
        user: BOT,
        isOptions: true,
        data: [
          {
            title: 'A la carta',
            image: 'https://as01.epimg.net/epik/imagenes/2019/04/22/portada/1555949275_957223_1555949556_noticia_normal.jpg',
            url: 'http://c1951292.ferozo.com/leandro',
          },
          {
            title: 'Bufet',
            image: 'https://www.eventindustryshow.com/img/blog/noticia3.jpg',
            url: 'http://c1951292.ferozo.com/leandro',
          },
          {
            title: 'Comida chatarra',
            image: 'https://img.vixdata.io/pd/jpg-large/es/sites/default/files/btg/curiosidades.batanga.com/files/Por-que-nuestro-cerebro-ama-la-comida-chatarra-00.jpg',
            url: 'http://c1951292.ferozo.com/leandro',
          },
        ],
      };
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
              <Card.Image style={{ width: 300, height: 110 }} resizeMode="cover" source={{ uri: item.image }}></Card.Image>
              <Card.Divider />
              <Card.Title>{item.title}</Card.Title>
              <OpenURLButton url={item.url}>Más información</OpenURLButton>
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