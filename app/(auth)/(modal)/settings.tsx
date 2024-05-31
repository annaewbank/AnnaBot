import { Storage } from '@/app/utils/Storage';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

const Page = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const [apiKey, setApiKey] = useState('');
  const [org, setOrg] = useState('');

  // MMKV Start
  const [key, setKey] = useMMKVString('apiKey', Storage);
  const [organization, setOrganization] = useMMKVString('org', Storage);

  const saveApiKey = async () => {
    setKey(apiKey);
    setOrganization(org);
    router.push('/(auth)/(drawer)/(chat)/new');
  };

  const removeApiKey = async () => {
    setKey('');
    setOrganization('');
  };
  // MMKV End

  return (
    <View style={styles.container}>
      {key && key !== '' && (
        <>
          <Text style={styles.label}>You are all set!</Text>
          <TouchableOpacity
            style={[defaultStyles.btn, { backgroundColor: Colors.primary }]}
            onPress={removeApiKey}
          >
            <Text style={styles.buttonText}>Remove API Key</Text>
          </TouchableOpacity>
        </>
      )}

      {(!key || key === '') && (
        <>
          <Text style={styles.label}>API Key & Organization:</Text>
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="Enter your API key"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={org}
            onChangeText={setOrg}
            placeholder="Your organization"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[defaultStyles.btn, { backgroundColor: Colors.primary }]}
            onPress={saveApiKey}
          >
            <Text style={styles.buttonText}>Save API Key</Text>
          </TouchableOpacity>
        </>
      )}
      <Button title="Sign Out" onPress={() => signOut()} color={Colors.grey} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },

  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default Page;
