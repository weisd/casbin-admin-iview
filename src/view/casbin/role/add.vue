<template>
  <Card>
    <p slot="title">编辑角色权限</p>
    <Form  ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" >
        <FormItem label="Name" prop="role">
            <Input v-model="formValidate.role" placeholder=""></Input>
        </FormItem>
        <FormItem  label="权限" prop="permisionlist" :error="permissionListErr">
          <Transfer
              :titles="['权限列表','已选权限']"
              :data="srcData"
              :target-keys="formValidate.permisionlist"
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
import { getRolePermissionList, postRolePermissionAdd } from '@/api/casbin'
export default {
  data () {
    return {
      permissionListErr: '',
      formValidate: {
        role: '',
        permisionlist: []
      },
      ruleValidate: {
        role: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          },
          { type: 'string', min: 3, max: 10, message: '请输入3~10个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    srcData () {
      const permissionList = this.$store.state.casbin.permissionlist
      let list = []
      for (let i = 0; i < permissionList.length; i++) {
        const e = permissionList[i]
        list.push({key: e.name, label: e.name, description: e.origin + ':' + e.path + ':' + e.method, disabled: false})
      }
      return list
    }
    // targetkeys(){

    // }
  },
  methods: {
    ...mapActions(['getPermissionList']),
    reloadData (o) {
      this.formValidate.permisionlist = []
    },
    handleChange (targets) {
      this.permissionListErr = ''
      this.formValidate.permisionlist.push(...targets)
    },
    renderItem (item) {
      return item.label + ':' + item.description
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (this.formValidate.permisionlist.length === 0) {
          this.permissionListErr = '请选择角色对应权限'
          return
        }
        if (valid) {
          this.handleCreate()
        }
      })
    },
    handleCreate () {
      console.log(this.formValidate)

      let data = {role: this.formValidate.role, permission: this.formValidate.permisionlist.join(',')}

      postRolePermissionAdd(data).then(res => {
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
    this.getPermissionList()

    if (this.$route.query.role) {
      this.formValidate.role = this.$route.query.role
      getRolePermissionList({role: this.$route.query.role}).then(res => {
        console.log(res)
        let list = []
        for (let i = 0; i < res.data.length; i++) {
          const element = res.data[i]
          list.push(element.name)
        }

        this.formValidate.permisionlist = list
      }).catch(err => {
        err.response && this.$Message.error({
          content: err.response.data.message,
          duration: 10,
          closable: true
        })
      })
    }
  }

}
</script>

<style lang="css" scoped>

</style>
