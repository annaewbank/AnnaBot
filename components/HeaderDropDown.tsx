import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import * as DropDownMenu from 'zeego/dropdown-menu';

// Define prop types:
export type HeaderDropDownProps = {
  title: string;
  selected?: string;
  onSelect: (key: string) => void;
  items: Array<{ key: string; title: string; icon: string }>;
};

const HeaderDropDown = ({
  title,
  selected,
  onSelect,
  items,
}: HeaderDropDownProps) => {
  return (
    <DropDownMenu.Root>
      <DropDownMenu.Trigger>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <Text style={{ fontWeight: 500, fontSize: 16 }}>{title}</Text>
          {selected && (
            <Text
              style={{ color: Colors.greyLight, fontSize: 16, fontWeight: 500 }}
            >
              {selected} &gt;
            </Text>
          )}
        </View>
        {/* <Ionicons name="ellipsis-horizontal" size={24} color={'#fff'} /> */}
      </DropDownMenu.Trigger>
      <DropDownMenu.Content>
        {items.map((item) => (
          <DropDownMenu.Item key={item.key} onSelect={() => onSelect(item.key)}>
            <DropDownMenu.ItemTitle>{item.title}</DropDownMenu.ItemTitle>
            <DropDownMenu.ItemIcon
              ios={{
                name: item.icon,
                pointSize: 18,
              }}
            />
          </DropDownMenu.Item>
        ))}
      </DropDownMenu.Content>
    </DropDownMenu.Root>
  );
};

export default HeaderDropDown;
