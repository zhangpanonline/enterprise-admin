import { useAuthStore } from "@/app/store/auth";
import { loginOutApi } from "../api/auth.api";

export function useLoginOut() {
  const loading = ref(false);
  const router = useRouter();
  const authStore = useAuthStore();

  const loginOut = async () => {
    try {
      loading.value = true;
      const res = await loginOutApi();
      if (res.status === 204) {
        authStore.$reset();
        router.push({ path: "/login" });
        ElMessage.success("退出登录成功");
      }
    } catch (e: any) {
      ElMessage.error(e.message || "登录失败");
    } finally {
      loading.value = false;
    }
  };

  return {
    loginOut,
    loading,
  };
}
