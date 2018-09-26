<template>
  <Card>
    <p slot="title">{{ isCreateForm ? '添加' : '编辑' }}权限</p>
    <Form  ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" >
        <FormItem label="Name" prop="name">
            <Input v-model="formValidate.name" placeholder=""></Input>
        </FormItem>
        <FormItem label="Path" prop="path">
            <Input v-model="formValidate.path" placeholder=""></Input>
        </FormItem>
        <FormItem label="Method" prop="method">
          <Select v-model="formValidate.method"  placement="bottom">
            <Option v-for="item in methodOptions" :value="item" :key="item">{{item}}</Option>
          </Select>
        </FormItem>
        <FormItem label="Origin" prop="origin">
          <Select v-model="formValidate.origin"  placement="bottom">
            <Option v-for="item in originOptions" :value="item" :key="item">{{item}}</Option>
          </Select>
        </FormItem>

        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">{{ isCreateForm ? '创建' : '更新'}}</Button>
            <Button v-if="isCreateForm" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>

            <a href="javascript:history.go(-1)"><Button  style="margin-left: 8px">返回</Button></a>
        </FormItem>
    </Form>
  </Card>
</template>

<script>
import { postPermissionAdd } from '@/api/casbin'
export default {
  data () {
    return {
      methodOptions: ['*', 'GET', 'POST'],
      originOptions: ['API', 'MENU'],
      isCreateForm: true,
      formValidate: {
        name: '',
        path: '',
        method: '*',
        origin: 'API'
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          },
          { type: 'string', min: 3, max: 10, message: '请输入3~10个字符', trigger: 'blur' }
        ],
        path: [
          {
            required: true,
            message: '请输入路径',
            trigger: 'blur'
          }
        ],
        method: [
          {
            required: true,
            message: '请输入mothod',
            trigger: 'blur'
          }
        ],
        origin: [
          {
            required: true,
            message: '请输入origin',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.isCreateForm ? this.handleCreate() : this.handleUpdate()
        }
      })
    },
    handleCreate () {
      console.log(this.formValidate)
      postPermissionAdd(this.formValidate).then(res => {
        console.log(res)
        this.$Message.success('添加成功')
        this.$router.push({name: 'permission'})
      }).catch(err => {
        err.response && this.$Message.error({
          content: err.response.data.message,
          duration: 10,
          closable: true
        })
      })
    },
    handleUpdate () {
      // console.log('update')
      // postPermissionUpdate(this.formValidate).then(res => {
      //   this.isCreateForm = false
      //   this.formValidate = res.data
      //   this.$Message.success('更新成功')
      // }).catch(err => {
      //   err.response && this.$Message.error({
      //     content: err.response.data.message,
      //     duration: 10,
      //     closable: true
      //   })
      // })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  },
  mounted () {
    // if (this.$route.query.id > 0) {
    //   getUserInfoByID(this.$route.query).then(res => {
    //     this.isCreateForm = false
    //     this.formValidate = res.data
    //   }).catch(err => {
    //     err.response && this.$Message.error({
    //       content: err.response.data.message,
    //       duration: 10,
    //       closable: true
    //     })
    //   })
    // }
  }

}
</script>

<style lang="css" scoped>

</style>
