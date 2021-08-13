import { Actions } from "interfaces/service-actions.type";
import { QueryResult } from "pg";
import { commonActions, serviceActions } from './action-list';


export class DatabaseHandler {

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
  public async insertOne<payLoadType>(payload: payLoadType): Promise<QueryResult> {
    try {
      return await commonActions.INSERT_ONE(this.tableName, payload) as QueryResult

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
   public async insertMany(payload: [{ [x: string]: any }]): Promise<QueryResult> {
    try {
      return await commonActions.INSERT_MANY(this.tableName, payload) as QueryResult;

    } catch (error) {
      throw error
    }
  }

  /**
   * A function to find one record by id
   * 
   * @param id {Number}
   * @param attributes {Array}
   * @returns {Promise}
   */
   public async findOneById(id: number, attributes: string []): Promise<QueryResult> {
    try {
      return await commonActions.FIND_BY_ID(this.tableName, id, attributes) as QueryResult;

    } catch (error) {
      throw error
    }
  }

  /**
   * A function to delete one record by id
   * 
   * @param id {Number}
   * @returns {Promise}
   */
   public async deleteOneById(id: number): Promise<QueryResult> {
    try {
      return await commonActions.DELETE_BY_ID(this.tableName, id) as QueryResult

    } catch (error) {
      throw error
    }
  }

  /**
   * A function to update one record by id
   * 
   * @param id {Number}
   * @returns {Promise}
   */
   public async updateOneById<payLoadType>(id: number, payload: payLoadType): Promise<QueryResult> {
    try {
      return await commonActions.UPDATE_BY_ID(this.tableName, id, payload) as QueryResult

    } catch (error) {
      throw error
    }
  }
}

export default new DatabaseHandler('' as string);
