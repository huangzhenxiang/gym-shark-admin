<template>
    <div class="goods-list">
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="android-remove"></Icon>
                        商品列表
                    </p>
                    <div class="edittable-table-height-con">
                        <can-edit-table refs="table" v-model="editInlineData" :columns-list="editInlineColumns"></can-edit-table>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import canEditTable from '@/views/tables/components/canEditTable.vue';
import tableData from '@/views/tables/components/table_data.js';
export default {
    name: 'goods-list',
    components: {
        canEditTable
    },
    data () {
        return {
            editInlineColumns: [],
            editInlineData: []
        };
    },
    methods: {
        getData () {
            this.editInlineColumns = tableData.editInlineColumns;
            this.editInlineData = tableData.editInlineData;
        }
    },
    created () {
        this.getData();
    }
};
</script>
<style lang="less" scoped>
    @import '../../styles/common.less';
    .goods-list{
      .edittable-table-height-con{
        margin-top: 10px;
      }
    }
</style>
