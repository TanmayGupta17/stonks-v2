import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';

import { FIREBASE_AUTH } from '@/FirebaseConfig';
import Mybutton from '@/components/Mybutton';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const signIn = async () => {
    try {
      const response = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      console.log("Login Success:", response.user.email);
      Alert.alert("Success", "You are now logged in!");
      router.replace("/signup"); // or navigate to your home/dashboard page
    } catch (error) {
      console.error("Login Error:", (error as Error).message);
      Alert.alert("Login Failed", (error as Error).message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginBottom: 12,
          borderRadius: 6
        }}
      />
      <TextInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginBottom: 20,
          borderRadius: 6
        }}
      />
      <Mybutton title="Login" OnPress={signIn} />
    </View>
  );
};

export default Login;
