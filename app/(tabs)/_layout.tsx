import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

import { Colors, TabBarTheme, HeaderTheme, BorderRadius } from '@/constants/Theme';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconContainer, props.focused && styles.iconContainerActive]}>
      <FontAwesome size={22} {...props} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: TabBarTheme.activeTintColor,
        tabBarInactiveTintColor: TabBarTheme.inactiveTintColor,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: true,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: HeaderTheme.tintColor,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Create',
          headerTitle: 'TalkingPhoto AI',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="magic" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
          headerTitle: 'My Videos',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="th" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="preview"
        options={{
          title: 'Preview',
          headerTitle: 'Preview',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="play-circle" color={color} focused={focused} />
          ),
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
    paddingTop: 8,
    paddingBottom: 8,
    height: 80,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  header: {
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
    shadowColor: 'transparent',
    elevation: 0,
  },
  headerTitle: {
    color: Colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  iconContainer: {
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
  },
  iconContainerActive: {
    backgroundColor: Colors.primary.subtle,
  },
});
