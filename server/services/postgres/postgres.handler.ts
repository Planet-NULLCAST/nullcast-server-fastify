import { Actions } from "interfaces/service-actions.type";
import { serviceActions } from './action-list';


async function postgresHandler<payLoadType, ResponseType>(action: Actions, payload: payLoadType): Promise<ResponseType> {
  try {

    return await serviceActions[action](payload) as ResponseType

  } catch (error) {
    throw error;
  }
}


export class DatabaseHandler {


  constructor() {}

  public async dbHandler<payLoadType, ResponseType>(action: Actions, payload: payLoadType): Promise<ResponseType> {
    try {

      return await serviceActions[action](payload) as ResponseType

    } catch (error) {
      throw error;
    }
  }
}

// const dbHandler = new DatabaseHandler();

export default postgresHandler;
