import _ from 'lodash';

export const filterOutPrivateRecordsSingleObject = (obj: any): any => {
  const revisedObject = _.cloneDeep(obj);
  for (const key in revisedObject) {
    if (
      // eslint-disable-next-line no-prototype-builtins
      revisedObject[key].hasOwnProperty('isPrivate') &&
      revisedObject[key].isPrivate === true
    ) {
      delete revisedObject[key];
    }
  }
  return revisedObject;
};

export const filterOutPrivateRecordsMultiObject = (obj: any): any => {
  const revisedObject = _.cloneDeep(obj);
  for (const key in revisedObject) {
    if (
      // eslint-disable-next-line no-prototype-builtins
      revisedObject[key].hasOwnProperty('isPrivate') &&
      revisedObject[key].isPrivate === true
    ) {
      delete revisedObject[key];
    }
  }
  return revisedObject;
};
