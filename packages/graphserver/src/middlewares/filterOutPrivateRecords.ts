import _ from 'lodash'

export const filterOutPrivateRecordsSingleObject = (obj: any) : any => {
    const revisedObject = _.cloneDeep(obj)
    for (let key in revisedObject) {
      if (revisedObject[key].hasOwnProperty('isPrivate') && revisedObject[key].isPrivate === true){
        delete revisedObject[key]
      }
    }
    return obj
}