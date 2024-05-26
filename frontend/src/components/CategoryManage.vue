<template>
  <v-subheader class = "subheader">카테고리 관리
    <v-btn color="primary" @click="showAddCategory">카테고리 추가</v-btn>
    <v-btn @click="openDialog">새로운 입력창 열기</v-btn>
      <!-- 특정 dialog 열게 하려면 수정좀 해야 할 듯-->

      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title style="display: flex; justify-content: space-between;">
                <div>카테고리 설정</div>
                  <v-btn variant="plain" density="compact" icon="mdi-close" @click="closeDialog"></v-btn>
          </v-card-title>    
          
          <v-container class="my-5">
            <v-form>
              <v-text-field v-model="newCategoryName" class="pd-3"  density="compact" clearable label="카테고리 이름" variant="outlined" append>
                <template v-slot:append>
                  <v-btn @click="addCategory">
                    추가하기
                  </v-btn>
                </template>
              </v-text-field>

              <v-divider></v-divider>
            </v-form>

            <v-form>
              <v-row>
                  <v-col v-for="(category, index) in Categorys" :key="index" cols="12">

                    <v-card :color="getRandomColor()">
                      <div class="d-flex align-center justify-space-between">
                        <div>
                          <v-card-title class="text-h5" append>
                              {{ category.name }}
                          </v-card-title>
                        </div>

                        <div class="mr-1">
                          <v-btn  
                        class="ms-2"
                        size="small"
                        text="START RADIO"
                        variant="outlined"
                        @click="editCategory(category)">
                           수정
                        </v-btn>
                      </div>
                     </div>
                     
                   
                    </v-card>
                  </v-col>
              </v-row>
            </v-form>  
          </v-container>
        
      
          <v-card-actions>
            <v-btn color="primary" @click="saveAndClose">저장</v-btn>
            <!-- 
                아래 버튼은 저장과 같은 기능이라 걍 빼둠
                <v-btn color="error" @click="closeDialog">취소</v-btn>
            -->
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- 카테고리 관리  수정창 -->
      <v-dialog v-model="editDialog" persistent max-width="600px">
      <v-card>
        <v-card-title style="display: flex; justify-content: space-between;">
          <div>카테고리 설정</div>
                  <v-btn variant="plain" density="compact" icon="mdi-close" @click="cancelEdit"></v-btn>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="applyEdit">
            <v-text-field v-model="editedCategoryName" label="카테고리 이름"></v-text-field>
            <div style="display: flex; justify-content: space-between;">
              <div></div>
              <v-btn color="primary" type="submit" @click="updateCategory(selectedCategoryId)">적용</v-btn>
              <v-btn color="error" @click="deleteCategory(selectedCategoryId)">
                삭제 <!-- 삭제 버튼 아이콘 -->
              </v-btn>
            </div>
            
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-subheader>
  <v-divider></v-divider>

    <v-text-field
      v-model="search"
      label="Search"
      solo-inverted
      hide-details
      @input="searchItems"
    ></v-text-field>

  <v-form>

  </v-form>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">카테고리명</th>
        <th class="text-left">키오스크 적용 여부</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in Categorys" :key="item.name">
        <td>
          <div>{{ item.name }}</div>
        </td>
        <td> <v-switch v-model="item.isOn" color="green" @change="updateSwitch(item.id, item.isOn)"></v-switch> </td>
        <!-- <td> {{ item.id }}</td> -->
      </tr>
    </tbody>
  </v-table>

  <v-slide-x-transition>
    <v-bottom-navigation v-if="isDataChanged" :value="value">
      <v-btn icon @click="saveTotalChange(Categorys)">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
      <v-btn icon @click="closeBottom()">
        <v-icon>mdi-undo</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-slide-x-transition>
  

  </template>
  
  <script>
  //import {CategoryData}from "@/data/PageCategory.js"
  import { isEqual } from 'lodash';
  //import { mapActions, mapGetters } from 'vuex';
  export default {

    data() {
      return {
        search: '', //검색창 필드에 드가는 이름
        newCategoryName: '', //텍스트 필드에 드가는 이름
        isDataChanged: false, // 변경 여부
        //Categorys: CategoryData, //js가 아니라 이제 store.js에서 사용
        dialog: false,
        selectedCategoryId: null,
        editedCategoryName: '',
        editDialog: false,
      };
    },

    async created() {
      // 데이터를 비동기적으로 로드
      /*
      try {
        this.Categorys = await CategoryData;
        // 데이터 로드 후에 watch를 설정하거나, 데이터가 변경되는 시점에 watch를 실행할 수 있습니다.
        // 예를 들어, watch 설정은 여기에서 수행할 수 있습니다.
      } catch (error) {
        console.error('Failed to load data:', error);
      }*/

      // 아래는 DB에서 기본 데이터 가져오기, 적용 시 다시 가져오려면 이것을 다시 쓸 예정
      this.$store.dispatch('fetchCategorys')
    },

    watch: { //변경 여부 계속 주시
     
      '$store.state.categoryModule.categorys': {
        handler(newVal, oldVal){
          console.log(newVal, oldVal)
          console.log(isEqual(newVal, oldVal))
          
          if (isEqual(newVal, oldVal)==true) {
            console.log('Categorys 데이터가 변경되었습니다:', newVal);
            this.isDataChanged = true;
          }else{
            //
            this.isDataChanged = false;
          }
          //this.isDataChanged = true;
        },
        deep: true //세부 요소 감시
      }
      
    },

    computed:{
      //...mapGetters('categoryModule', ['Categorys', 'activeCategories']),
      
      Categorys() {
       //return this.$store.state.categorys;
       return this.$store.state.categoryModule.categorys;
      },

      //아래는 활용여부 미정
      allCategories() {
          return this.$store.getters.categoryModule.allCategories;
      },
      getCategoryById(){
          return this.$store.getters.categoryModule.getCategoryById;
      },
      activeCategories() {
          return this.$store.getters.categoryModule.activeCategories;
      },
    },
   
    methods: {
      /*
      ...mapActions('categoryModule', [
        'fetchCategorys',
        'addCategory',
        'deleteCategory',
        'updateCategory',
        'applyCategory',
        'cancelCategory',
      ]),*/

      addCategory() {
        if (this.newCategoryName.trim() !== '') {
            const newCategory = { id: this.Categorys.length + 1, name: this.newCategoryName, alias: '', isOn: true }; // 예시 데이터
            //DB에 auto increase가 있어도 직접 넣어줘야 오류가 안생김
            this.$store.dispatch('addCategory', newCategory);
            //alert(newCategory.id);
            this.newCategoryName = ''; // 입력창 초기화
        }
      },

      deleteCategory(selectedCategoryId) {
        const id = selectedCategoryId;
        //alert(selectedCategoryId);
          this.$store.dispatch('deleteCategory', id);

          this.editedCategoryName = '';
          this.editDialog = false;
      },

      updateCategory(selectedCategoryId) {
        if (this.editedCategoryName.trim() !== '') {
          const newName = this.editedCategoryName;
          const newAlias = '';
          const editedId = selectedCategoryId;
          //alert(editedId);
          this.$store.dispatch('updateCategory', { id: editedId, name: newName, alias: newAlias});
          
          this.editedCategoryName = '';
          this.editDialog = false; // 수정 다이얼로그 닫기
        }else{
          alert('입력 예외');
        }
      },
      replaceCategories(newCategories) {
          this.$store.dispatch('replaceCategorys', newCategories);
      },

      searchItems() {
        //검색기능 구현 예정
      },
      showAddCategory(){
          //추가 화면도은 아래에서 사용 예정
      },
      //버튼 기능 추가 바람
      openDialog() {
        this.dialog = true;
      },
      closeDialog() {
        this.dialog = false;
      },
      saveAndClose() {
        // 저장 로직을 form에 구현해야 하나 생각중
        this.closeDialog();
      },

      getRandomColor() {
        // 랜덤한 색상 반환하는 메소드
        //return '#' + Math.floor(Math.random()*16777215).toString(16);
        return 'success'
      },

      updateSwitch(editedId, changedState) {
        //isOn == !isOn;
        //this.isDataChanged = true;
        console.log(`카테고리 ID ${editedId}의 스위치 상태가 변경되었습니다. 새로운 상태: ${!changedState}`);
        console.log(editedId)
        this.$store.dispatch('toggleCategory', { id: editedId , isOn: changedState} );
        // 아님 서버로 요청하는 로직 작성
        //이거 store에 switch를 안쓰는듯
      },
      
      editCategory(category) {
        /*
        this.editedCategoryId = category.id;
        this.editedCategoryName = this.Categorys.find(cat => cat.id === id).name;
        this.editDialog = true;*/
        this.selectedCategoryId = category.id;
        this.editedCategoryId = category.id;
        this.editedCategoryName = category.name;
        this.editDialog = true;
      },

      applyEdit() {
        const editedCategory = this.Categorys.find(cat => cat.id === this.editedCategoryId);
        editedCategory.name = this.editedCategoryName;
        this.editDialog = false;
        this.editedCategoryId = null;
        this.editedCategoryName = '';
      },

      cancelEdit() {
        this.editDialog = false;
        this.editedCategoryId = null;
        this.editedCategoryName = '';
      },

        saveTotalChange(newCategory){
          //CategoryData.splice(0, CategoryData.length, ...this.Categorys);
          this.$store.dispatch('applyCategory', newCategory);
          alert('데이터 변경 적용 완료')
          this.isDataChanged = false;
        },

        closeBottom(){
          this.$store.dispatch('cancelCategory');
          alert('데이터 변경 취소!')
          this.isDataChanged = false;
        },

      },

  };
  </script>

  <!--제목줄 스타일-->
<style scoped>
.subheader {
  font-size: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /*버튼의 스타일도 여기에 넣어서 따로 분리할 예정 */
}

</style>