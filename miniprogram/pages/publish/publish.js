const db=wx.cloud.database();
const app=getApp();
const goods=db.collection('goods');

Page({
    data: {
        title: "",
        info: "",
        price: "",
        detail: [],
        detailNew:[],
        photourl:[],
        checkUp: true, //判断从编辑页面进来是否需要上传图片
        chooseViewShowDetail: true,
        chooseViewShowBanner: true,
        //
        openid: '',
        params: {
        },
    },

    onLoad(options) {
      if(app.globalData.openid==''){
        wx.showToast({
            title: '请先登录！',
            icon: 'none',
            mask:true,
            duration: 1500,
            success: function() {
              setTimeout(function() {
                wx.navigateBack({
                  delta: 1
                })
              }, 2000) //延迟时间
            },
        })
    }
    },


    /**
   * 获取标题
   */
  titleBlur(e) {
    this.setData({
      title: e.detail.value
    })
  },
  /**
   * 获取商品价格
   */
  priceBlur(e) {
    this.setData({
      price: e.detail.value
    })
  },
  /**
   * 获取商品信息
   */
  infoBlur(e) {
    this.setData({
      info: e.detail.value
    })
  },
  
  /**发布提交 */
  formSubmit(e) {
    let that = this
    if (e.detail.value.title === "") {
      wx.showToast({
        title: '请输入商品名称',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (e.detail.value.title.length > 60) {
      wx.showToast({
        title: '商品名称不得大于60字',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (e.detail.value.title.length === "") {
      wx.showToast({
        title: '请输入商品价格',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (e.detail.value.info === "") {
      wx.showToast({
        title: '请输入商品信息',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (that.data.detail.length === 0) {
      wx.showToast({
        title: '请选择详情图片',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else {
      let params = {
        title: e.detail.value.title,
        price: e.detail.value.price,
        info: e.detail.value.info,
      }
      wx.showModal({
        title: '提示',
        content: '确定发布商品',
        success:(res)=> {
          if (res.confirm) {
            wx.showLoading({
                title: '发布中...',
            });
            let that = this
            let detail=this.data.detail
            let photourl=this.data.photourl
            var j=0
            for(var i=0;i<detail.length;i++){
              let filePath=detail[i]
              wx.cloud.uploadFile({
                cloudPath: (new Date()).valueOf() + '.png',//文件名 //云存储图片名字
                filePath,
                success: res => {
                  console.log('[上传图片] 成功：', res)
                  photourl=photourl.concat(res.fileID)
                  j++;
                  console.log(detail.length)
                  that.setData({
                     photourl:photourl
                  })
                  if(j==detail.length){
                    that.sureRelease(params)
                }
                },
              });
            }
            // wx.showLoading({
            //   title: '图片上传中',
            // });
            // var j=0;
            // var temp=0;
            // for(;j<1000000000;j++){
            //   temp++;
            // }
            // if(j==1000000000){
            //   wx.hideLoading()
            // }
            // wx.showModal({
            //   title: '提示',
            //   content: '图片上传完成！',
            //   success:(res)=> {
            //     that.sureRelease(params)
            //   }
            // })
          }
        }
      })
    }
  },
 




  /**确认发布 */
  sureRelease(params){
    let photourl=this.data.photourl
    console.log(params)
    console.log(photourl)
    goods.add({
      data:{
        title:params.title,
        price:params.price,
        info:params.info,
        photourl:this.data.photourl
      },
      success:function(res){
          wx.hideLoading({
          })
        console.log('发布完成')
        wx.showToast({
          title: '发布成功！',
          icon: 'none',
          mask:true,
          duration: 1500,
          success: function() {
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 1000) //延迟时间
          },
        })
      }})
  },
 
  /** 选择图片detail */
  chooseDetail: function() {
    var that = this;
    if (that.data.detail.length < 3) {
      wx.chooseImage({
        count: 3,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function(photo) {
          //detail中包含的可能还有编辑页面下回显的图片，detailNew中包含的只有所选择的图片
          let detail = that.data.detail;
          detail = detail.concat(photo.tempFilePaths);
          let detailNew = that.data.detailNew
          detailNew = detailNew.concat(photo.tempFilePaths)
          that.setData({
            detail: detail,
          })
          that.chooseViewShowDetail();
          console.log(detail)
        }
      })
    } else {
      wx.showToast({
        title: '限制选择3个文件',
        icon: 'none',
        duration: 1000
      })
    }
  },
 
  /** 删除图片detail */
  deleteImvDetail: function(e) {
    var that = this;
    var detail = that.data.detail;
    var itemIndex = e.currentTarget.dataset.id;
    if (that.data.productID != 0) {
      wx.showModal({
        title: '提示',
        content: '删除不可恢复，请谨慎操作',
        success(res) {
          if (res.confirm) {
            console.log(detail[itemIndex]);
            detail.splice(itemIndex, 1);
            that.setData({
              detail: detail,
              checkUp: false
            })
            that.chooseViewShowDetail();
          }
        }
      })
    } else {
      detail.splice(itemIndex, 1);
      that.setData({
        detail: detail,
        checkUp: false
      })
      that.chooseViewShowDetail();
    }
  },
 
  /** 是否隐藏图片选择detail */
  chooseViewShowDetail: function() {
    if (this.data.detail.length >= 3) {
      this.setData({
        chooseViewShowDetail: false
      })
    } else {
      this.setData({
        chooseViewShowDetail: true
      })
    }
  },
 
  /** 查看大图Detail */
  showImageDetail: function(e) {
    var detail = this.data.detail;
    var itemIndex = e.currentTarget.dataset.id;
    wx.previewImage({
      current: detail[itemIndex], // 当前显示图片的http链接
      urls: detail // 需要预览的图片http链接列表
    })
  },
 
})