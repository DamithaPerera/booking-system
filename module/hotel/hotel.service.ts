import {getAllHotelsRepo} from "./hotel.repository";


export const getAllHotelsService = async () => {
    return getAllHotelsRepo()
};