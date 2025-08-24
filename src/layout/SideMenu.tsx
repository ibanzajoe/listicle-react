import { IconBulb, IconCheckbox, IconLogout, IconPlus, IconSearch, IconUser } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Code,
  Group,
  Image,
  NavLink,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import './SideMenu.css';
import { UserButton } from '@/components/auth/AvatarButton';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const links = [
  { icon: IconBulb, label: 'Activity', notifications: 3 },
  { icon: IconCheckbox, label: 'Tasks', notifications: 4 },
  { icon: IconUser, label: 'Contacts' },
];

const collections = [
  { emoji: '🧑‍🔬', label: 'Users', href: '/admin/users' },
  { emoji: '🏷️', label: 'Categories', href: '/admin/categories' },
  { emoji: '🛒', label: 'Products', href: '/admin/products' },
  /* { emoji: '💸', label: 'Discounts' }, */
  /* { emoji: '💰', label: 'Orders' }, */
  { emoji: '💰', label: 'Orders', href: '/admin/orders' },
  { emoji: '🔧', label: 'Settings', href: '/admin/settings' },
  { emoji: '✨', label: 'Reports', href: '/admin/reports' },
  /* { emoji: '🙈', label: 'Debts' },
  { emoji: '💁‍♀️', label: 'Customers' }, */
];

export function SideMenu() {
  const { logout } = useAuth();
  const location = useLocation();
  const mainLinks = links.map((link) => (
    <UnstyledButton key={link.label} className={"mainLink"}>
      <div className={"mainLinkInner"}>
        <link.icon size={20} className={"mainLinkIcon"} stroke={1.5} />
        <span>{link.label}</span>
      </div>
      {link.notifications && (
        <Badge size="sm" variant="filled" className={"mainLinkBadge"}>
          {link.notifications}
        </Badge>
      )}
    </UnstyledButton>
  ));

  const [active, setActive] = useState(0);

  console.log('pathname: ', location.pathname);

  const collectionLinks = collections.map((collection, index) => (
    <NavLink
        className={"!py-1"}
        active={location.pathname.split('/').includes(collection.href.split('/')[2])}
        key={`collection-${collection.label}`}
        label={collection.label}
        leftSection={<Box component="span" mr={2} fz={14}>{collection.emoji}</Box>}
        component={Link}
        to={collection.href}
        onClick={() => setActive(index)}
      />
  ))

  const collectionLinks2 = collections.map((collection) => (
    <a
      href="#"
      onClick={(event) => event.preventDefault()}
      key={collection.label}
      className={"collectionLink"}
    >
      <Box component="span" mr={9} fz={16}>
        {collection.emoji}
      </Box>{' '}
      {collection.label}
    </a>
  ));

  return (
    <nav className={"navbar h-full sticky top-0 left-0 h-screen"}>
      <div className={"section p-4"}>
        <Image src={"/images/listicle_logo.png"} alt="logo" h={54} fit="contain" />
      </div>

      <div className={"section p-4 pt-0"}>
        <UserButton />
      </div>

      <TextInput
        placeholder="Search"
        size="xs"
        leftSection={<IconSearch size={12} stroke={1.5} />}
        rightSectionWidth={70}
        rightSection={<Code className={"searchCode"}>Ctrl + K</Code>}
        styles={{ section: { pointerEvents: 'none' } }}
        mb="sm"
      />

      <div className={"section px-3"}>
        <div className={"mainLinks"}>{mainLinks}</div>
      </div>

      <div className={"section h-full"}>
        <Group className={"collectionsHeader"} justify="space-between">
          <Text size="xs" fw={500} c="dimmed">
            Collections
          </Text>
          <Tooltip label="Create collection" withArrow position="right">
            <ActionIcon variant="default" size={18}>
              <IconPlus size={12} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <div className={"collections"}>{collectionLinks}</div>
      </div>
      
      <div className={"flex items-center justify-center"}>
        <Button variant="default" leftSection={<IconLogout size={14} />} size="xs" onClick={logout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}