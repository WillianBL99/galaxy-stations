import { IPagination } from "./Type"

type PrismaPagination = {
    skip: number
    take: number
}

export class Parsers {
    static paginationToPrisma(pagination: IPagination): PrismaPagination | undefined {
        if (pagination.active) {
            const skip = pagination.page * pagination.offset
            return {
                skip,
                take: pagination.offset
            }
        }
    }
}