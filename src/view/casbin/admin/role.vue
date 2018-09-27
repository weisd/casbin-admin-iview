<template>
  <Card>
    <p slot="title">编辑用户角色</p>
    <Form  ref="formValidate"  :label-width="80" >
        <FormItem  label="权限" prop="permisionlist" :error="Err">
          <Transfer
              :titles="['角色列表','已选角色']"
              :data="srcData"
              :target-keys="rolelist"
              :render-format="renderItem"
              :operations="['删除','添加']"
              filterable
              @on-change="handleChange">
              <div :style="{float: 'right', margin: '5px'}">
                  <Button size="small" @click="reloadData">Refresh</Button>
              </div>
          </Transfer>
        </FormItem>

        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>

            <a href="javascript:history.go(-1)"><Button  style="margin-left: 8px">返回</Button></a>
        </FormItem>
    </Form>
  </Card>
</template>

<script>
import { mapActions } from 'vuex'
import { postRoleUserAdd, getUserRolesByUID } from '@/api/casbin'
export default {
  data () {
    return {
      uid: 0,
      Err: '',
      rolelist: []
    }
  },
  computed: {
    srcData () {
      const rolelist = this.$store.state.casbin.rolelist
      let list = []
      for (let i = 0; i < rolelist.length; i++) {
        const e = rolelist[i]
        list.push({key: e.role, label: e.role, disabled: false})
      }
      console.log(list)
      return list
    }
    // targetkeys(){

    // }
  },
  methods: {
    ...mapActions(['getRoleList', 'getRoleUsers']),
    reloadData (o) {
      this.rolelist = []
    },
    handleChange (targets) {
      this.Err = ''
      this.rolelist.push(...targets)
    },
    renderItem (item) {
      return item.label
    },
    handleSubmit (name) {
      if (this.rolelist.length === 0) {
        this.Err = '请选择角色'
        return
      }

      this.handleCreate()
    },
    handleCreate () {
      let data = {uid: this.uid, role: this.rolelist.join(',')}

      postRoleUserAdd(data).then(res => {
        console.log(res)
        this.$Message.success('更新成功')
      }).catch(err => {
        err.response && this.$Message.error({
          content: err.response.data.message,
          duration: 10,
          closable: true
        })
      })
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.uid = this.$route.query.id
      getUserRolesByUID({uid: this.uid}).then(res => {
        console.log('getUserRolesByUID', res)
        if (res.data) {
          this.rolelist = res.data
        }
      }).catch(err => {
        err.response && this.$Message.error({
          content: err.response.data.message,
          duration: 10,
          closable: true
        })
      })
    }
    this.getRoleList()
  }

}
</script>

<style lang="css" scoped>

</style>
