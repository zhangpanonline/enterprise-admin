<script setup>
const appStore = useAppStore()
const router = useRouter()
router.push(appStore.menus[0]?.url || '/caseHome')
</script>
