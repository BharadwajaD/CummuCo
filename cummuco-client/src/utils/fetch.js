import { getAuth } from "./auth"

export async function getFetch(url, isAuth = true){
    let token = ''
    if(isAuth){
        token = getAuth()
    }

    const res = await fetch(url, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          },
      })

    if(!res.ok){
        throw new Error('error occured')
    }
    return res.json()

}

export async function postFetch(url, body, isAuth = true){
    let token = ''
    if(isAuth){
        token = getAuth()
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

    if(!res.ok){
        throw new Error('error occured')
    }
    return res.json()
}
