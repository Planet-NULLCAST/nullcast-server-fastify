import { Actions } from 'interfaces/service-actions.type';
import { QueryResult, QueryResultRow } from 'pg';
import { commonActions, serviceActions } from './action-list';
import { QueryParams } from 'interfaces/query-params.type';
import { TokenUser } from 'interfaces/user.type';

export class DatabaseHandler {
  private tableName: string;
  constructor(_tableName: string) {
    this.tableName = _tableName;
  }

  // Todo: rename function name to query
  public async dbHandler<PayLoadType, ResponseType>(
    action: Actions,
    payload: PayLoadType,
    queryParams?: QueryParams,
    user?: TokenUser
  ): Promise<ResponseType> {
    try {
      return (await serviceActions[action](payload, queryParams, user)) as ResponseType;
    } catch (error) {
      throw error;
    }
  }

  /**
   * A function to insert one record into database
   *
   * @param payload {PayLoadType}
   * @returns {Promise}
   */
  public async insertOne<PayLoadType, ResponseType>(
    payload: PayLoadType,
    Fields?: string[]
  ): Promise<QueryResult<ResponseType>> {
    try {
      return await commonActions.INSERT_ONE(this.tableName, payload, Fields);
    } catch (error) {
      throw error;
    }
  }

  /**
   * A function to insert many records into database
   *
   * @param payload {PayLoadType}
   * @returns {Promise}
   */
  public async insertMany(
    payload: [{ [x: string]: any }]
  ): Promise<QueryResult> {
    try {
      return (await commonActions.INSERT_MANY(
        this.tableName,
        payload
      )) as QueryResult;
    } catch (error) {
      throw error;
    }
  }

  /**
   * A function to find one record by id
   *
   * @param id {Number}
   * @param attributes {Array}
   * @returns {Promise}
   */
  public async findOneById(
    id: number,
    attributes: string[]
  ): Promise<QueryResultRow> {
    try {
      return await commonActions.FIND_BY_ID(this.tableName, id, attributes);
    } catch (error) {
      throw error;
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
      return (await commonActions.DELETE_BY_ID(
        this.tableName,
        id
      )) as QueryResult;
    } catch (error) {
      throw error;
    }
  }

  /**
   * A function to update one record by id
   *
   * @param id {Number}
   * @returns {Promise}
   */
  public async updateOneById<PayLoadType>(
    id: number,
    payload: PayLoadType,
    Fields?: string[]
  ): Promise<QueryResult> {
    try {
      return (await commonActions.UPDATE_BY_ID(
        this.tableName,
        id,
        payload,
        Fields
      )) as QueryResult;
    } catch (error) {
      throw error;
    }
  }

  /**
   * A function to find one record by id
   *
   * @param id {Number}
   * @param attributes {Array}
   * @returns {Promise}
   */
  public async findOneByField<PayLoadType>(
    payload: PayLoadType,
    attributes: any[]
  ): Promise<QueryResultRow> {
    try {
      return await commonActions.FIND_ONE_BY_FIELD(
        this.tableName,
        payload,
        attributes
      );
    } catch (error) {
      throw error;
    }
  }
}

export default new DatabaseHandler('' as string);
