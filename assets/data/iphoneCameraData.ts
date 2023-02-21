const iPhones = {
  iPhone14: {
    // 26mm
    lens: 26,
    // ƒ/1.5
    aperture: 1.5,
  },
  iPhone13: {
    // 26mm
    lens: 26,
    // 1.6
    f: 1.6,
    // μm
    pixelPitch: 1.7,
    sensorArea: '35.2mm^2',
    aperture: 'F8.2',
    fieldOfView: '',
  },
  iPhone13Pro: {
    lens: 26,
    f: 1.5,
    pixelPitch: 1.9,
    sensorArea: '44mm^2',
    aperture: 'F6.8',
  },
  iPhone12: {
    lens: 26,
    f: 1.6,
    pixelPitch: 1.4,
    sensorArea: '23.9mm^2',
    aperture: 'F9.9',
  },
  iPhone12Pro: {
    lens: 26,
    f: 1.6,
    pixelPitch: 1.4,
    sensorArea: '23.9mm^2',
    aperture: 'F9.9',
  },
};

// 16:9 aspect ratio

// 69.39° horizontal field of view, 79.52° on the diagonal

const calculateAngularFOV = (horizontalDimensionOfSensor: number, focalLength: number): number => 2 * Math.tan(1) ** -1 * (horizontalDimensionOfSensor / (2 * focalLength))
// where h is the horizontal dimension of the sensor and F is the focal length of the camera lens.
;

const calculateFOV = (horizontalDimensionOfSensor: number, focalLength: number): number => 2 * Math.tan(1) ** -1 * (horizontalDimensionOfSensor / 2 * focalLength)
// where h is the horizontal dimension of the sensor and F is the focal length of the camera lens.
;

const calculateDiameterFOV = (fov: number, magnification:number): number => (fov / magnification);

// https://developer.apple.com/documentation/modelio/mdlcamera/1391726-fieldofview
// The default field of view is 54 degrees,
// corresponding to a focal length of 50mm
// and a vertical sensor aperture of 24mm.

export default iPhones;
