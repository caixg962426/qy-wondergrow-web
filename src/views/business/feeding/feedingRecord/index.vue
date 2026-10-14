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
      <el-form-item label="记录人用户ID" prop="userId">
        <el-input
          v-model="quewgParams.userId"
          placeholder="请输入记录人用户ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="喂养时间" prop="feedTime">
        <el-date-picker clearable
          v-model="quewgParams.feedTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择喂养时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="奶量(ml)，奶粉/母乳瓶喂时填写" prop="milkAmount">
        <el-input
          v-model="quewgParams.milkAmount"
          placeholder="请输入奶量(ml)，奶粉/母乳瓶喂时填写"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="奶粉SKU ID，关联formula_sku.sku_id，奶粉时填写" prop="formulaSkuId">
        <el-input
          v-model="quewgParams.formulaSkuId"
          placeholder="请输入奶粉SKU ID，关联formula_sku.sku_id，奶粉时填写"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="亲喂侧" prop="breastSide">
        <el-input
          v-model="quewgParams.breastSide"
          placeholder="请输入亲喂侧"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="亲喂时长(分钟)，母乳亲喂时填写" prop="durationMinutes">
        <el-input
          v-model="quewgParams.durationMinutes"
          placeholder="请输入亲喂时长(分钟)，母乳亲喂时填写"
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
          v-hasPermi="['feeding:feedingRecord:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['feeding:feedingRecord:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['feeding:feedingRecord:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['feeding:feedingRecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="feedingRecordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="记录ID" align="center" prop="recordId" />
      <el-table-column label="宝宝ID" align="center" prop="babyId" />
      <el-table-column label="记录人用户ID" align="center" prop="userId" />
      <el-table-column label="喂养类型" align="center" prop="feedType" />
      <el-table-column label="喂养时间" align="center" prop="feedTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.feedTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="奶量(ml)，奶粉/母乳瓶喂时填写" align="center" prop="milkAmount" />
      <el-table-column label="奶粉SKU ID，关联formula_sku.sku_id，奶粉时填写" align="center" prop="formulaSkuId" />
      <el-table-column label="亲喂侧" align="center" prop="breastSide" />
      <el-table-column label="亲喂时长(分钟)，母乳亲喂时填写" align="center" prop="durationMinutes" />
      <el-table-column label="备注" align="center" prop="note" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['feeding:feedingRecord:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['feeding:feedingRecord:remove']">删除</el-button>
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

    <!-- 添加或修改喂养记录对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="feedingRecordRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="宝宝ID" prop="babyId">
              <el-input v-model="form.babyId" placeholder="请输入宝宝ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="记录人用户ID" prop="userId">
              <el-input v-model="form.userId" placeholder="请输入记录人用户ID" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="喂养时间" prop="feedTime">
              <el-date-picker clearable
                v-model="form.feedTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择喂养时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="奶量(ml)，奶粉/母乳瓶喂时填写" prop="milkAmount">
              <el-input v-model="form.milkAmount" placeholder="请输入奶量(ml)，奶粉/母乳瓶喂时填写" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="奶粉SKU ID，关联formula_sku.sku_id，奶粉时填写" prop="formulaSkuId">
              <el-input v-model="form.formulaSkuId" placeholder="请输入奶粉SKU ID，关联formula_sku.sku_id，奶粉时填写" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="亲喂侧" prop="breastSide">
              <el-input v-model="form.breastSide" placeholder="请输入亲喂侧" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="亲喂时长(分钟)，母乳亲喂时填写" prop="durationMinutes">
              <el-input v-model="form.durationMinutes" placeholder="请输入亲喂时长(分钟)，母乳亲喂时填写" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="note">
              <el-input v-model="form.note" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="删除标志" prop="delFlag">
              <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
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

<script setup name="FeedingRecord">
import { listFeedingRecord, getFeedingRecord, delFeedingRecord, addFeedingRecord, updateFeedingRecord } from "@/api/business/feeding/feedingRecord"

const { proxy } = getCurrentInstance()

const feedingRecordList = ref([])
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
    feedType: undefined,
    feedTime: undefined,
    milkAmount: undefined,
    formulaSkuId: undefined,
    breastSide: undefined,
    durationMinutes: undefined,
    note: undefined,
  },
  rules: {
    babyId: [
      { required: true, message: "宝宝ID不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "记录人用户ID不能为空", trigger: "blur" }
    ],
    feedType: [
      { required: true, message: "喂养类型不能为空", trigger: "change" }
    ],
    feedTime: [
      { required: true, message: "喂养时间不能为空", trigger: "blur" }
    ],
  }
})

const { quewgParams, form, rules } = toRefs(data)

/** 查询喂养记录列表 */
function getList() {
  loading.value = true
  listFeedingRecord(quewgParams.value).then(response => {
    feedingRecordList.value = response.rows
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
    recordId: null,
    babyId: null,
    userId: null,
    feedType: null,
    feedTime: null,
    milkAmount: null,
    formulaSkuId: null,
    breastSide: null,
    durationMinutes: null,
    note: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  }
  proxy.resetForm("feedingRecordRef")
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
  ids.value = selection.map(item => item.recordId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加喂养记录"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _recordId = row.recordId || ids.value
  getFeedingRecord(_recordId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改喂养记录"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["feedingRecordRef"].validate(valid => {
    if (valid) {
      if (form.value.recordId != null) {
        updateFeedingRecord(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addFeedingRecord(form.value).then(() => {
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
  const _recordIds = row.recordId || ids.value
  proxy.$modal.confirm('是否确认删除喂养记录编号为"' + _recordIds + '"的数据项？').then(function() {
    return delFeedingRecord(_recordIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('feeding/feedingRecord/export', {
    ...quewgParams.value
  }, `feedingRecord_${new Date().getTime()}.xlsx`)
}

getList()
</script>
