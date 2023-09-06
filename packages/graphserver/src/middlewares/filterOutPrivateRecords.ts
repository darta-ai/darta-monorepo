import _ from 'lodash'

const privateDataGallery = ["uuids", 
"primaryUUID", 
"primaryOwnerPhone", 
"primaryOwnerEmail", 
"signUpWebsite", 
"isValidated" 
]

export const filterOutPrivateRecordsSingleObject = (obj: any) : any => {
    const revisedObject = _.cloneDeep(obj)
    for (let key in revisedObject) {
      if (revisedObject[key].hasOwnProperty('isPrivate') && revisedObject[key].isPrivate === true){
        delete revisedObject[key]
      }
    }
    return revisedObject
}

export const filterOutPrivateRecordsMultiObject = (obj: any) : any => {
  const revisedObject = _.cloneDeep(obj)
  for (let key in revisedObject) {
    if (revisedObject[key].hasOwnProperty('isPrivate') && revisedObject[key].isPrivate === true){
      delete revisedObject[key]
    }
  }
  return revisedObject
}