const userOrder = ["owner-only", "admins-only", "members-only"]
export const authorizationIndex = function(position){
    const index = userOrder.findIndex(p => p === position)
    return index
}

export const isAuthorized = function(userPermissionLevel, actionPermissionLevel){
    return authorizationIndex(userPermissionLevel) <= authorizationIndex(actionPermissionLevel)
}