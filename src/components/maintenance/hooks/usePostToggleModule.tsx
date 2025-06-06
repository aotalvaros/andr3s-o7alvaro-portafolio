
import { ToggleModuleRequest } from "@/services/maintenance/models/toggleModuleRequest.interface";
import { toggleModule, ToggleModuleResponse } from "@/services/maintenance/toggleModule.service";
import { useMutation } from "@tanstack/react-query";

export const usePostToggleModule = () => {
    return useMutation({
        mutationKey: ['toggleModule'],
        mutationFn: (data: ToggleModuleRequest): Promise<ToggleModuleResponse> => toggleModule(data),
    })
}