const storage = localStorage

export function storeAuth(key='token', value){
    storage.setItem(key, value)
}

export function getAuth(key='token'){
    return storage.getItem(key)
}

