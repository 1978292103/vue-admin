import service from "@/utils/request"
/**
 * 列表信息
 */
export function GetList(data){
  return service.request({
      method: "post",
      url: "/news/getList/",
      data
    })
}

/**
 * 新增信息
 */
export function AddInfo(data){
  return service.request({
      method: "post",
      url: "/news/add/",
      data
    })
}
/**
 * 
 */

export function EditInfo(data){
  return service.request({
      method: "post",
      url: "	/news/editInfo/",
      data
    })
}

/**
 * 删除列表信息
 */
export function DeleteInfo(data){
  return service.request({
      method: "post",
      url: "/news/deleteInfo/",
      data
    })
}


 /**
  * 编辑
  */
 export function EditCategory(data){
  return service.request({
      method: "post",
      url: "/news/editCategory/",
      data
    })
}


  /**
   * 删除
   */
  export function DeleteCategory(data){
    return service.request({
        method: "post",
        url: "/news/deleteCategory/",
        data
      })
}

   /**
    * 一级分类的添加
    */
   export function AddFirstCategory(data){
    return service.request({
        method: "post",
        url: "/news/addFirstCategory/",
        data
      })
}


   /**
    * zi级分类的添加
    */
   export function AddChildrenCategory(data){
    return service.request({
        method: "post",
        url: "	/news/addChildrenCategory/",
        data
      })
}


/**
 * 获取分类
 */

export function GetCategory(data){
  return service.request({
      method: "post",
      url: "/news/getCategory/",
      data
    })
}

/**
 * 获取所有的分类，包括子级
 */

export function GetCategoryAll(data){
  return service.request({
      method: "post",
      url: "/news/getCategoryAll/ ",
      data
    })
}