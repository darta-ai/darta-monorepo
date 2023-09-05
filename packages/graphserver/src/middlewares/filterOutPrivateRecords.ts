import _ from 'lodash'
import { Request, Response, NextFunction } from 'express';

export const filterOutPrivateRecordsSingleObject = (req: Request, res: Response, next: NextFunction) => {
    
    console.log(req.body)
    const newObj = {}

    console.log('here')

    res.json({})
}