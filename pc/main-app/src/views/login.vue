<template>
  <div class="w-screen h-screen flex justify-center items-center bg-radial from-gray-100 to-gray-500" >
    <div class="w-full max-w-md p-4 rounded-md shadow-2xl sm:p-8 bg-radial from-indigo-100 to-indigo-200 text-gray-800">
      <h2 class="mb-3 text-3xl font-semibold text-center">登录</h2>
      <p class="text-sm text-center text-gray-600">
        没有账号？
        <a href="#" rel="noopener noreferrer" class="underline"
          >点击注册</a
        >
      </p>
      <div class="my-6 grid grid-cols-2 gap-2.5">
        <button
          aria-label="Google"
          type="button"
          class=" grid grid-cols-2 relative cursor-pointer z-0 items-center w-full p-4 space-x-4 border rounded-md focus:ring-2 focus:ring-offset-1 border-gray-600 focus:ring-[#EA4335]
            before:absolute before:inset-0 before:bg-linear-90 before:from-[#EA4335] before:via-[#EA4335/80] before:via-95% before:-z-1 before:scale-x-0 hover:before:scale-x-100 focus:before:scale-x-100
            before:transition-transform before:origin-left before:ease before:rounded-md
          "
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current mx-auto">
            <path
              d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"
            ></path>
          </svg>
          <p class="text-left" >Google</p>
        </button>
        <button
          aria-label="GitHub"
          role="button"
          class="relative z-0 cursor-pointer items-center grid grid-cols-2 w-full p-4 space-x-4 border rounded-md focus:ring-2 focus:ring-offset-1 border-gray-600 focus:ring-[#6e7681]
            before:absolute before:inset-0 before:bg-linear-90 before:from-[#6e7681] before:via-[#6e7681/80] before:via-95% before:-z-1 before:scale-x-0 hover:before:scale-x-100 focus:before:scale-x-100
            before:transition-transform before:origin-left before:ease before:rounded-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current mx-auto">
            <path
              d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z"
            ></path>
          </svg>
          <p class="text-left">GitHub</p>
        </button>
        <button
          aria-label="QQ"
          role="button"
          class="relative z-0 cursor-pointer items-center grid grid-cols-2 w-full p-4 border rounded-md focus:ring-2 focus:ring-offset-1 border-gray-600 focus:ring-[#1DA1F2]
          before:absolute before:inset-0 before:bg-linear-90 before:from-[#1DA1F2] before:via-[#1DA1F2/80] before:via-95% before:-z-1 before:scale-x-0 hover:before:scale-x-100 focus:before:scale-x-100
            before:transition-transform before:origin-left before:ease before:rounded-md"
        >
          <svg t="1757501507117" class="icon mx-auto" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12185" width="24" height="24"><path d="M511.87892 0C298.937289 0 104.4233 137.183551 30.712735 335.792572-42.997829 538.496624 20.475157 769.865896 186.323927 907.049447c165.84877 137.183551 405.408105 155.611192 589.684516 45.045345 184.276411-110.565847 280.509648-329.650025 239.559335-540.54414C972.569948 202.704052 800.578631 38.902798 591.732032 6.142547 565.114328 2.047516 538.496624 0 511.87892 0zM870.194164 647.014955c0 20.475157-2.047516 49.140376-18.427641 63.472986-14.33261 14.33261-26.617704-2.047516-34.807767-14.33261-2.047516-4.095031-14.33261-28.66522-16.380125-28.66522-6.142547 0-12.285094 24.570188-12.285094 28.66522-10.237578 24.570188-24.570188 45.045345-42.997829 63.472986 18.427641 18.427641 81.900627 30.712735 65.520502 69.615533-14.33261 34.807767-71.663049 40.950314-102.375784 42.997829-40.950314 2.047516-85.995659-2.047516-124.898457-14.33261-20.475157-6.142547-36.855282-12.285094-59.377955-12.285094-18.427641-2.047516-36.855282 16.380125-55.282923 22.522672-40.950314 14.33261-90.09069 12.285094-131.041004 8.190063-28.66522-4.095031-88.043174-10.237578-94.185721-47.092861-2.047516-12.285094 2.047516-30.712735 10.237578-40.950314 6.142547-6.142547 12.285094-10.237578 20.475157-12.285094 8.190063-2.047516 22.522672-2.047516 28.66522-6.142547 6.142547-4.095031-4.095031-8.190063-8.190063-12.285094-8.190063-6.142547-16.380125-14.33261-22.522672-20.475157-14.33261-16.380125-24.570188-32.760251-30.712735-51.187892-2.047516-4.095031-6.142547-24.570188-8.190063-24.570188-4.095031-2.047516-4.095031 6.142547-6.142547 8.190063-8.190063 16.380125-22.522672 34.807767-40.950314 40.950314-20.475157 8.190063-22.522672-12.285094-24.570188-28.66522-2.047516-20.475157-2.047516-42.997829 4.095031-63.472986 10.237578-40.950314 32.760251-77.805596 61.42547-108.518331 8.190063-8.190063 16.380125-16.380125 26.617704-24.570188 10.237578-8.190063 8.190063-6.142547 8.190063-18.427641-2.047516-22.522672-6.142547-30.712735 4.095031-53.235408 4.095031-8.190063 16.380125-20.475157 18.427641-28.66522 4.095031-10.237578 4.095031-18.427641 6.142547-28.66522 2.047516-20.475157 10.237578-40.950314 18.427641-59.377955 18.427641-38.902798 47.092861-75.75808 79.853112-102.375784 67.568017-53.235408 171.991317-55.282923 249.796913-28.66522 88.043174 28.66522 139.231066 104.4233 151.51616 194.51399 2.047516 8.190063 2.047516 18.427641 4.095031 26.617704 4.095031 10.237578 12.285094 18.427641 14.33261 26.617704 8.190063 20.475157 6.142547 36.855282 2.047516 57.330439-4.095031 16.380125 18.427641 38.902798 26.617704 53.235408 10.237578 20.475157 20.475157 40.950314 28.66522 61.42547C864.051617 604.017126 870.194164 626.539798 870.194164 647.014955z" fill="#272636" p-id="12186"></path></svg>
          <p class="text-left" >QQ</p>
        </button>
        <button
          aria-label="WeChat"
          role="button"
          class="relative z-0 cursor-pointer items-center grid grid-cols-2 w-full p-4 space-x-4 border rounded-md focus:ring-2 focus:ring-offset-1 border-gray-600 focus:ring-[#07C160]
          before:absolute before:inset-0 before:bg-linear-90 before:from-[#07C160] before:via-[#07C160/80] before:via-95% before:-z-1 before:scale-x-0 hover:before:scale-x-100 focus:before:scale-x-100
            before:transition-transform before:origin-left before:ease before:rounded-md"
        >
            <svg t="1757501193588" class="icon mx-auto" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9473" width="24" height="24"><path d="M337.387283 341.82659c-17.757225 0-35.514451 11.83815-35.514451 29.595375s17.757225 29.595376 35.514451 29.595376 29.595376-11.83815 29.595376-29.595376c0-18.49711-11.83815-29.595376-29.595376-29.595375zM577.849711 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763zM501.641618 401.017341c17.757225 0 29.595376-12.578035 29.595376-29.595376 0-17.757225-11.83815-29.595376-29.595376-29.595375s-35.514451 11.83815-35.51445 29.595375 17.757225 29.595376 35.51445 29.595376zM706.589595 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763z" fill="#2c2c2c" p-id="9474"></path><path d="M510.520231 2.959538C228.624277 2.959538 0 231.583815 0 513.479769s228.624277 510.520231 510.520231 510.520231 510.520231-228.624277 510.520231-510.520231-228.624277-510.520231-510.520231-510.520231zM413.595376 644.439306c-29.595376 0-53.271676-5.919075-81.387284-12.578034l-81.387283 41.433526 22.936416-71.768786c-58.450867-41.433526-93.965318-95.445087-93.965317-159.815029 0-113.202312 105.803468-201.988439 233.803468-201.98844 114.682081 0 216.046243 71.028902 236.023121 166.473989-7.398844-0.739884-14.797688-1.479769-22.196532-1.479769-110.982659 1.479769-198.289017 85.086705-198.289017 188.67052 0 17.017341 2.959538 33.294798 7.398844 49.572255-7.398844 0.739884-15.537572 1.479769-22.936416 1.479768z m346.265896 82.867052l17.757225 59.190752-63.630058-35.514451c-22.936416 5.919075-46.612717 11.83815-70.289017 11.83815-111.722543 0-199.768786-76.947977-199.768786-172.393063-0.739884-94.705202 87.306358-171.653179 198.289017-171.65318 105.803468 0 199.028902 77.687861 199.028902 172.393064 0 53.271676-34.774566 100.624277-81.387283 136.138728z" fill="#2c2c2c" p-id="9475"></path></svg>
          <p class="text-left" >WeChat</p>
        </button>
        <button
          aria-label="Alipay"
          role="button"
          class="relative z-0 cursor-pointer items-center grid grid-cols-2 w-full p-4 space-x-4 border rounded-md focus:ring-2 focus:ring-offset-1 border-gray-600 focus:ring-[#1677FF]
          before:absolute before:inset-0 before:bg-linear-90 before:from-[#1677FF] before:via-[#1677FF/80] before:via-95% before:-z-1 before:scale-x-0 hover:before:scale-x-100 focus:before:scale-x-100
            before:transition-transform before:origin-left before:ease before:rounded-md"
        >
          <svg t="1757501104317" class="icon mx-auto" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5105" width="24" height="24"><path d="M230.771014 576.556522c-12.614493 9.646377-25.228986 23.744928-28.93913 42.295652-5.194203 24.486957-0.742029 55.652174 22.26087 80.13913 28.93913 28.93913 72.718841 37.101449 92.011594 38.585508 51.2 3.710145 106.110145-22.26087 147.663768-50.457971 16.324638-11.130435 43.77971-34.133333 70.492754-69.750725-59.362319-30.423188-133.565217-64.556522-212.22029-61.588406-41.553623 1.484058-70.492754 9.646377-91.269566 20.776812zM983.188406 712.347826c25.971014-61.588406 40.811594-129.113043 40.811594-200.347826 0-281.971014-230.028986-512-512-512S0 230.028986 0 512s230.028986 512 512 512c170.666667 0 321.298551-83.849275 414.794203-212.22029C838.492754 768.742029 693.797101 696.023188 604.011594 652.985507c-42.295652 48.973913-105.368116 97.205797-176.602898 117.982609-44.521739 13.356522-85.333333 18.550725-126.886957 9.646377-42.295652-8.904348-72.718841-28.197101-90.527536-47.489855-8.904348-10.388406-19.292754-22.26087-27.455073-37.843479 0.742029 0.742029 0.742029 2.226087 0.742029 2.968116 0 0-4.452174-7.42029-7.420289-19.292753-1.484058-5.936232-2.968116-11.872464-3.710145-17.808696-0.742029-4.452174-0.742029-8.904348 0-12.614493-0.742029-7.42029 0-15.582609 1.484058-23.744927 4.452174-20.776812 12.614493-43.77971 35.617391-65.298551 48.973913-48.231884 115.014493-50.457971 149.147826-50.457971 50.457971 0.742029 138.017391 22.26087 212.22029 48.973913 20.776812-43.77971 34.133333-89.785507 42.295652-121.692754H304.973913v-33.391304h158.052174v-66.782609H272.324638v-34.133333h190.701449v-66.782609c0-8.904348 2.226087-16.324638 16.324638-16.324637h74.944927v83.107246h207.026087v33.391304H554.295652v66.782609H719.768116S702.701449 494.933333 651.501449 586.202899c115.014493 40.811594 277.518841 104.626087 331.686957 126.144927z m0 0" fill="#2c2c2c" p-id="5106"></path></svg>
          <p class="text-left" >Alipay</p>
        </button>
      </div>
      <div class="flex items-center w-full my-4">
        <hr class="w-full text-gray-600" />
        <p class="px-3 text-gray-600">OR</p>
        <hr class="w-full text-gray-600" />
      </div>
      <form action="" class="space-y-8">
        <div class="space-y-4">
          <div class="space-y-2">
            <label for="email" class="block text-sm">邮件地址</label>
            <input
              type="email"
              name="email"
              id="email"
              v-model="form.email"
              class="w-full px-3 py-2 border rounded-md "
            />
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <label for="password" class="text-sm">密码</label>
              <a
                rel="noopener noreferrer"
                href="#"
                class="text-xs hover:underline text-gray-600"
                >忘记密码?</a
              >
            </div>
            <input
              type="password"
              name="password"
              id="password"
              v-model="form.password"
              class="w-full px-3 py-2 border rounded-md "
            />
          </div>
        </div>
        <button
          type="button"
          class="w-full cursor-pointer px-8 py-3 font-semibold rounded-md bg-violet-600 text-gray-50 flex justify-center gap-5 items-center"
          @click="showHcaptcha = true"
        >
          <span>登 录</span>
          <div v-if="loading" class="w-4 h-4 border-1 border-dashed rounded-full animate-spin dark:border-violet-600"></div>
        </button>
      </form>
    </div>
    <vue-hcaptcha v-if="showHcaptcha" class="absolute bg-gray-500/60 flex justify-center items-center inset-0" sitekey="4b6293e2-0baa-4570-b038-c712d5ae0d14" @verify="handleLoginByEmail"></vue-hcaptcha>
  </div>
</template>


<script setup lang="ts">
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'
import { loginByEmailApi } from '@/api'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const showHcaptcha = ref(false)
const form = reactive({
    email: 'zhangpan.online@outlook.com',
    password: '12345678',
})
const handleLoginByEmail = async (captchaToken: string) => {
    loading.value = true
    const { error } = await loginByEmailApi({ ...form, captchaToken })
    loading.value = false
    if (error && error.message) {
        window.alert(error.message)
    } else {
        const auth_key = `sb-${new URL(import.meta.env.VITE_SUPABASE_URL).hostname.split('.')[0]}-auth-token`
        const auth_data = JSON.parse(localStorage.getItem(auth_key) || '{}')
        authStore.setAuth(auth_data)
        router.push('/')
    }
}
</script>
