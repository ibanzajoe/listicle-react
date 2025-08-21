import { IconChevronRight } from '@tabler/icons-react';
import { Avatar, Group, Text, UnstyledButton } from '@mantine/core';
import './AvatarButton.css'
import { useAuth } from '@/context/AuthContext';
import { use, useMemo } from 'react';

export function UserButton() {
  const { user } = useAuth();

  const userName = useMemo(() => {
    if (user && user.user) {
      if (user.user.first_name && user.user.last_name) {
        return `${user.user.first_name} ${user.user.last_name}`
      }
      return 'No Name'
    }
    return 'No User'
  }, [user]);

  const userEmail = useMemo(() => user?.user.email, [user]);

  return (
    <UnstyledButton className={"user"}>
      <Group>
        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
          radius="xl"
        />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {userName}
          </Text>

          <Text c="dimmed" size="xs">
            {userEmail}
          </Text>
        </div>

        <IconChevronRight size={14} stroke={1.5} />
      </Group>
    </UnstyledButton>
  );
}