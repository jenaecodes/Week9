import React from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
import { 
  HamburgerIcon, 
  CloseIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import DarkModeSwitch from './DarkModeSwitch';
import { HomeIcon } from '../src/icons';

const Links = [
  {
    label:'To Do',
    url:'/todos'
  },
  {
    label:'Events',
    url:'/events'
  },
  {
    label:'Contacts',
    url: '/contacts'
  }
];

const Header2 = ({ email, signOut }) => {

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>
              <Link href={'/'}>
                
                <HomeIcon />
              </Link>
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <Link
                  key={link.url}
                  px={2}
                  py={1}
                  rounded={'md'}
                  _hover={{
                    textDecoration: 'none',
                    bg: useColorModeValue('gray.200', 'gray.700'),
                  }}
                  href={link.url}>
                  {link.label}
                </Link>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <SettingsIcon />
              </MenuButton>
                <MenuList>
                  <MenuItem>
                    {email ? (
                      <>
                      <p>Signed in as {email}</p>
                      </>
                    ) : (
                      <>
                      <p>
                        <Link href="/auth">Sign In</Link>
                      </p>
                      </>
                    )}
                  </MenuItem>
                  <MenuDivider />
                  {/* Intentionally 
                  leading out <MenuItem> because it is rendered as a Button
                  DarkModeSwitch is already a button and we want it to fill the container in this case */}
                    <DarkModeSwitch /> 

                  <MenuDivider />
                  {email ? (
                    <>
                      <MenuItem>
                        <Link
                          onClick={
                            () => {
                              signOut();
                            }
                          }
                        >
                          Sign out
                        </Link>
                      </MenuItem>
                    </>
                  ) : (
                    <>
                    </>
                  )}
                </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <Link
                  key={link.url}
                  px={2}
                  py={1}
                  rounded={'md'}
                  _hover={{
                    textDecoration: 'none',
                    bg: useColorModeValue('gray.200', 'gray.700'),
                  }}
                  href={link.url}>
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
)
}

export default Header2