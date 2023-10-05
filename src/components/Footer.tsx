import {BsFillFileEarmarkSpreadsheetFill} from "react-icons/bs";
import {RxHeartFilled} from "react-icons/rx";
import {A} from "kea-router";
import {urls} from "../utils/routes";

export function Footer() {
    return (
        <div className="w-full bg-white flex flex-col justify-center items-center mt-32 mb-12 max-w-[1024px]">
            <div className="max-w-6xl flex flex-row w-full items-center justify-between">
                <A href={urls.terms_and_privacy()} className="text-sm text-default-400">Terms & Privacy</A>
                <div
                    className="flex flex-row items-center text-sm font-medium text-default-400 cursor-pointer hover:text-black transition-colors">
                    Made with <BsFillFileEarmarkSpreadsheetFill
                    className="text-sm text-green-700 ml-1.5 mr-1"/> SheetsToDashboard + <RxHeartFilled
                    className="text-sm ml-1 text-red-500"/>
                </div>
            </div>
        </div>
    );
}
