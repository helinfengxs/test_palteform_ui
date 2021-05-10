<template>
  <div class="app-container">

    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="项目名称">
        <el-input v-model="formInline.user" placeholder="项目名称"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>

      <el-form-item label="活动时间" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker type="date" placeholder="选择日期" v-model="formInline.date1" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker placeholder="选择时间" v-model="formInline.date2" style="width: 100%;"></el-time-picker>
          </el-form-item>
        </el-col>
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
  </div>
</template>

<script>
import project from '@/api/project/project'
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
        date2:""
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
      project.getProjectPage(this.page,this.limit,this.projectQuery)
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
}



</script>

