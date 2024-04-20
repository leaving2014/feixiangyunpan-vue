<template>
  <div class="clear-main">
    <FileTable :file-list="fileList" usePage="tools"></FileTable>
  </div>
</template>

<script>
import { getClearFile } from '@/request/file'
import FileTable from '@/components/file/FileTable'

export default {
  name: 'Clear',
  props: {},
  components: {
    FileTable
  },
  data () {
    return {
      fileList: []
    }
  },
  watch: {
    'this.$router.path' (val) {
      if (val === '/clear') {

      }
    }
  },
  computed: {},
  created () {
    this.getClearFileList()
  },
  mounted () {
  },
  methods: {
    getClearFileList () {
      getClearFile({
        fileSize: 10
      }).then(res => {
        if (res.code === 0) {
          this.fileList = res.data.list
        } else {
          this.$toast.error(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
