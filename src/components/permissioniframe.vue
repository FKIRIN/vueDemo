<template>
    <div ref = "tableauViz"></div>
</template>
<script>
export default {
  data() {
    return {
      viz: {},
      workbook: {},
      activeSheet: {},
    };
  },
  props: {
    frameUrl: String,
    filterTitle:String,
    dataFilter:Array
  },
  methods: {
    initializeViz(dataObject) {
      if( this.frameUrl != '' || this.frameUrl ){
      let placeholderDiv = this.$refs.tableauViz
      let url = process.env.TABLEAU_IP + this.frameUrl; // 拼接url
      let options = {
        width: placeholderDiv.offsetWidth,
        height: placeholderDiv.offsetHeight,
        hideTabs: true,
        hideToolbar: true,
        onFirstInteractive: () => {
          this.workbook = this.viz.getWorkbook();
          this.activeSheet = this.workbook.getActiveSheet();
        },
        onFirstVizSizeKnown:(event) =>{
          let placeholderDivHeight = event.getVizSize().sheetSize.maxSize.height;
          placeholderDiv.querySelector('iframe').style.height = placeholderDivHeight+'px'
        }
      };
      if( dataObject ){
        options = {...options, ...dataObject}
      }
       this.viz = new tableau.Viz(placeholderDiv, url, options);
      }
    },
    filterAllData(keyName,dataList) {
      let sheet = this.activeSheet
      sheet.getWorksheets().forEach((ele) => {
        ele.applyFilterAsync(keyName,dataList, tableauSoftware.FilterUpdateType.REPLACE);
      });
    }
  },
  mounted() {
  }
};
</script>
<style>
</style>
