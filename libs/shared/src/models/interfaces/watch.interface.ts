import { IUser } from "./user.interface"

export interface IReview {
    rating: '+' | '~' | '-'
    content: string
}

export interface IWatch {
    _id: string
    progress: number
    vessel: object
    review: IReview
    owner: IUser
}

export interface IWatchCreateDTO {
    progress: number
    vessel: string
}
export type IWatchUpdateDTO = Pick<IWatch, 'progress'>