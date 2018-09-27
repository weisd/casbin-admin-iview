<template>
<Card>
     <Card :bordered="false" dis-hover class="search-con search-con-top">
       <p slot="title">
         管理员列表
       </p>
       <Row slot="extra">
           <Button  shape="circle" icon="ios-search" @click.prevent="changeShowSearcherBar"></Button>
       </Row>

    </Card>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: left;">
          <router-link to="role/add"><Button type="primary"  icon="ios-add-circle">新建</Button></router-link>

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

export default {

  data () {
    return {
      currPage: 1,
      pageNum: 10, // 每页显示数
      tableColumns: [
        {
          title: '名称',
          key: 'role'
        },
        {
          title: '权限列表',
          minWidth: 120,
          key: 'permission_list',
          render: (h, params) => {
            console.log(params)
            return h('div',
              [
                // h('Row',
                //   [
                //     h('Col',{props:{span:6}},"name"),
                //     h('Col',{props:{span:6}},"path"),
                //     h('Col',{props:{span:6}},"method"),
                //     h('Col',{props:{span:6}},"origin"),
                //   ]
                // ),
                ...params.row.permission_list.map((obj, i) => {
                  let cont = []
                  cont.push(...[
                    h('Col', {props: {span: 8}}, obj.name),
                    h('Col', {props: {span: 8}}, obj.path),
                    h('Col', {props: {span: 4}}, obj.method),
                    h('Col', {props: {span: 4}}, obj.origin)
                  ])
                  if (i < params.row.permission_list.length - 1) {
                    cont.push(h('Divider'))
                  }

                  return h('Row',
                    cont
                  )
                })
              ]

            )
          }
        },
        {
          title: '操作',
          key: 'update',
          minWidth: 30,
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
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.remove(params.row.role)
                  }
                }
              }, '删除')
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
      return this.$store.state.casbin.rolelist.slice(start, start + this.pageNum)
    },
    totalPage () {
      return Math.ceil(this.$store.state.casbin.rolelist.length / this.pageNum) * 10
    }
  },
  methods: {
    ...mapActions(['getRoleList', 'postRoleDel']),
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
      this.$router.push({name: 'role/edit', query: {role: this.tableData[idx].role}})
      // this.$Message.info('显示ID：'+this.tableData[idx].id);
    },
    remove (name) {
      this.$Modal.confirm({
        loading: true,
        title: '确认删除吗？',
        content: '删除后将不能恢复！！！',
        onOk: () => {
          this.$Modal.remove()
          console.log('remove', name)
          this.postRoleDel({role: name}).then(res => {
            this.$Message.info('删除成功：' + name)
          }).catch(err => {
            err.response && this.$Message.error({
              content: err.response.data.message,
              duration: 10,
              closable: true
            })
            console.log('err', err)
          })
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

      // this.$router.push({name: 'admin', query: {'querys[]': querys, order: this.orderby + ' ' + this.orderbyVal, limit: this.searchLimit, _: new Date().getTime()}})
    },
    fetchList () {
      console.log('getRoleList')
      this.getRoleList().catch(err => {
        err.response && this.$Message.error({
          content: err.response.data.message,
          duration: 10,
          closable: true
        })
      })
    }

  },

  mounted () {
    this.fetchList()
  },
  watch: {
    '$route': 'fetchList'
  }
}
</script>
