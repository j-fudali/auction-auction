export interface ItemsFilters {
    page?: number;
    orderBy?: string;
    search?: string;
    category?: string;
}
export interface MyItemsFilters extends ItemsFilters{
    type?: string;
}