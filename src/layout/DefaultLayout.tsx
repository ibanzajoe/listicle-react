import { Outlet } from "react-router-dom";
import { SideMenu } from "./SideMenu";
import { ErrorBoundary } from "../components/ErrorBoundary";

export default function DefaultLayout() {

    return (
        <ErrorBoundary>
            <div className="w-full flex">
                <SideMenu />
                {/* The <Outlet> renders the matched child route's element */}
                <Outlet />
            </div>
        </ErrorBoundary>
    )
}