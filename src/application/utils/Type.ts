export interface IPagination {
    offset: number
    page: number
    active: boolean
}

export interface PaginationData {
    offset?: number
    page?: number
    active?: boolean
}

export class Pagination implements Pagination {
    readonly offset: number
    readonly page: number
    readonly active: boolean
    constructor({ active, offset, page }: PaginationData) {
        this.active = active ?? true
        this.offset = offset ?? 0
        this.page = page ?? 0
        if (this.page < 0) {
            throw new Error(`Page should be greater or equal to 0`)
        }
    }
}