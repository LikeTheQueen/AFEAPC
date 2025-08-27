import type { UUID } from "crypto";
import type { AddressType, OperatorType } from "src/types/interfaces";

export function disableCreateButton(operator: OperatorType, operatorAddress: AddressType) {
    if(!operator && !operatorAddress) {
        return true;
    } else if(operator && !operatorAddress) {
        return true;
    } else if(operator && operatorAddress) {
        if(operatorAddress.street !=='' && 
            operatorAddress.state !=='' && 
            operatorAddress.city !=='' && 
            operatorAddress.zip !=='' && 
            operatorAddress.country !=='' && 
            operator.source_system !==0 && 
            operator.name !=='' && (operator.id === null || operator.id === undefined)) {
                return false;
        } else {
            return true;
        }
    } else {
        return true;
    }

}

export function disableSaveAndSaveAnother(opPartnerID: string | undefined, operatorPartnerAddress: AddressType) {
    if(!opPartnerID && !operatorPartnerAddress) {
        return true;
    } else if(opPartnerID && !operatorPartnerAddress) {
        return true;
    } else if(!opPartnerID && operatorPartnerAddress) {
        
        return true;
    } else if(opPartnerID && operatorPartnerAddress) {
        
        if(operatorPartnerAddress.street !=='' && 
            operatorPartnerAddress.state !=='' && 
            operatorPartnerAddress.city !=='' && 
            operatorPartnerAddress.zip !=='' && 
            operatorPartnerAddress.country !=='' 

        ) { 
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}

export function isAddressListHidden(addressList : AddressType[]) {
    if(addressList !== null && addressList.length>0) {
        return false;
    } else {
        return true;
    }
}