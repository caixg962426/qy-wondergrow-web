import request from '@/utils/request'

// 查询奶粉SPU列表
export function listFormulaSpu(query) {
  return request({
    url: '/formula/formulaSpu/list',
    method: 'get',
    params: query
  })
}

// 查询奶粉SPU详细
export function getFormulaSpu(spuId) {
  return request({
    url: '/formula/formulaSpu/' + spuId,
    method: 'get'
  })
}

// 新增奶粉SPU
export function addFormulaSpu(data) {
  return request({
    url: '/formula/formulaSpu',
    method: 'post',
    data: data
  })
}

// 修改奶粉SPU
export function updateFormulaSpu(data) {
  return request({
    url: '/formula/formulaSpu',
    method: 'put',
    data: data
  })
}

// 删除奶粉SPU
export function delFormulaSpu(spuId) {
  return request({
    url: '/formula/formulaSpu/' + spuId,
    method: 'delete'
  })
}
