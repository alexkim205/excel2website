import {Listbox, ListboxItem} from "@nextui-org/react";
import {IconType} from "react-icons";

export interface TierPerksProps {
    perks: {
        Icon: IconType, label: string
    }[]
}

export function TierPerks({perks}: TierPerksProps) {
    return (
        <Listbox
            color="default"
            variant="solid"
            className="p-0"
            itemClasses={{base: "data-[hover=true]:bg-white cursor-default select-none"}}
        >
            {perks.map(({Icon, label}) => (
                <ListboxItem
                    classNames={{title: "whitespace-normal"}}
                    startContent={<Icon className="text-lg"/>}
                    key={label}>{label}</ListboxItem>
            ))}
        </Listbox>
    )
}