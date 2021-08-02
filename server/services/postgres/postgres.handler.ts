import { Actions } from "interfaces/service-actions.type";
import {serviceActions} from './action-list';
async function postgresHandler<payLoadType,ResponseType>(action:Actions, payload:payLoadType): Promise<ResponseType> {
    try {
        
      return  await serviceActions[action](payload) as ResponseType

    } catch (error) {
        throw error;
    }
}

export default postgresHandler;
