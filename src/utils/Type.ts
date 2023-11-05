import { AppError } from "../message/Errors"

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
    offset: number
    page: number
    active: boolean
    constructor({ active, offset, page }: PaginationData) {
        this.active = active ?? true
        this.offset = offset ?? 0
        this.page = page ?? 0
        if (this.page < 0) {
            AppError.throw({typeErr: "invalidPageParameter"})
        }
    }

    activate(page: number, offset: number) {
        this.active = true
        this.page = page
        this.offset = offset
    }
}