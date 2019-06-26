<template>
  <div v-transfer-dom>
      <confirm style="padding:0px" v-model="isShowModal"
      :title="selectTilte"
      @on-confirm="onConfirm">
      <checklist :max="checkNumber" label-position="left" :options="selectData" v-model="checklist" @on-change="change"></checklist>
      </confirm>
    </div>
</template>
<script>
import { Checklist, Confirm, TransferDomDirective as TransferDom } from "vux";
export default {
  components: {
    Confirm,
    Checklist,
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      checkFilter: [],
      checklist:[],
      isShowModal:false,
      checkNumber:100,
    };
  },
  props: {
    selectTilte: String,
    selectData: Array,
    selectType:String,
  },
  methods: {
    onConfirm() {
       let checklist = this.checklist
      if(checklist.length < 1){
        switch (this.selectType){
        case 'radio' :
        checklist.push(this.selectData[0])
        break
        case 'checkbox' :
        checklist = [...this.selectData]
        break
        default:
        checklist = [...this.selectData]
      }
      }
      this.$emit('selectHandle',checklist)
    },
    change() {
    },
    showMadal(){
      switch (this.selectType){
        case 'radio' :
        this.checkNumber = 1
        break
        case 'checkbox' :
        this.checkNumber = 100
        break
        default:
        this.checkNumber = 100 //默认为checkbox
      }
      this.isShowModal = true;
    }
  }
};
</script>
<style >
.weui-dialog__bd {
  padding: 0 !important;
}
.weui-dialog__hd {
  padding: 0.5em 1.6em 0.5em !important;
}
.weui-cell__bd p {
  text-align: left;
  margin-left: 1.2rem;
  color: black;
}
.weui-cell:before{
  border: 0px !important;
}
</style>
