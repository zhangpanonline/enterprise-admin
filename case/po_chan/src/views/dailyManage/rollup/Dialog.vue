<!--  -->
<template>
  <div>
    <el-dialog      v-model="visible"  :close-on-click-modal="false" :close-on-press-escape="false" title="预览" width='900'
      top="10vh">
      <div style="border: 1px solid #ccc;">

    <WangEditor :toolbarConfig="toolbarConfig" :editorConfig="editorConfig" v-model="html" :mode="mode"  style="border: 1px solid #dcdfe6;"/>
      </div>
      <div class="dialog-footer text-right" style="margin-top: 15px">
        <el-button size="small" @click="visible = false">关 闭</el-button>
        <el-button size="small" type="primary" @click="onSave()">下 载</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: '',

  props: {
    files: {
      type: Array,
      default: () => [],
    },
    str: {
      type: String,
      default: '',
    },
  },
  computed: {

  },
  watch: {
    str(newVal, old) {
      this.html = this.str
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
      editor: null,
      toolbarConfig: {
        excludeKeys: ['uploadImage', 'uploadVideo', 'emotion', 'insertImage', 'group-image', 'editImage', 'insertLink', 'insertVideo', 'insertTable', 'group-video', 'codeBlock', 'todo', 'color', 'bgColor', 'fontFamily', 'lineHeight', 'numberedList', 'group-more-style', 'bulletedList', 'divider', 'group-justify', 'blockquote'],
      },
      editorConfig: {},
      mode: 'default',
      html: this.str,
    }
  },

  methods: {
    onSave() {
      this.$emit('ok', this.html)
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },

  },

}

</script>
<style coped>
.el-dialog__body{
  max-height: 60vh;
  overflow: auto;
}
</style>
