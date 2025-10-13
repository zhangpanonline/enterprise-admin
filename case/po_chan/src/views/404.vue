<template>
  <div class="flex h-screen">
    <div class="w-2/5 p-20 bg-cover bg-[url('/src/assets/images/loginBg.png')] flex flex-col justify-between">
      <div class="flex">
        <img src="/src/assets/images/banklog.png" alt="">
        <img class="ml-3" src="/src/assets/images/banklog1.png" alt="">
      </div>
      <div class="text-white ">
        <div class="text-xl	leading-12"></div>
        <div class="mt-6"></div>
      </div>
    </div>
    <div class="w-3/5 flex flex-col	justify-center items-center" >
      <img src="/src/assets/images/404.svg" class="animate-bounce w-1/5"/>
      <p class="mt-4 text-3xl leading-tight cursor-pointer underline text-black-350 hover:text-black-450" @click="$router.push('/')">
        页面不存在！点击这里返回首页。
      </p>
    </div>
  </div>
</template>
