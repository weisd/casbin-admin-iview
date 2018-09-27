<template>
<Card>
     <Card :bordered="false" dis-hover class="search-con search-con-top">
       <p slot="title">
         管理员列表
       </p>
       <Row slot="extra">
           <Button  shape="circle" icon="ios-search" @click.prevent="changeShowSearcherBar"></Button>
       </Row>

      <Form v-if="showSearchBar" inline ref="formValidate" :model="formValidate" :rules="ruleValidate" >
        <div v-for="(v, i) in searchInputs" :key="i">
        <Row :gutter="16" >
          <Col span="4">
            <Select  v-model="v.field"  placement="bottom">
              <Option v-for="item in searchFields" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </Col>
          <Col span="4">
            <Select v-model="v.cond"  placement="bottom">
              <Option v-for="item in selectType" :value="item.value" :key="item.value">{{item.text}}</Option>
            </Select>
          </Col>
          <Col span="8">
            <Input v-model="v.value"   placeholder=""></Input>
          </Col>
          <Col  span="2">
            <Button v-if="inputNum > 1" @click="handleDelInput(i)" >删除</Button>

          </Col>

        </Row>
        <br>
        </div>
        <Row :gutter="16" >
          <Col span="2">
            <Button type="text" >排序:</Button>
          </Col>
          <Col span="4">
            <Select  v-model="orderby" placement="bottom">
              <Option v-for="item in searchFields" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </Col>
          <Col span="4">
            <Select v-model="orderbyVal"  placement="bottom">
              <Option  value="desc" key="desc">倒序</Option>
              <Option  value="asc" key="asc">升序</Option>
            </Select>
          </Col>
        </Row>
        <Row :gutter="16" >
          <Col span="2">
            <Button type="text" >Limit:</Button>
          </Col>
          <Col span="4">
            <Select v-model="searchLimit">
              <Option v-for="item in [1,10,20,50,100]" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </Col>
        </Row>
        <br>
        <Row :gutter="16" type="flex" justify="start">
          <Col span="4" offset="4">
            <Button type="primary" @click="handleSubmit('formValidate')">搜索</Button>
          </Col>
          <Col span="4" >
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
          </Col>
          <Col  span="2"  >
          <Button @click="handleAddInput()" >添加条件</Button>
          </Col>
        </Row>
    </Form>
    </Card>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: left;">
          <router-link to="admin/add"><Button type="primary"  icon="ios-add-circle">新建</Button></router-link>

        </div>
        <div style="float: right;">
            <Select v-model="pageNum" >
              <Option v-for="item in [1,10,20,50,100]" :value="item" :key="item">每页显示：{{ item }}</Option>
            </Select>
        </div>
        <div style="float: right;">
            <Page :total="totalPage" :current="currPage" @on-change="changePage" show-total></Page>
        </div>
    </div>
    <Table :data="tableData" :columns="tableColumns" stripe></Table>

    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :total="totalPage" :current="currPage" @on-change="changePage" show-total></Page>
        </div>
    </div>
</Card>
</template>
<script>

import { mapActions } from 'vuex'
import { timeSince } from '@/libs/time'

