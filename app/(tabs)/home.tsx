import { View, Text, Modal } from 'react-native'
import React, {useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

import NewUserNamePop from '../../components/NewUserNamePop'

const home = () => {

  return (
    <SafeAreaView>
      <NewUserNamePop/>
      <View>
        <Text className='text-xl'>hi</Text>
      </View>
      <StatusBar style='dark' />
    </SafeAreaView>
  )
}

export default home