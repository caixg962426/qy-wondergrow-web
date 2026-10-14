<template>
  <div class="app-container">
    <el-form :model="quewgParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="宝宝ID" prop="babyId">
        <el-input
          v-model="quewgParams.babyId"
          placeholder="请输入宝宝ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户ID" prop="userId">
        <el-input
          v-model="quewgParams.userId"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份" prop="identity">
        <el-input
          v-model="quewgParams.identity"
          placeholder="请输入身份"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否宝宝创建人/主要看护人" prop="isOwner">
        <el-input
          v-model="quewgParams.isOwner"
          placeholder="请输入是否宝宝创建人/主要看护人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否默认宝宝" prop="isDefault">
        <el-input
          v-model="quewgParams.isDefault"
          placeholder="请输入是否默认宝宝"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['baby:babyMember:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['baby:babyMember:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['baby:babyMember:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['baby:babyMember:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="babyMemberList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="宝宝ID" align="center" prop="babyId" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="身份" align="center" prop="identity" />
      <el-table-column label="是否宝宝创建人/主要看护人" align="center" prop="isOwner" />
      <el-table-column label="是否默认宝宝" align="center" prop="isDefault" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['baby:babyMember:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['baby:babyMember:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="quewgParams.pageNum"
      v-model:limit="quewgParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改宝宝与用户关系对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="babyMemberRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="宝宝ID" prop="babyId">
              <el-input v-model="form.babyId" placeholder="请输入宝宝ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用户ID" prop="userId">
              <el-input v-model="form.userId" placeholder="请输入用户ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="身份" prop="identity">
              <el-input v-model="form.identity" placeholder="请输入身份" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否宝宝创建人/主要看护人" prop="isOwner">
              <el-input v-model="form.isOwner" placeholder="请输入是否宝宝创建人/主要看护人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否默认宝宝" prop="isDefault">
              <el-input v-model="form.isDefault" placeholder="请输入是否默认宝宝" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="删除标志" prop="delFlag">
              <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="BabyMember">
import { listBabyMember, getBabyMember, delBabyMember, addBabyMember, updateBabyMember } from "@/api/business/baby/babyMember"

const { proxy } = getCurrentInstance()

const babyMemberList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  quewgParams: {
    pageNum: 1,
    pageSize: 10,
    babyId: undefined,
    userId: undefined,
    identity: undefined,
    isOwner: undefined,
    isDefault: undefined,
    status: undefined,
  },
  rules: {
    babyId: [
      { required: true, message: "宝宝ID不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "用户ID不能为空", trigger: "blur" }
    ],
  }
})

const { quewgParams, form, rules } = toRefs(data)

/** 查询宝宝与用户关系列表 */
function getList() {
  loading.value = true
  listBabyMember(quewgParams.value).then(response => {
    babyMemberList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}

/** 表单重置 */
function reset() {
  form.value = {
    id: null,
    babyId: null,
    userId: null,
    identity: null,
    isOwner: null,
    isDefault: null,
    status: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("babyMemberRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  quewgParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加宝宝与用户关系"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getBabyMember(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改宝宝与用户关系"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["babyMemberRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateBabyMember(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addBabyMember(form.value).then(() => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value
  proxy.$modal.confirm('是否确认删除宝宝与用户关系编号为"' + _ids + '"的数据项？').then(function() {
    return delBabyMember(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('baby/babyMember/export', {
    ...quewgParams.value
  }, `babyMember_${new Date().getTime()}.xlsx`)
}

getList()
</script>
