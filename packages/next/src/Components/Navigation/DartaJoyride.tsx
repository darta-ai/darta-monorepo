import {PRIMARY_600} from '@darta-styles'
import React from 'react';
import Joyride, {ACTIONS, EVENTS, STATUS} from 'react-joyride';

export function DartaJoyride({
  steps,
  stepIndex,
  setStepIndex,
  run,
  setRun,
}: {
  steps: any;
  stepIndex: number;
  setStepIndex: (arg0: number) => void;
  run: boolean;
  setRun: (arg0: boolean) => void;
}) {
  const joyrideCallback = (data: any) => {
    const {action, index, status, type} = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status) && run) {
      setRun(false);
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    }
  };

  return (
    <Joyride
      callback={joyrideCallback}
      continuous
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      disableOverlayClose
      disableScrolling
      stepIndex={stepIndex}
      steps={steps}
      styles={{
        options: {
          primaryColor: PRIMARY_600,
          arrowColor: 'rgba(0, 0, 0, 0.8)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          overlayColor: 'rgba(0, 0, 0, 0.4)',
          textColor: '#fff',
          width: 400,
          zIndex: 10000,
        },
      }}
    />
  );
}
