import * as Colors from '@darta-styles'
import { Box, CircularProgress} from '@mui/material'
import { animated, AnimatedProps, useTransition} from '@react-spring/web'
import React from 'react'

import { IntroComponent } from './IntroComponent'
import { splashStyles } from './styles'

const data1 = {
    headline: 'Buy for Love',
    explainer1: 'Leverage machine learning in partnership with leading galleries to grow your art collection',
    explainer2: 'Download darta and start training your digital art advisor today',
  };

const data2 = {
    headline: 'Taste Is Subjective',
    explainer1: 'With swipe-based art discovery, swipe up on the art you like, and we\'ll find more that suits',
    explainer2: 'Download darta and start training your digital art advisor today',
  };


const data3 = {
    headline: 'Build Relationships',
    explainer1: 'Personalized recommendations for you to visit shows, follow galleries, and grow your collection',
    explainer2: 'Download darta and start training your digital art advisor today',
  };
  
  const source = "/static/Home/Full.mp4"

const pages: ((props: AnimatedProps<{ style: React.CSSProperties }>) => React.ReactElement)[] = [
    ({ style }) => <animated.div style={{ ...style, 
        position: 'absolute', top: 30, left: 0, right: 0 }}><IntroComponent data={data1} /></animated.div>,
    ({ style }) => <animated.div style={{ ...style, 
        position: 'absolute', top: 30, left: 0, right: 0 }}><IntroComponent data={data2} /></animated.div>,
    ({ style }) => <animated.div style={{ ...style, 
        position: 'absolute', top: 30, left: 0, right: 0 }}><IntroComponent data={data3} /></animated.div>,
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
        <Box style={{ position: 'relative' }}>
            <Box sx={splashStyles.circularProgress}>
                <CircularProgress
                    variant="determinate"
                    value={progress}
                    size={20}
                    sx={{ color: Colors.PRIMARY_900 }}
                />
            </Box>
            <Box sx={splashStyles.container}>
                <Box sx={splashStyles.textContainer} onClick={() => setCurrentIndex((currentIndex + 1) % 3)}>
                    {transitions((style, i) => {
                        const Page = pages[i];
                        return <Page style={style} />;
                    })}
                </Box>
                <Box sx={splashStyles.phonePreviewContainer}>
                    <video style={{ height: '100%', minWidth: '100%' }} autoPlay loop muted playsInline>
                        <source src={source} type="video/mp4" />
                    </video>
                </Box>
            </Box>
        </Box>
    );
}
