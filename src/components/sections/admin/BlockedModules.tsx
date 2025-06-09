import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { useBlockedModules } from "./hooks/useBlockedModules"

export function BlockedModules() {

    const { modules, handleToggleModule } = useBlockedModules()

    return (
        <Accordion
            type="single"
            collapsible
            className="w-full md:w-[40%] h-full"
            defaultValue="item-1"
        >
            <AccordionItem value="item-1">
            <AccordionTrigger className="text-fluid-base">Modulos bloqueados y no seran visibles</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance px-5">
                 {
                    modules?.map((module) => (
                        <div key={module._id} className="flex items-center space-x-2">
                            <label htmlFor={`module-${module._id}`}>{module.name}</label>
                            <Switch
                                id={`module-${module._id}`}
                                checked={module.isActive}
                                onCheckedChange={(checked) => {
                                    handleToggleModule(module.moduleName, checked);
                                }}
                            />
                        </div>
                    ))
                 }
            </AccordionContent>
        </AccordionItem>

        </Accordion>
    )
}