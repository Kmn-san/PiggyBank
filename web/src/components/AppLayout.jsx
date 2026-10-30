import { Outlet } from 'react-router-dom';
import DashbaordHeader from './Dashbaord/DashbaordHeader';
import TabBar from './TabBar';
import { FONT_JP } from '../lib/utlis';

const AppLayout = () => (
    <div
        className="min-h-screen bg-[#F5F6F4] text-[#12202F] pb-[calc(4rem+env(safe-area-inset-bottom))]"
        style={{ fontFamily: FONT_JP }}
    >
        <DashbaordHeader />
        <Outlet />
        <TabBar />
    </div>
);

export default AppLayout;