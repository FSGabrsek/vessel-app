import { IUser } from "./user.interface"

export interface IVessel {
    _id: string
    title: string
    type: 'series' | 'film' | 'literature'
    synopsis: string
    finalLength: number
    currentLength: number
    status: 'upcoming' | 'ongoing' | 'finished'
    releaseDate: Date
    releaseInterval?: number
    owner: IUser
}

export type IVesselCreateDTO = Omit<IVessel, '_id' | 'status' | 'owner'>
export type IVesselUpdateTO = Pick<IVessel, 'finalLength' | 'status'>
