const requiredFieldsCheck = (fieldValueList) => {
    for(const fieldValue of fieldValueList){
        if(!fieldValue) return false
    }
    return true
}