import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

const botAvatar = require('./assets/t_a16e6647052e49739c12419019c64d13_name_asfsa.jpg')

const BOT = {
  _id: 2,
  name: 'Sr. Bot',
  avatar: botAvatar
}
class App extends Component {

  state = {
    messages: [{_id: 2, text: 'Soy el Sr. Bot', createdAt: new Date(), user: BOT}, {_id: 1, text: 'Hola', createdAt: new Date(), user: BOT}],
    id: 1,
    name: ''
  }

  onSend(messages = []){

  }

  onQuickReply(quickReply){
    
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={(message) => this.onSend(message)}
          onQuickReply={(quickReply) => this.onQuickReply(quickReply)}
          user={{ _id: 1 }} />
      </View>
    );
  }
}

export default App;