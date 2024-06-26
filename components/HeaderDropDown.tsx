import Colors from '@/constants/Colors';
import { View, Text } from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';

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
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
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
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {items.map((item) => (
          <DropdownMenu.Item key={item.key} onSelect={() => onSelect(item.key)}>
            <DropdownMenu.ItemTitle>{item.title}</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon
              ios={{
                name: item.icon,
                pointSize: 18,
              }}
            />
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default HeaderDropDown;
