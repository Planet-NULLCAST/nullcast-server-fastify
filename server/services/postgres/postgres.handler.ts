import { Actions } from "interfaces/service-actions.type";
import { commonActions, serviceActions } from './action-list';



export class DatabaseHandler {

  // Uncomment the below code to use pgClient
  private tableName: string;
  constructor(_tableName: string) {
    this.tableName = _tableName;
    
  }


  public async dbHandler<payLoadType, ResponseType>(action: Actions, payload: payLoadType): Promise<ResponseType> {
    try {

      return await serviceActions[action](payload) as ResponseType

    } catch (error) {
      throw error;
    }
  }

  /**
   * A function to insert one record into database
   * 
   * @param payload {payLoadType}
   * @returns {Promise}
   */
  public async insertOne<payLoadType, ResponseType>(payload: payLoadType): Promise<ResponseType> {
    try {
      return await commonActions.INSERT_ONE(this.tableName, payload) as ResponseType

    } catch (error) {
      throw error
    }
  }

  /**
   * A function to insert many records into database
   * 
   * @param payload {payLoadType}
   * @returns {Promise}
   */
   public async insertMany<payLoadType, ResponseType>(payload: payLoadType): Promise<ResponseType> {
    try {
      return await commonActions.INSERT_MANY(this.tableName, payload) as ResponseType

    } catch (error) {
      throw error
    }
  }

  /**
   * A function to find one record by id
   * 
   * @param payload {payLoadType}
   * @returns {Promise}
   */
   public async findOneById<payLoadType, ResponseType>(payload: payLoadType): Promise<ResponseType> {
    try {
      return await commonActions.FIND_BY_ID(this.tableName, payload) as ResponseType

    } catch (error) {
      throw error
    }
  }
}

export default new DatabaseHandler('' as string);
