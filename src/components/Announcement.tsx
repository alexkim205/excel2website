import {Link} from "@nextui-org/react";
import {urls} from "../utils/routes";

export function Announcement() {
    return (
        <div className="bg-warning font-medium text-lg px-6 w-full py-5 flex justify-center items-center">
            <div className="max-w-[800px] text-center">
                🔥 Lock in a lifetime deal before pricing changes! $20 for unlimited public dashboards on custom domains for life. <Link
                href={urls.pricing()}
                underline="always"
                className="ml-1 text-lg text-primary-600"
                color="primary"
            >
                Get started today
            </Link>
            </div>
        </div>
    )
}