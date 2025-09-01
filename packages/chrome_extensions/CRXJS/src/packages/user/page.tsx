import { useState, useEffect } from 'react'
import { supabase } from '@/supabase'

export default function User() {
    const [token, setToken] = useState('')
    const [refreshToken, setRefreshToken] = useState('')
    chrome.storage.local.get(['access_token', 'refresh_token'], (res) => {
        // setToken(res)
        console.log(res)
        setToken(res.access_token)
        setRefreshToken(res.refresh_token)
    })

    useEffect(() => {
        supabase.auth.setSession({
            access_token: token,
            refresh_token: refreshToken
        }).then(res => {
            console.log(res, '1111111111111')
        })
        supabase.auth.getSession().then((res) => {
            console.log(res, '#######')
        })
    }, [])

  return <>
    <h1>User</h1>
  </>
}