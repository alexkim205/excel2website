import {useActions, useValues} from "kea";
import {adminLogic} from "../logics/adminLogic";
import {Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import {capitalizeFirstLetter} from "kea-forms/lib/utils";
import {PricingTier} from "../utils/types";

function AdminDashboard() {
    const {users} = useValues(adminLogic)
    const {changeUserPlan} = useActions(adminLogic)

    const userRows = users.map((user) => ({
        key: user.id,
        email: user.user_metadata.email,
        plan: <Chip classNames={{content: "font-semibold text-white"}} size="sm"
                    color="success">{capitalizeFirstLetter(user.user_metadata.plan ?? PricingTier.Free)}</Chip>,
        change_plan: (
            <div className="flex flex-wrap flex-row gap-1.5">
                {[PricingTier.Free, PricingTier.Tiny, PricingTier.Small, PricingTier.Mega, PricingTier.Life].map((tier) => (
                    <Chip classNames={{content: "font-semibold text-white cursor-pointer", base: "hover:scale-105 transition-transform duration-500"}} size="sm" color="success" key={tier}
                          onClick={() => changeUserPlan(user.id, tier)}>
                        {capitalizeFirstLetter(tier)}
                    </Chip>
                ))}
            </div>
        )
    }))

    const columns = [
        {
            key: "email",
            label: "EMAIL",
        },
        {
            key: "plan",
            label: "PLAN",
        },
        {
            key: "change_plan",
            label: "CHANGE PLAN",
        },
    ];

    return (
        <div id={`admin-wrapper`} className="flex flex-col justify-start w-full gap-4 max-w-[1024px] px-6">
            <h3 className="text-3xl font-bold">Admin Dashboard</h3>
            <Table aria-label="Example table with dynamic content" shadow="sm" isStriped isHeaderSticky>
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={userRows}>
                    {(item) => (
                        <TableRow key={item.key}>
                            {(columnKey) => <TableCell>{item[columnKey as "email" | "plan"]}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminDashboard