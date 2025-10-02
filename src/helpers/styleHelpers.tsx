import type { RoleEntryRead } from "src/types/interfaces";

export function isLoggedInUserOperator(apc_op_id:string | undefined, logged_in_user_op_id: string | undefined) {
    if(apc_op_id === null || logged_in_user_op_id === null || apc_op_id === undefined || logged_in_user_op_id === undefined) {
        return true;
    } else if(apc_op_id === logged_in_user_op_id) {
        return true;
    } else if (apc_op_id !== logged_in_user_op_id) {
        return false;
    } else {
        return true;
    }
};

export function activeTab(tabList: any[], selected: number | null) {
    if (!selected) {
        const selectedTabId = tabList.find((tab) => tab.current === true)?.id;
        const updatedTabs = tabList.map((tab) => ({
            ...tab,
            current: tab.id === selectedTabId,
        }));
        return { updatedTabs, selectedTabId };
    } else {
        const selectedTabId = selected;
        const updatedTabs = tabList.map((tab) => ({
            ...tab,
            current: tab.id === selectedTabId,
        }));
        return { updatedTabs, selectedTabId };
    }

};

export function formatDate(date: Date | null | string) {
    if (date === null) {
        return '';
    } else if(typeof(date) === 'string' && date.length<=10){
        const dateFormatted = new Date(date).toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        return dateFormatted;
    } else {
        const dateFormatted = new Date(date).toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
        return dateFormatted;
    }
};

export function doesLoggedInUserHaveCorrectRole(roles: RoleEntryRead[], roleVal: number, apc_id: string) {
    console.log(roles,'THE ROLES', roleVal,'THE ROLE VAL', apc_id,'THE ID')
    const rolemapfilter = roles.filter(role => (role.role === roleVal && role.active === true && role.apc_id === apc_id));
    const isChecked = rolemapfilter.length===1 ? true : false;

    return isChecked;
}