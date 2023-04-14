import { request } from "../../request/ground.js";
const app = getApp();
const db=wx.cloud.database();
const dc=db.command

Page({

    data: {
        swiperList:[],
        isloading: false,
        num:20,
        cateList:[
        "../../images/ele.png",
        "../../images/book.png",
        "../../images/cloth.png",
        "../../images/education.png"],
        goodslist:[]
    },
    //页面加载时触发
    onLoad:function(options) {
        let that=this
        db.collection('goods').get({
            success(res){
                console.log(res)      
                that.setData({
                    goodslist:res.data
                })
                console.log(that.data.goodslist)
            }
        })
        this.getSwiperList();
    },

    //获取轮播图数据
    getSwiperList(){
        request({url:"https://api.it120.cc/buctmarket/banner/list"})
        .then(result=>{
            this.setData({
                swiperList:result.data.data
            })
        })
    },

    //用户点击右上角分享给好友，要现在分享到好友这个设置menu的两个参数，才可以实现分享到朋友圈
  onShareAppMessage:function(){
    wx.showShareMenu({
      withShareTicket:true,
      menu:['shareAppMessage','shareTimeline']
    })
 
    return {
      title:'北化咸鱼',
     
      imageUrl:''
    }
  },
  //用户点击右上角分享朋友圈
  onShareTimeline:function(){
    return {
      title:'北化咸鱼',
      query:{
        key:123
      },
      imageUrl:''
    }
  },
   

    // onShow(){
    //     let that=this
    //     db.collection('goods').where(dc.or([
    //     {
    //         "_openid":"oFyyY4nh5XYsnpfU6z72WOcjXvPc"
    //     },
    //     {
    //         "_openid":"oFyyY4vEIQ94RE37vaFt1qneA4zY"
    //     },
    //     {
    //         "_openid":"oFyyY4oIX19YIAWLjiUC7hQuUNJU"
    //     },
    //     {
    //         "_openid":"oFyyY4nRMaQph3QMtu6ttAbtYXwY"
    //     },
    //     ])).get({
    //         success(res){
    //             that.setData({
    //                 goodslist:res.data
    //             })
    //         }
    //     })
    // },

    onPullDownRefresh: function(e) {   
        wx.stopPullDownRefresh();
    },

    onReachBottom: function () {
        let that=this
        if(this.data.isloading==false){
            console.log(1)
            that.getGoodsList()// 重新获取列表数据
        }
    },
 
    //获取商品数据
    getGoodsList(){
        let that=this
        this.setData({
          isLoading:true
        })
        db.collection('goods').skip(that.data.goodslist.length).get({
            success(res){
                console.log(res)     
                if(res.data.length==0){
                    wx.showToast({
                        title: '没有更多商品辣！',
                        icon: 'none',
                        mask:true,
                        duration: 1500,
                        // success: function() {
                        //   setTimeout(function() {
                        //     wx.navigateBack({
                        //       delta: 1
                        //     })
                        //   }, 2000) //延迟时间
                        // },
                    })
                }
                else{ 
                    that.setData({
                        // num:that.data.num+20,
                        isloading:false,
                        goodslist:that.data.goodslist.concat(res.data)
                    })
                    console.log(that.data.goodslist)
                }
            }
        })
    }
})