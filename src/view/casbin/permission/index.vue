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
          <router-link to="permission/add"><Button type="primary"  icon="ios-add-circle">新建</Button></router-link>

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
      orderby: 'id',
      orderbyVal: 'desc',
      currPage: 1,
      pageNum: 10, // 每页显示数
      tableColumns: [
        {
          title: 'Keywords',
          key: 'name'
        },
        {
          title: 'PATH',
          key: 'path',
          sortable: true
        },
        {
          title: 'method',
          key: 'method'
        },
        {
          title: 'origin',
          key: 'origin'
        },
        {
          title: '操作',
          key: 'update',
          minWidth: 60,
          render: (h, params) => {
            return h('div', [
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
      return this.$store.state.casbin.permissionlist.slice(start, start + this.pageNum)
    },
    totalPage () {
      return Math.ceil(this.$store.state.casbin.permissionlist.length / this.pageNum) * 10
    }
  },
  methods: {
    ...mapActions(['getPermissionList', 'postPermissionDel']),
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
      this.$router.push({name: 'permision/info', query: {id: this.tableData[idx].id}})
      // this.$Message.info('显示ID：'+this.tableData[idx].id);
    },
    remove (idx) {
      this.$Modal.confirm({
        loading: true,
        title: '确认删除吗？',
        content: '删除权限后将不能恢复！！！',
        onOk: () => {
          this.$Modal.remove()
          this.postPermissionDel(this.tableData[idx]).then(res => {
            this.$Message.info('删除成功：' + idx)
          }).catch(err => {
            err.response && this.$Message.error({
              content: err.response.data.message,
              duration: 10,
              closable: true
            })
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

      this.getPermissionList({querys: newQuerys, limit: this.searchLimit, order: this.orderby + ' ' + this.orderbyVal}).catch(err => {
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
