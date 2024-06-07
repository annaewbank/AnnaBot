import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';

export type Props = {
  items: Array<{
    key: Number;
    title: string;
    icon: string;
  }>;
  onSelect: (key: string) => void;
};

const DropDownMenu = ({ items, onSelect }: Props) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        {items.map((item) => (
          <DropdownMenu.Item key={item.key} onSelect={() => onSelect(item.key)}>
            <DropdownMenu.ItemTitle>{item.title}</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon ios={{ name: item.icon }} />
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DropDownMenu;
