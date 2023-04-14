const app=getApp();
const db = wx.cloud.database()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        goods_Array:[],
        isloading:false,
        value:''
    },
    //搜索输入框
    // handleInput(e){
    //     var that=this
    //     const {value}=e.detail;
    //     if(!value.trim()){
    //         return;
    //     }
    //     db.collection('goods').where({
    //         "title": value
    //     }).get({
    //         success: function(res){
    //             console.log(res)
    //             if(res.data.length==0){
    //                 wx.showToast({
    //                     title: '未查询该商品，请减少输入字数',
    //                     icon: 'none',
    //                     mask:true,
    //                     duration: 1500,
    //                 })
    //                 that.setData({
    //                     goods_Array:res.data
    //                 });
    //             }
    //             else{
    //                 that.setData({
    //                     goods_Array:res.data
    //                 });
    //             }
    //         }
    //     })
    // }


    handleInput(e){
        var that=this
        //console.log(e.detail)
        this.setData({
            value:String(e.detail.value)
        })
        let value=this.data.value
        if(!value.trim()){
            return;
        }
        console.log(value)
        db.collection('goods').where({
            title: db.RegExp({
              regexp: value,
              options: 'i',
            })
        }).get({
            success: function(res){
                console.log(res)
                if(res.data.length==0){
                    wx.showToast({
                        title: '未查询该商品，请减少输入字数',
                        icon: 'none',
                        mask:true,
                        duration: 1500,
                    })
                    that.setData({
                        goods_Array:res.data
                    });
                }
                else{
                    that.setData({
                        goods_Array:res.data
                    });
                }
            }
        })
    },

    onReachBottom: function () {
        let that=this
        if(this.data.isloading==false){
            console.log(1)
            that.getGoodsList()// 重新获取列表数据
        }
    },

    getGoodsList(){
        let that = this
        this.setData({
            isloading:true
        })
        let value=this.data.value
        db.collection('goods').skip(that.data.goods_Array.length).where({
            title: db.RegExp({
              regexp: value,
              options: 'i',
            })
        }).get({
            success: function(res){
                console.log(res)
                if(res.data.length==0){
                    wx.showToast({
                        title: '没有更多商品辣！',
                        icon: 'none',
                        mask:true,
                        duration: 1500,
                    })
                }
                else{
                    that.setData({
                        isloading:false,
                        goods_Array:that.data.goods_Array.concat(res.data)
                    });
                }
            }
        })
    }
})