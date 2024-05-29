import HeaderDropDown from '@/components/HeaderDropDown';
import { defaultStyles } from '@/constants/Styles';
import { Stack } from 'expo-router';
import { View } from 'react-native';

const Page = () => {
  return (
    <View style={defaultStyles.pageContainer}>
      {/* Change header on page instead of on layout */}
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropDown
              title="ANNA·E"
              onSelect={() => {}}
              items={[
                {
                  key: 'share',
                  title: 'Share Bot',
                  icon: 'square.and.arrow.up',
                },
                { key: 'details', title: 'See Details', icon: 'info.circle' },
                { key: 'keep', title: 'Keep in Sidebar', icon: 'pin' },
              ]}
            />
          ),
        }}
      />
    </View>
  );
};

export default Page;
