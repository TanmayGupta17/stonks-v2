import Mybutton from '@/components/Mybutton';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { useRouter } from 'expo-router';
import React from 'react'
import { View, Text, TextInput } from 'react-native'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';


const Signup = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const route = useRouter();

    const signUp = async() => {
        // try {
        //   const auth = FIREBASE_AUTH;
        //   const response = await createUserWithEmailAndPassword(auth, email, password);
        //   console.log(response);
        //   alert("Signup Success");
        // } catch (error) {
        //   console.log(error);
        //   alert("Signup Failed");
        // }
    }
    const OnContinue = () =>{
      route.navigate("/login");
    }
    return (
        <View style={{padding:20, gap:20}}>
        <TextInput placeholder='Enter Your Name' style={{borderWidth:1,paddingHorizontal:20}} onChangeText={(text) => setName(text)}/>
        <TextInput placeholder='Enter Your Email' style={{borderWidth:1,paddingHorizontal:20}} onChangeText={(text) => setEmail(text)}/>
        <TextInput secureTextEntry={true} placeholder='Enter Your Password' style={{borderWidth:1,paddingHorizontal:20}} onChangeText={(text) => setPassword(text)}/>
        <Mybutton title={"Signup"} OnPress={signUp}/>
    </View>
    )
}

export default Signup
