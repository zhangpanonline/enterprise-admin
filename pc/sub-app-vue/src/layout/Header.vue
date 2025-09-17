<template>
  <div class="flex items-center px-5">
    <div class="ml-auto">
      <el-dropdown>
        <div class="flex items-center cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="size-4"
          >
            <path
              d="M7.75 2.75a.75.75 0 0 0-1.5 0v1.258a32.987 32.987 0 0 0-3.599.278.75.75 0 1 0 .198 1.487A31.545 31.545 0 0 1 8.7 5.545 19.381 19.381 0 0 1 7 9.56a19.418 19.418 0 0 1-1.002-2.05.75.75 0 0 0-1.384.577 20.935 20.935 0 0 0 1.492 2.91 19.613 19.613 0 0 1-3.828 4.154.75.75 0 1 0 .945 1.164A21.116 21.116 0 0 0 7 12.331c.095.132.192.262.29.391a.75.75 0 0 0 1.194-.91c-.204-.266-.4-.538-.59-.815a20.888 20.888 0 0 0 2.333-5.332c.31.031.618.068.924.108a.75.75 0 0 0 .198-1.487 32.832 32.832 0 0 0-3.599-.278V2.75Z"
            />
            <path
              fill-rule="evenodd"
              d="M13 8a.75.75 0 0 1 .671.415l4.25 8.5a.75.75 0 1 1-1.342.67L15.787 16h-5.573l-.793 1.585a.75.75 0 1 1-1.342-.67l4.25-8.5A.75.75 0 0 1 13 8Zm2.037 6.5L13 10.427 10.964 14.5h4.073Z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{{ language }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <p
                @click="switchLanguage('zh')"
                class="hover:bg-gray-200 px-2.5 py-1 rounded-md cursor-pointer text-center items-center flex gap-2"
                :class="{ 'bg-gray-200': language === 'zh' }"
              >
                <span
                  class="w-1.5 h-0 bg-black rounded-full"
                  :class="{ 'h-1.5': language === 'zh' }"
                ></span>
                <span>简体中文</span>
              </p>
            </el-dropdown-item>
            <el-dropdown-item>
              <p
                @click="switchLanguage('en')"
                class="hover:bg-gray-200 px-2.5 py-1 rounded-md cursor-pointer text-center items-center flex gap-2"
                :class="{ 'bg-gray-200': language === 'en' }"
              >
                <span
                  class="w-1.5 h-0 bg-black rounded-full"
                  :class="{ 'h-1.5': language === 'en' }"
                ></span>
                <span>English</span>
              </p>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { locale: language } = useI18n()

const switchLanguage = (local: 'zh' | 'en') => {
  language.value = local
}
</script>
