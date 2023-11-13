import * as Colors from '@darta-styles';

export const tabBarScreenOptions = {
  tabBarItemStyle: { 
    width: 'auto' as "auto" 
  },
  tabBarPressColor: 'transparent',
  tabBarLabelStyle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    textTransform: 'none' as 'none',
  },
  tabBarIndicatorStyle: {
    backgroundColor: Colors.PRIMARY_950,
    height: 3, 
    borderRadius: 6,
  },
  headerTitleStyle: {
    marginLeft: 24,
  },
  tabBarActiveTintColor: Colors.PRIMARY_950, // active label color
  tabBarInactiveTintColor: Colors.PRIMARY_300, // inactive label color
  tabBarStyle: {
    backgroundColor: Colors.PRIMARY_50,
    elevation: 0, // for Android - to remove the shadow
    shadowOpacity: 0, 
    borderWidth: 0, // to remove the border
  },
  paddingLeft: 24,
}


export const tabBarOptions= {
  activeTintColor: 'tomato',   // Color of the active tab label and icon
  inactiveTintColor: 'gray',  // Color of the inactive tab label and icon
  style: {
    backgroundColor: 'blue',  // Tab bar background color
  },
  labelStyle: {
    fontWeight: 'bold',       // Style object for the tab label
  },
  indicatorStyle: {
    backgroundColor: 'yellow',// Style object for the active tab indicator
  },
}