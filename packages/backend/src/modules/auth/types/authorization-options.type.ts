import { CrudAction } from "src/common/base/controllers/base-crud.controller";

// authorization-options.interface.ts
export type AuthorizationOptions = {
    /**
     * - Empty:  []           → all actions open to any authenticated user
     * - string[] :  ["admin"]                → same roles required for every action
     * - Partial<Record<...>> : { update: "admin" }    → per-endpoint control
     */
    roles?: string[] | Partial<Record<CrudAction, string[]>>;

    /** Minimum plan(s) required to access ANY endpoint on this controller */
    plans?: string[];
}