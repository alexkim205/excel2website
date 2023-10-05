import {BsFillFileEarmarkSpreadsheetFill} from "react-icons/bs";
import {RxHeartFilled} from "react-icons/rx";

export function Footer() {
    return (
        <div className="w-full bg-white flex flex-col justify-center items-center mt-32 mb-12 max-w-[1024px]">
            <div className="max-w-6xl flex flex-row w-full items-center justify-between">
                <div className="text-sm text-default-400 font-medium">
                    <a target="_blank" className="hover:text-black transition-colors" href="https://www.sheetstodashboard.com/terms.html">Terms</a>{" "}&{" "}
                    <a target="_blank" className="hover:text-black transition-colors" href="https://www.sheetstodashboard.com/privacy.html">Privacy</a>
                </div>
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
