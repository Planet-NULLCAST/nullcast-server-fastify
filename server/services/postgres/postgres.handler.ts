import { Actions } from "interfaces/service-actions.type";
import { Client } from "pg";
import { serviceActions } from './action-list';


// async function postgresHandler<payLoadType, ResponseType>(action: Actions, payload: payLoadType): Promise<ResponseType> {
//   try {

//     return await serviceActions[action](payload) as ResponseType

//   } catch (error) {
//     throw error;
//   }
// }


export class DatabaseHandler {

  // Uncomment the below code to use pgClient
  // private pgClient: Client
  constructor(_pgClient: Client) {
    // this.pgClient = pgClient
    
  }


  public async dbHandler<payLoadType, ResponseType>(action: Actions, payload: payLoadType): Promise<ResponseType> {
    try {

      return await serviceActions[action](payload) as ResponseType

    } catch (error) {
      throw error;
    }
  }
}


export default  new DatabaseHandler((globalThis as any).postgresClient as Client);
