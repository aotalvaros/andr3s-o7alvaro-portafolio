export interface MaintenanceResponseStatus {
   data: responseModuleData[];
   status: string;
   cache?: boolean;
   responseTime?: number;
}

export interface responseModuleData {
   isActive: boolean;
   isBlocked: boolean;
   moduleName: string;
   __v: number;
   _id: string;
   name: string;
   lastModifiedAt: string;
   lastModifiedBy: LastModifiedBy
}

export interface LastModifiedBy {
   _id: string;
   name: string;
   email: string;
}