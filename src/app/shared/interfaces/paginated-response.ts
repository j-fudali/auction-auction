export interface PaginatedResponse<T> {
    pages: number,
    current_page: number;
    items_count: number;
    result: T[];
}
