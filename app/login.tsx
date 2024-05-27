import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useSignIn, useSignUp } from '@clerk/clerk-expo';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

const Page = () => {
  // Extract type from the route object ('login' or 'register')
  const { type } = useLocalSearchParams<{ type: string }>();

  // STATES START
  const [loading, setLoading] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  // STATES END

  const {
    signUp,
    isLoaded: signUpIsLoaded,
    setActive: signUpSetActive,
  } = useSignUp();
  const { signIn, isLoaded, setActive } = useSignIn();

  // FUNCTIONS START
  const onSignUpPress = async () => {
    if (!signUpIsLoaded) return;

    setLoading(true);

    try {
      // Sign up the user on Clerk
      const result = await signUp.create({ emailAddress, password });
      console.log('onSignUpPress result ', result);

      // Set the active session
      signUpSetActive({ session: result.createdSessionId });
    } catch (error: any) {
      Alert.alert(error.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  const onSignInPress = async () => {
    if (!isLoaded) return;

    setLoading(true);

    try {
      // Sign up the user
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });
      console.log('onSignInPress result ', result);

      // Set the active session
      setActive({ session: result.createdSessionId });
    } catch (error: any) {
      console.error('onSignUpPress error: ', error);
      Alert.alert(error.errors[0].message);
    } finally {
      setLoading(false);
    }
  };
  // FUNCTIONS END

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={70}
      style={styles.container}
    >
      {loading && (
        // Show dark background with loading spinner
        <View style={defaultStyles.loadingOverlay}>
          <ActivityIndicator size={'large'} color="#fff" />
        </View>
      )}

      <Image
        source={require('../assets/images/logo-dark.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>
        {type === 'login' ? 'Welcome Back' : 'Create Your Account'}
      </Text>

      <View style={{ marginBottom: 30 }}>
        <TextInput
          autoCapitalize="none"
          placeholder="Email"
          style={styles.inputField}
          value={emailAddress}
          onChangeText={setEmailAddress}
        />

        <TextInput
          autoCapitalize="none"
          placeholder="Password"
          style={styles.inputField}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {type === 'login' ? (
        <TouchableOpacity
          style={[defaultStyles.btn, styles.btnPrimary]}
          onPress={onSignInPress}
        >
          <Text style={styles.btnPrimaryText}>Sign in</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[defaultStyles.btn, styles.btnPrimary]}
          onPress={onSignUpPress}
        >
          <Text style={styles.btnPrimaryText}>Sign up</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginVertical: 80,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    marginVertical: 4,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Page;
