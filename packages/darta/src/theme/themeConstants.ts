import * as Colors from '@darta-styles';

export const tabBarScreenOptions = {
    tabBarPressColor: Colors.PRIMARY_950,
    tabBarLabelStyle: {fontFamily: 'AvenirNext-Italic', fontSize: 12},
    tabBarIndicatorStyle: {backgroundColor: Colors.PRIMARY_400},
    tabBarActiveTintColor: Colors.PRIMARY_950,
    tabBarInactiveTintColor: Colors.PRIMARY_500,
    tabBarStyle: {
      backgroundColor: Colors.PRIMARY_50,
    }
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