export default {

  data () {
    return {
      userRoles:this.$store.state.casbin.roleuser,
      searchLimit: 50,
      orderby: 'id',
      orderbyVal: 'desc',
      // searchInputs: [],
      searchInputs: [{field: 'id', cond: '=', value: ''}],
      selectType: [
        {value: '=', text: '='},
        {value: '>', text: '>'},
        {value: '>=', text: '>='},
        {value: '<', text: '<'},
        {value: '<=', text: '<='},
        {value: '!=', text: '!='},
        {value: 'LIKE', text: 'LIKE'},
        {value: 'NOT LIKE', text: 'NOT LIKE'},
        {value: 'IN', text: 'IN (...)'},
        {value: 'NOT IN', text: 'NOT IN (...)'},
        {value: 'BETWEEN', text: 'BETWEEN'},
        {value: 'NOT BETWEEN', text: 'NOT BETWEEN'},
        {value: 'IS NULL', text: 'IS NULL'},
        {value: 'IS NOT NULL', text: 'IS NOT NULL'}
      ],
      searchFields: ['id', 'name', 'email', 'phone', 'status', 'created_at', 'updated_at'],
      formValidate: {
        id: '',
        name: '',
        email: '',
        phone: '',
        status: '',
        created_at: '',
        updated_at: ''
      },
      ruleValidate: {

      },
      currPage: 1,
      pageNum: 10, // 每页显示数
      showSearchBar: false,
      tableColumns: [
        {
          title: 'ID',
          key: 'id'
        },
        {
          title: '用户名',
          key: 'name'
        },
        {
          title: 'E-mail',
          key: 'email'
        },
        {
          title: '手机号',
          key: 'phone'
        },
        {
          title: '角色',
          render: (h, params) => {
            if (this.userRoles[params.row.id]) {
              return h('div',
                this.userRoles[params.row.id].map((role)=>{
                  console.log('role..', role)
                  return h('div',role)
                })
              )
            }
          }
        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            const status = this.tableData[params.index].status
            if (status === 1) {
              return h('Tag', {props: {color: 'green'}}, '正常')
            } else if (status === 2) {
              return h('Tag', {props: {color: 'orange'}}, '禁用')
            } else {
              return h('Tag', {props: {color: 'error'}}, '未知')
            }
          }
        },
        {
          title: '创建时间',
          key: 'created_at',
          render: (h, params) => {
            return h('div', timeSince(new Date(this.tableData[params.index].created_at)))
          }
        },
        {
          title: '更新时间',
          key: 'updated_at',
          render: (h, params) => {
            return h('div', timeSince(new Date(this.tableData[params.index].updated_at)))
          }
        },
        {
          title: '操作',
          key: 'update',
          minWidth: 60,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.$router.push({name: 'admin/role', query: {id: this.tableData[params.index].id}})
                  }
                }
              }, '更新角色')
            ])
          }

        }
      ]
    }
  },
  computed: {
    inputNum () {
      return this.searchInputs.length
    },
    tableData () {
      let start = (this.currPage - 1) * this.pageNum
      return this.$store.state.user.list.slice(start, start + this.pageNum)
    },
    totalPage () {
      return Math.ceil(this.$store.state.user.list.length / this.pageNum) * 10
    }
  },
  methods: {
    ...mapActions(['getUserList','getRoleUsers']),
    formatDate (date) {
      return date.substr(0, 10)
    },
    changePage (n) {
      this.currPage = n
      // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
    },
    changeShowSearcherBar () {
      this.showSearchBar = !this.showSearchBar
    },
    show (idx) {
      this.$router.push({name: 'admin/info', query: {id: this.tableData[idx].id}})
      // this.$Message.info('显示ID：'+this.tableData[idx].id);
    },
    remove (idx) {
      this.$Modal.confirm({
        loading: true,
        title: '确认删除吗？',
        content: '删除后将不能恢复！！！',
        onOk: () => {
          this.$Modal.remove()

          this.$Message.info('删除ID：' + this.tableData[idx].id)
        }
      })
    },
    handleDelInput (i, obj) {
      this.searchInputs.splice(i, 1)
    },
    handleAddInput () {
      this.searchInputs.push({field: '', cond: '=', value: ''})
    },
    handleReset () {
      this.searchInputs = [{field: 'id', cond: '=', value: ''}]
    },
    handleSubmit (name) {
      let querys = []
      for (const k in this.searchInputs) {
        if (this.searchInputs.hasOwnProperty(k)) {
          const v = this.searchInputs[k]
          if (v.value) {
            querys.push([v.field, v.cond, v.value].join(','))
          }
        }
      }

      this.$router.push({name: 'admin', query: {'querys[]': querys, order: this.orderby + ' ' + this.orderbyVal, limit: this.searchLimit, _: new Date().getTime()}})
    },
    fetchList () {
      console.log(this.$route.query)
      let fields = []
      const querys = this.$route.query['querys[]']
      let newQuerys = []

      if (querys) {
        let searchQuerys = []
        if (typeof (querys) === 'string') {
          searchQuerys = [querys]
        } else {
          searchQuerys = querys
        }

        for (const key in searchQuerys) {
          if (searchQuerys.hasOwnProperty(key)) {
            const v = searchQuerys[key]
            const vs = v.split(',')
            if (vs.length > 3) {
              vs[2] = vs.slice(2).join(',')
            }
            fields.push({field: vs[0], cond: vs[1], value: vs[2]})
            newQuerys.push(v)
          }
        }
      }

      this.searchInputs = fields

      if (fields.length === 0) {
        this.searchInputs = [{field: 'id', cond: '=', value: ''}]
      } else {
        this.showSearchBar = true
      }

      if (this.$route.query.limit) {
        this.searchLimit = parseInt(this.$route.query.limit)
      }

      if (this.$route.query.order) {
        const arr = this.$route.query.order.split(' ')
        console.log(arr)
        if (arr.length === 2) {
          this.orderby = arr[0]
          this.orderbyVal = arr[1]
        }
      }

      this.getUserList({querys: newQuerys, limit: this.searchLimit, order: this.orderby + ' ' + this.orderbyVal}).catch(err => {
        err.response && this.$Message.error({
          content: err.response.data.message,
          duration: 10,
          closable: true
        })
      })
    },
    getRoleUsersByUid (id) {
       if ( this.userRoles["id"]) {
         return this.userRoles["id"]
       }

       return []
    }

  },

  mounted () {
    this.getRoleUsers()
    this.fetchList()
  },
  watch: {
    '$route': 'fetchList'
  }
}
</script>
