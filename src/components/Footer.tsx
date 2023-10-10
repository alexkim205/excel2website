import {BsFillFileEarmarkSpreadsheetFill} from "react-icons/bs";
import {RxHeartFilled} from "react-icons/rx";
import clsx from "clsx";

export function Footer({noMargin = false}:{noMargin?: boolean}) {
    return (
        <div className={clsx("w-full bg-transparent max-w-[1024px]", !noMargin && "mt-32 mb-12")}>
            <div className="max-w-6xl flex sm:flex-row flex-col gap-2 w-full items-end sm:items-center justify-between">
                <div className="text-sm text-default-400 font-medium">
                    <a target="_blank" className="hover:text-black transition-colors" href="https://www.sheetstodashboard.com/terms.html">Terms</a>{" "}&{" "}
                    <a target="_blank" className="hover:text-black transition-colors" href="https://www.sheetstodashboard.com/privacy.html">Privacy</a>
                </div>
                <div
                    className="flex flex-row flex-nowrap whitespace-nowrap items-center text-sm font-medium text-default-400 cursor-pointer hover:text-black transition-colors">
                    Made with <BsFillFileEarmarkSpreadsheetFill
                    className="text-sm text-green-700 ml-1.5 mr-1"/> SheetsToDashboard + <RxHeartFilled
                    className="text-sm ml-1 text-red-500"/>
                </div>
            </div>
        </div>
    );
}
