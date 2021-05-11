<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="项目名称">
        <el-input v-model="formInline.user" placeholder="项目名称" size="mini" style="width: 120px"></el-input>
      </el-form-item>
      <el-form-item label="测试类型" >
        <el-select v-model="formInline.region" placeholder="测试类型" size="mini"  style="width: 120px" >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="开始时间">

        <el-date-picker
          v-model="formInline.value1"
          type="datetime"
          placeholder="选择日期时间"
          size="mini"
          style="width: 180px"
        >

        </el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间">

        <el-date-picker
          v-model="formInline.value1"
          type="datetime"
          placeholder="选择日期时间"
          size="mini"
          style="width: 180px"
        >

        </el-date-picker>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit" size="mini">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="resetData"  size="mini" >清空条件</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="items"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
      :cell-style="{background:'#fff'}"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page-1)* limit+scope.$index+1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="项目名称" width="180" />

      <el-table-column label="项目测试类型" width="80">
      <template slot-scope="scop" >
        <div v-if="scop.row.testType === 0">UI测试</div>
        <div v-if="scop.row.testType === 1">接口测试</div>
        <div v-if="scop.row.testType === 2">性能测试</div>
        <div v-if="scop.row.testType === 3">app测试</div>

      </template>
      </el-table-column>
      <el-table-column prop="interfaceCount" label="接口总数" width="80"/>

      <el-table-column prop="caseCount" label="用例总数" width="80"/>

      <el-table-column prop="gmtCreate" label="创建时间" width="160"/>

      <el-table-column prop="gmtModified" label="更新时间" width="160" />
      <el-table-column prop="describtion" label="描述" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />
  </div>
</template>

<script>
import project from '@/api/project/project'
import {getList} from "../../api/table";
export default {
  data() {
    return {
      total:0,
      page:1,
      limit:10,
      items:null,
      formInline: {
        user: '',
        region: '',
        date1:"",
        date2:"",
        value1:""
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {

    /**
     * 查询项目列表信息
     */
    getList(){
      project.getProjectPage(this.page,this.limit,this.formInline)
        .then(response => {
          this.page = response.data.current
          this.items = response.data.items
          this.total = response.data.total
          console.log(this.items)
        })
        .catch(error => {
          console.log(error)
        })
    },

    /**
     * 全选
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /**
     * 清空查询条件
     */
    resetData(){
      this.formInline ={}
    },fetchData(val){
      this.page =val
      this.getList(this.page,this.limit,this.formInline)
    }
  }
}



</script>

