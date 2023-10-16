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
            aria-label={`tier-perks`}
            itemClasses={{base: "data-[hover=true]:bg-white cursor-default select-none"}}
        >
            {perks.map(({Icon, label}) => (
                <ListboxItem
                    classNames={{title: "whitespace-normal text-base"}}
                    startContent={<Icon className="text-xl"/>}
                    key={label}>{label}</ListboxItem>
            ))}
        </Listbox>
    )
}