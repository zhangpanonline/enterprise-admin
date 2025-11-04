import { defineStore } from 'pinia';
import { User } from '@/sub-pages/apis/user';

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('');
    const user = ref<User>(null);

    function setToken(val) {
      token.value = val;
    }

    function setUser(val) {
      user.value = val;
    }

    function clearUser() {
      token.value = '';
      user.value = null;
    }

    return {
      token,
      user,
      setToken,
      setUser,
      clearUser,
    };
  },
  {
    // unistorage: true,
    // 缓存指定参数
    unistorage: {
      key: 'user', // 缓存key, 默认当前模块
      paths: ['token', 'user'],
    },
  },
);
