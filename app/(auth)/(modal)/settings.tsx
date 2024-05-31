import Colors from '@/constants/Colors';
import { useAuth } from '@clerk/clerk-expo';
import { View, Text, Button } from 'react-native';

const Page = () => {
  const { signOut } = useAuth();

  return (
    <View>
      <Button title="Sign Out" onPress={() => signOut()} color={Colors.grey} />
    </View>
  );
};

export default Page;
