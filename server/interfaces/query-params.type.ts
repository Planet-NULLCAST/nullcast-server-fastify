enum order { ASC, DESC }

export interface QueryParams {
    limit_fields?: string;
    search?: string;
    page?: number;
    limit?: number;
    status?: string,
    order?: order,
    sort_field?: string,
    with_table?: string
}
