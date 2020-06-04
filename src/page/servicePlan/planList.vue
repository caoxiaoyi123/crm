<!-- 模型： DOM 结构 -->
<template>
    <div class="planList">
        <div class="tab-box">
            <ul class="drc">
                <li class="fs13 cp" v-for="(o,i) of tabList" :key="i" :class="tabNum==o.path?'active':''" @click="tabChangeFn(o)">{{o.name}}</li>
            </ul>
        </div>
        <div class="content"></div>
    </div>
</template>
<script>
export default {
    name: 'planList', // 结构名称
    data() {
        return {
            // 数据模型a
        }
    },
    components: {
    },
    watch: {
        // 监控集合
    },
    props: {
        // 集成父级参数
    },
    beforeCreate() {
        // console.group('创建前状态  ===============》beforeCreate');
    },
    created() {
        // console.group('创建完毕状态===============》created');
    },
    beforeMount() {
        // console.group('挂载前状态  ===============》beforeMount');
    },
    mounted() {
        // console.group('挂载结束状态===============》mounted');
        this.$nextTick(function() {
            // console.log('执行完后，执行===============》mounted');
        });
    },
    beforeUpdate() {
        // console.group('更新前状态  ===============》beforeUpdate');
    },
    updated() {
        // console.group('更新完成状态===============》updated');
    },
    beforeDestroy() {
        // console.group('销毁前状态  ===============》beforeDestroy');
    },
    destroyed() {
        // console.group('销毁完成状态===============》destroyed');
    },
    methods: {
        // 方法 集合
        tabChangeFn(o) {
            //重新赋值comid，触发子组件监听器
        },
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style  lang='less' scoped>
.planList{
    .tab-box{
        background: #F5F7FA;
        padding: 15px;
        padding-bottom: 0;
        ul{
            border-radius: 4px 0 0 0;
            overflow: hidden;
            border-left: 1px solid #E6EBF5;
            li{
                background: #F6F9FF;
                border-top: 1px solid #E6EBF5;
                line-height: 35px;
                text-align: center;
                padding:0 15px;
                border-right: 1px solid #E6EBF5;
                border-bottom: 1px solid #E6EBF5;
                &:last-of-type{
                    border-radius: 0 4px 0 0;
                }
            }
            .active{
                background: #fff;
                border-bottom-color: #fff;
                color: #2796FF;
            }
        }
    }
}
</style>
