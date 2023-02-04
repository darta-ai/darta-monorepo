import React, { useState, useEffect } from "react";
import { View, ImageBackground } from "react-native";
// import CardStack, { Card } from "react-native-card-stack-swiper";
// import {getImageCollection} from '../firebase/firebase'

import { City, CardItem } from "../components";
import styles from "../assets/styles";
import DEMO from "../assets/data/demo";
import Gallery from '../components/Gallery'

// import DeviceInfo from "react-native-device-info";

const Home = () => {
  const [swiper, setSwiper] = useState<null>(null);

  const [images, setImage] = useState()


  useEffect(() => {
    async function fetchData(){
      
      // console.log('!!!!!!!!!!!')
      // console.log("@ device   ",DeviceInfo.getBundleId())
      // const imageSnapshot = await getImageCollection();

      // const imageList = imageSnapshot.docs.map(doc => doc.data());
      
      // const images = imageList.slice(0, 100)

      // setImage(images)
    }
    fetchData()
  }, [])

  return (
    <ImageBackground
      source={require("../assets/images/bg.png")}
      style={styles.bg}
    >
      <View style={styles.containerHome}>
        {/* <View style={styles.top}>
          <City />
        </View> */}

        <Gallery />
        {/* <CardStack
          loop
          verticalSwipe={false}
          renderNoMoreCards={() => null}
          ref={(newSwiper): void => setSwiper(newSwiper)}
        > */}
          {/* {DEMO.map((item) => (
            // <Card key={item.id}>
              <CardItem
                hasActions
                image={item.image}
                name={item.name}
                description={item.description}
                matches={item.match}
              />
            // </Card>
          ))} */}
        {/* </CardStack> */}
      </View>
    </ImageBackground>
  );
};

export default Home;
