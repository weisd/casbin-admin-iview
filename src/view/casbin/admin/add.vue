<template>
  <Card>
    <p slot="title">{{ isCreateForm ? '添加' : '编辑' }}管理员</p>
    <Form  ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" >
        <FormItem label="用户名" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入用户名"></Input>
        </FormItem>
        <template v-if="isCreateForm">
        <FormItem  label="密码" prop="passwd">
            <Input v-model="formValidate.passwd" type="password" placeholder="请输入密码"></Input>
        </FormItem>
        <FormItem label="密码" prop="repasswd">
            <Input v-model="formValidate.repasswd" type="password" placeholder="确认密码"></Input>
        </FormItem>
        </template>
        <FormItem label="邮箱" prop="email">
            <Input v-model="formValidate.email" placeholder="请输入邮箱"></Input>
        </FormItem>
        <FormItem label="手机" prop="phone">
            <Input v-model="formValidate.phone" placeholder="请输入手机号"></Input>
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
import { postUserAdd, getUserInfoByID, postUserUpdate } from '@/api/user'
export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'))
      } else {
        if (this.formValidate.passwd !== '') {
          // 对第二个密码框单独验证
          this.$refs.formValidate.validateField('passwd')
        }

        if (value !== this.formValidate.passwd) {
          callback(new Error('两次密码不一致'))
        }
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (value !== '') {
        if (!(/^\d{11}$/.test(value))) {
          callback(new Error('请输入确认密码'))
          return
        }
      }
      callback()
    }
    return {
      isCreateForm: true,
      formValidate: {
        name: '',
        email: '',
        phone: '',
        passwd: '',
        repasswd: ''
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          { type: 'string', min: 3, max: 10, message: '请输入3~10个字符', trigger: 'blur' }
        ],
        mail: [
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        phone: [
          {validator: validatePhone, trigger: 'blur'}
        ],
        passwd: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          { type: 'string', min: 6, message: '至少6个字符', trigger: 'blur' }
        ],
        repasswd: [
          {required: true, validator: validatePass, trigger: 'blur'}
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
      postUserAdd(this.formValidate).then(res => {
        console.log(res)
        this.$Message.success('添加成功')
        this.$router.push({name: 'admin'})
      }).catch(err => {
        err.response && this.$Message.error({
          content: err.response.data.message,
          duration: 10,
          closable: true
        })
      })
    },
    handleUpdate () {
      console.log('update')
      postUserUpdate(this.formValidate).then(res => {
        this.isCreateForm = false
        this.formValidate = res.data
        this.$Message.success('更新成功')
      }).catch(err => {
        err.response && this.$Message.error({
          content: err.response.data.message,
          duration: 10,
          closable: true
        })
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  },
  mounted () {
    if (this.$route.query.id > 0) {
      getUserInfoByID(this.$route.query).then(res => {
        this.isCreateForm = false
        this.formValidate = res.data
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
