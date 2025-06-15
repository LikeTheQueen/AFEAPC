
export function setStatusTextColor(partner_status: string | null | undefined) {
    if (partner_status === null || partner_status === undefined || partner_status === 'empty') {
        return 'white';
    } else if (partner_status === 'New') {
        return '[var(--darkest-teal)]';
    } else if (partner_status === 'Viewed') {
        return '[var(--dark-teal)]';
    } else if (partner_status === 'Approved') {
        return 'white';
    } else if (partner_status === 'Rejected') {
        return 'white';
    } else {
        return 'white';
    }

}

export function setStatusBackgroundColor(partner_status: string | null | undefined) {
    if (partner_status === null || partner_status === undefined || partner_status === 'empty') {
        return 'white';
    } else if (partner_status === 'New') {
        return 'white';
    } else if (partner_status === 'Viewed') {
        return '[var(--dark-teal)]/30';
    } else if (partner_status === 'Approved') {
        return '[var(--bright-pink)]';
    } else if (partner_status === 'Rejected') {
        return 'red-900';
    } else {
        return 'white';
    }
}

export function setStatusRingColor(partner_status: string | null | undefined) {
    if (partner_status === null || partner_status === undefined || partner_status === 'empty') {
        return 'white';
    } else if (partner_status === 'New') {
        return '[var(--darkest-teal)]';
    } else if (partner_status === 'Viewed') {
        return '[var(--darkest-teal)]/20';
    } else if (partner_status === 'Approved') {
        return '[var(--bright-pink)]/20';
    } else if (partner_status === 'Rejected') {
        return 'red-900';
    } else {
        return 'white';
    }

}

export function setIsHidden<AFEType>(afes: AFEType[] | undefined): boolean {
    if (afes !== undefined && afes.length > 0) {
        return false;
    } else {
        return true;
    }
}
;
