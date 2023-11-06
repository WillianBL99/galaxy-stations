import { AppController } from "../../../application/controller";
import { IPagination, Pagination } from "../../../utils/Type";

type GQLPagination = {
    pagination: Omit<IPagination, "active">
}
export class StationHistoryResolver {
    constructor(private readonly appController: AppController) { }

    private user = (parent: any, _args: any, _context: any) => {
        return this.appController.user.getById(parent.userId);
    }

    content() {
        return {
            user: this.user,
        }
    }
}


