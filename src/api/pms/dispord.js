//## axios
//框架再次封装axios

import request from '@/utils/request'
const api_name = '/pms/dispord'
export  default {//定义调用后端接口的方法
  //##带条件的分页查询
  findPage(dispOrdQuery,pageNo,pageSize){
    return request({
      url: `${api_name}/${pageNo}/${pageSize}`,
      method: 'post',
      data: dispOrdQuery
    })
  },
  //添加
  addDispOrd(dispOrd){
    return request({
      url:`${api_name}`,
      method:'post',
      data:dispOrd
    })
  },
  //回显
  view(dispOrdId){
    return request({
      url:`${api_name}/${dispOrdId}`,
      method:'get',

    })
  },
  //修改
  update(disOrd){
    return request({
      url:`${api_name}`,
      method:'put',
      data:disOrd
    })
  },
  //删除
  delete(dispOrdId){
    return request({
      url:`${api_name}/${dispOrdId}`,
      method:'delete'
    })
  }

}
