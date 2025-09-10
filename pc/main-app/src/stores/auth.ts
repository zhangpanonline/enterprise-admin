import { defineStore } from 'pinia'
const auth_key = `sb-${new URL(import.meta.env.VITE_SUPABASE_URL).hostname.split('.')[0]}-auth-token`
const initData = JSON.parse(localStorage.getItem(auth_key) || '{}')
export const useAuthStore = defineStore('auth', () => {
  const state = reactive({
    access_token: initData.access_token || '',
    token_type: initData.token_type || '',
    expires_in: initData.expires_in || 0,
    expires_at: initData.expires_at || 0,
    user: initData.user || {}
  })

  const clear = () => {
    state.access_token = '',
    state.token_type = '',
    state.expires_in = 0,
    state.expires_at = 0,
    state.user = {}
  }
  const setAuth = (o: any) => {
    state.access_token = o.access_token || '',
    state.token_type = o.token_type || '',
    state.expires_in = o.expires_in || 0,
    state.expires_at = o.expires_at || 0,
    state.user = o.user || {}
  }

  return {
    ...toRefs(state),
    clear,
    setAuth
  }
})


// {
//     "access_token": "eyJhbGciOiJIUzI1NiIsImtpZCI6IkZCM2p3VjFxVHdXME9DdysiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NtbWV4ZHltb2x6aXF4eXJ2Y3R3LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI1ZGViMTU2Yy0xMGE1LTQzNWUtOTkzNS0wMGY1MzgyMTkyNTMiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU3NDk0MDQ2LCJpYXQiOjE3NTc0OTA0NDYsImVtYWlsIjoiemhhbmdwYW4ub25saW5lQG91dGxvb2suY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6InpoYW5ncGFuLm9ubGluZUBvdXRsb29rLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjVkZWIxNTZjLTEwYTUtNDM1ZS05OTM1LTAwZjUzODIxOTI1MyJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzU3NDkwNDQ2fV0sInNlc3Npb25faWQiOiI0MmQzN2Y4Yy0yYmJlLTQ5ZGYtOWI4Ni04YzlhOTVlMGRjMjciLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.gwkU9AuBxj-upohP-6mDE03bbgy1JmY4VEbMbY7uqYA",
//     "token_type": "bearer",
//     "expires_in": 3600,
//     "expires_at": 1757494046,
//     "refresh_token": "dxfm74c2cbzz",
//     "user": {
//         "id": "5deb156c-10a5-435e-9935-00f538219253",
//         "aud": "authenticated",
//         "role": "authenticated",
//         "email": "zhangpan.online@outlook.com",
//         "email_confirmed_at": "2025-08-06T06:36:22.162774Z",
//         "phone": "",
//         "confirmed_at": "2025-08-06T06:36:22.162774Z",
//         "last_sign_in_at": "2025-09-10T07:47:26.309914969Z",
//         "app_metadata": {
//             "provider": "email",
//             "providers": [
//                 "email"
//             ]
//         },
//         "user_metadata": {
//             "email": "zhangpan.online@outlook.com",
//             "email_verified": true,
//             "phone_verified": false,
//             "sub": "5deb156c-10a5-435e-9935-00f538219253"
//         },
//         "identities": [
//             {
//                 "identity_id": "6ad4ae40-75d3-4750-9627-2df37a57a166",
//                 "id": "5deb156c-10a5-435e-9935-00f538219253",
//                 "user_id": "5deb156c-10a5-435e-9935-00f538219253",
//                 "identity_data": {
//                     "email": "zhangpan.online@outlook.com",
//                     "email_verified": false,
//                     "phone_verified": false,
//                     "sub": "5deb156c-10a5-435e-9935-00f538219253"
//                 },
//                 "provider": "email",
//                 "last_sign_in_at": "2025-08-06T06:36:22.159473Z",
//                 "created_at": "2025-08-06T06:36:22.15952Z",
//                 "updated_at": "2025-08-06T06:36:22.15952Z",
//                 "email": "zhangpan.online@outlook.com"
//             }
//         ],
//         "created_at": "2025-08-06T06:36:22.15149Z",
//         "updated_at": "2025-09-10T07:47:26.32269Z",
//         "is_anonymous": false
//     },
//     "weak_password": null
// }
