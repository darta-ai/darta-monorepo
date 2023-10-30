import * as Colors from '@darta-styles'
import { Box, CircularProgress} from '@mui/material'
import { animated, AnimatedProps, useTransition} from '@react-spring/web'
import React from 'react'

import { IntroComponent } from './IntroComponent'

const data1 = {
    headline: 'Your Walls Deserve Great Art',
    explainer1: 'Leverage machine learning in partnership with leading galleries to grow your art collection',
    explainer2: 'Download darta and start training your digital art advisor today',
  };
const source1 = "/static/Home/Intro.mp4" 

const data2 = {
    headline: 'Taste Is Subjective',
    explainer1: 'With swipe-based art discovery, swipe up on the art you like, and we\'ll find more that suits',
    explainer2: 'Download darta and start training your digital art advisor today',
  };
  
const source2 = "/static/Home/TinderForArt.mp4"


const data3 = {
    headline: 'Build Relationships',
    explainer1: 'Personalized recommendations for you to visit shows, follow galleries, and grow your collection',
    explainer2: 'Download darta and start training your digital art advisor today',
  };
  
  const source3 = "/static/Home/Explore.mp4"

const pages: ((props: AnimatedProps<{ style: React.CSSProperties }>) => React.ReactElement)[] = [
    ({ style }) => <animated.div style={{ ...style, 
        position: 'absolute', top: 30, left: 0, right: 0 }}><IntroComponent data={data1} source={source1} /></animated.div>,
    ({ style }) => <animated.div style={{ ...style, 
        position: 'absolute', top: 30, left: 0, right: 0 }}><IntroComponent data={data2} source={source2} /></animated.div>,
    ({ style }) => <animated.div style={{ ...style, 
        position: 'absolute', top: 30, left: 0, right: 0 }}><IntroComponent data={data3} source={source3} /></animated.div>,
  ]

  export function MainLanding() {
    const duration = 1500;
    const incrementDuration = duration / 10;

    const [currentIndex, setCurrentIndex] = React.useState<number>(0);

    const transitions = useTransition(currentIndex, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 750 },
    });

    const [progress, setProgress] = React.useState<number>(0);

    React.useEffect(()=> {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % 3);
                    return 0;
                }
                return prev + 1;
            });
        }, incrementDuration);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box onClick={() => setCurrentIndex((currentIndex + 1) % 3)} style={{position: 'relative'}}>
            <Box sx={{
                height: '5%', 
                width: '100%', 
                padding: '1%', 
                display: 'flex', 
                justifyContent: 'flex-end',
                }}>
                <CircularProgress 
                    variant="determinate" 
                    value={progress}
                    size={20}
                    sx={{color: Colors.PRIMARY_900}}
                />
            </Box>
            {transitions((style, i) => {
                const Page = pages[i];
                return <Page style={style} />
            })}
        </Box>
    )
}
