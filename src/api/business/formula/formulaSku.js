import request from '@/utils/request'

// 查询奶粉SKU列表
export function listFormulaSku(query) {
  return request({
    url: '/formula/formulaSku/list',
    method: 'get',
    params: query
  })
}

// 查询奶粉SKU详细
export function getFormulaSku(skuId) {
  return request({
    url: '/formula/formulaSku/' + skuId,
    method: 'get'
  })
}

// 新增奶粉SKU
export function addFormulaSku(data) {
  return request({
    url: '/formula/formulaSku',
    method: 'post',
    data: data
  })
}

// 修改奶粉SKU
export function updateFormulaSku(data) {
  return request({
    url: '/formula/formulaSku',
    method: 'put',
    data: data
  })
}

// 删除奶粉SKU
export function delFormulaSku(skuId) {
  return request({
    url: '/formula/formulaSku/' + skuId,
    method: 'delete'
  })
}
