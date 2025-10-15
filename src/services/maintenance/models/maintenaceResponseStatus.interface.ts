export interface MaintenanceResponseStatus {
   data: responseModuleData[];
   status: string;
   cache?: boolean;
   responseTime?: number;
}

export interface responseModuleData {
   isActive: boolean;
   moduleName: string;
   __v: number;
   _id: string;
   name: string;
}