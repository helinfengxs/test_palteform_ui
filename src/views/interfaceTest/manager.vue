<template>
  <div class="app-container">
    <template>
      <el-table
        :data="items"
        element-loading-text="数据加载中"

        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
        :cell-style="{background:'#fff'}"
        :border="true"
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

        <el-table-column prop="interfaceName" label="接口名称" width="180" />

<!--        <el-table-column label="项目测试类型" width="80">-->
<!--          <template slot-scope="scop" >-->
<!--            <div v-if="scop.row.testType === '0'">UI测试</div>-->
<!--            <div v-if="scop.row.testType === '1'">接口测试</div>-->
<!--            <div v-if="scop.row.testType === '2'">性能测试</div>-->
<!--            <div v-if="scop.row.testType === '3'">app测试</div>-->

<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column  prop="interfaceAddress" label="接口地址" width="80"/>
        <el-table-column  prop="interfaceCaes" label="关联用例数" width="80"/>
        <el-table-column  prop="interfaceAddress" label="所属项目" width="80"/>
        <el-table-column prop="gmtCreate" label="创建时间" width="160"/>
        <el-table-column prop="gmtModified" label="更新时间" width="160" />
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="eidtor(scope.row.id)">修改</el-button>

            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script>
import project from '@/api/interfaceTest/manager'
export default {
  data() {
    return {
      items: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }]
    }
  },
  created() {
  },
  methods: {

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getList() {
    }
  }
}
</script>


