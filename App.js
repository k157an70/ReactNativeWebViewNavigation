import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, BackHandler } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { WebView } from 'react-native-webview';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Loading = () => <ActivityIndicator
    style={[styles.container, styles.loading]}
    color="blue"
    size="large"
/>

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button
        onPress={() => navigation.navigate('Webview')}
        title="GO TO INVINITE"
      />
    </View>
  )
}

const WebViewScreen = ({ navigation }) => {
  const webviewref = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForwad] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('https://infinite.red');

  const backAction = () => {
    if(canGoBack){
      webviewref.current.goBack()
    }else{
      navigation.goBack()
    }
    return true;
  }
  const forwardAction = () => {
    if(webviewref.current) webviewref.current.goForward()
  }
  useEffect(()=> {
      BackHandler.addEventListener("hardwareBackPress", backAction);

      return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [ canGoBack ])

  return (
  <>
    <WebView
        ref={webviewref}
        source={{ uri: currentUrl}}
        startInLoadingState
        renderLoading={Loading}
        onNavigationStateChange={navState => {
          setCanGoBack(navState.canGoBack);
          setCanGoForwad(navState.canGoForward);
          setCurrentUrl(navState.url)
        }}
    />
    <View style={styles.navigationContainer}>
      <TouchableOpacity disabled={!canGoBack} onPress={backAction}>
        <Text style={[styles.btn, !canGoBack && {color:'grey'} ]}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity disabled={!canGoForward} onPress={forwardAction}>
        <Text style={[ styles.btn, !canGoForward && { color: 'grey'} ]}>Forward</Text>
      </TouchableOpacity>
    </View>
   </>
  )
}

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen}/>
          <Stack.Screen name="Webview" component={WebViewScreen}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center'
  },
  loading:{
    position: 'absolute',
    width:'100%',
    height:'100%'
  },
  navigationContainer:{
    backgroundColor:'#b43575',
    padding: 10,
    justifyContent:'space-around',
    flexDirection:'row'
  },
  btn:{
    color:'white',
    fontSize:24
  }
})

export default App;