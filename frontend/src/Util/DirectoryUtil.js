export const findDir = (dirHierarcy, id) => {
    if(dirHierarcy._id == id){
        return dirHierarcy
    }else{
        const length = dirHierarcy.subDirs.length
        let x
        for(let i = 0; i < length; i++){
            x = findDir(dirHierarcy.subDirs[i], id)
            if(x) return x
        }
        return null
    }
}