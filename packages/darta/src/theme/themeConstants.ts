import * as Colors from '@darta-styles';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

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
    width: 0.7,
    borderRadius: 6,
    marginLeft: 10,
  },
  tabBarActiveTintColor: Colors.PRIMARY_950, // active label color
  tabBarInactiveTintColor: Colors.PRIMARY_300, // inactive label color
  tabBarContentContainerStyle:{
    marginLeft: 10,
    marginTop: 11,
    marginBottom: 12,
  },
  tabBarStyle: {
    backgroundColor: Colors.PRIMARY_50,
    elevation: 0, // for Android - to remove the shadow
    shadowOpacity: 0, 
    width: wp('100%'),
    height: 54,
    borderWidth: 0, // to remove the border
  },
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