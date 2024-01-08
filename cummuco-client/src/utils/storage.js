const storage = sessionStorage

export function setValue(key='token', value){
    storage.setItem(key, value)
}

export function getValue(key='token'){
    return storage.getItem(key)
}

