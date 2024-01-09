import { getValue, setValue } from "./storage"

export async function getFetch(url, isAuth = true){
    let token = ''
    if(isAuth){
        token = getValue()
    }

    const res = await fetch(url, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          },
      })

    console.log(res.status)
    if(res.status == 403){
        throw new Error('forbidden')
    }else if(!res.ok){
        throw new Error('error occured')
    }

    const body = await res.json()
    if(body.token){
        setValue('token', body.token)
    }

    return body

}

export async function postFetch(url, body, isAuth = true){
    let token = ''
    if(isAuth){
        token = getValue()
    }

    const req = {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(body),
      }

    const res = await fetch(url, req)

    //console.log(req, res)

    console.log(res.status)
    if(res.status == 403){
        throw new Error('forbidden')
    }else if(!res.ok){
        throw new Error('error occured')
    }

    const res_body = await res.json()
    if(body.token){
        setValue('token', body.token)
    }

    return res_body
}
