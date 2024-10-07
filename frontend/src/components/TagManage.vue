<template>
  <v-subheader class="subheader"
    >옵션(태그) 관리
    <v-btn color="primary" @click="addTagDialog = true">옵션 추가</v-btn>
  </v-subheader>

  <!--메인 페이지-->
  <v-divider></v-divider>

  <v-text-field
    v-model="search"
    label="Search"
    solo-inverted
    hide-details
    @input="searchItems"
  ></v-text-field>

  <v-table>
    <thead>
      <tr>
        <th class="text-left">옵션명</th>
        <th class="text-left">키오스크 적용 여부</th>
        <th class="text-left">필수 선택 여부</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in Tags" :key="item.name">
        <td>
          <div>{{ item.name }}</div>
        </td>
        <td>
          <v-switch
            v-model="item.isOn"
            color="green"
            @change="isOnSwitch(item.id, item.isOn)"
          ></v-switch>
        </td>
        <td>
          <v-switch
            v-model="item.isRequired"
            color="green"
            @change="requireSwitch(item.id, item.isRequired)"
          ></v-switch>
        </td>
        <!-- <td>옵션버튼 추가 예정</td> -->
      </tr>
    </tbody>
  </v-table>

  <v-slide-x-transition>
    <v-bottom-navigation v-if="isDataChanged" :value="value">
      <v-btn icon @click="saveTotalChange(Tags)">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
      <v-btn icon @click="closeBottom()">
        <v-icon>mdi-undo</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-slide-x-transition>

  <!--태그 관리창-->
  <v-dialog v-model="addTagDialog" persistent max-width="600px">
    <v-card>
      <v-card-title style="display: flex; justify-content: space-between">
        태그 추가하기
        <v-btn
          variant="plain"
          density="compact"
          icon="mdi-close"
          @click="addTagDialog = false"
        ></v-btn>
      </v-card-title>

      <v-container class="my-5">
        <v-form>
          <div>
            <v-text-field
              v-model="newTagName"
              class="pd-3"
              density="compact"
              clearable
              label="태그 이름"
              variant="outlined"
              append
            >
            </v-text-field>

            <v-text-field
              v-model="newAliasName"
              class="pd-3"
              density="compact"
              clearable
              label="태그 별칭"
              variant="outlined"
              append
            >
            </v-text-field>

            <v-textarea
              v-model="newDescription"
              class="pd-3"
              density="compact"
              clearable
              label="태그 설명"
              variant="outlined"
              append
            >
            </v-textarea>
          </div>
          <v-btn @click="addTag"> 추가하기 </v-btn>

          <div></div>
          <v-divider></v-divider>
        </v-form>

        <v-form>
          <v-row>
            <v-col v-for="(tag, index) in Tags" :key="index" cols="12">
              <v-card color="green">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <v-card-title class="text-h5" append>
                      {{ tag.name }}
                    </v-card-title>
                  </div>

                  <div class="mr-1">
                    <v-btn
                      class="ms-2"
                      size="small"
                      text="START RADIO"
                      variant="outlined"
                      @click="openEditTag(tag)"
                    >
                      수정
                    </v-btn>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>

  <!--태그의 옵션 관리창 -->
  <v-dialog v-model="editTagDialog" persistent max-width="600px">
    <v-card>
      <v-card-title style="display: flex; justify-content: space-between">
        <div>카테고리 설정</div>
        <v-btn
          variant="plain"
          density="compact"
          icon="mdi-close"
          @click="closeEditTag()"
        ></v-btn>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="applyEditTag">
          <v-text-field
            v-model="editedTagName"
            class="pd-3"
            density="compact"
            clearable
            label="태그 이름"
            variant="outlined"
            append
          >
          </v-text-field>
          <v-text-field
            v-model="editedTagAlias"
            class="pd-3"
            density="compact"
            clearable
            label="태그 별칭"
            variant="outlined"
            append
          >
          </v-text-field>
          <v-textarea
            v-model="editedTagDescription"
            class="pd-3"
            density="compact"
            clearable
            label="태그 설명"
            variant="outlined"
            append
          >
          </v-textarea>

          <div style="display: flex; justify-content: space-between">
            <div></div>
            <v-btn
              color="primary"
              type="submit"
              @click="updateTag(selectedTagId)"
              >적용</v-btn
            >
            <v-btn color="error" @click="deleteEditTag(selectedTagId)">
              삭제
              <!-- 삭제 버튼 아이콘 -->
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
//import AddTagDialog from '@/components/AddTagDialog.vue';
import { isEqual } from "lodash";

export default {
  /*
      //사실 이쁜건 프론트가 예쁘면 되니깐 여긴 컴포넌트 일단 안가져옴
      components: {
        AddTagDialog // AddTagDialog 컴포넌트를 사용하기 위해 등록합니다.
      },
      */
  data() {
    //언젠간 컴포넌트로 분류할 예정
    return {
      search: "",
      //태그
      addTagDialog: false, //태그 추가창
      editTagDialog: false,
      newTagName: "",
      newAliasName: "",
      newDescription: "",
      //태그 수정
      selectedTagId: null,
      //editedTagId: null,
      editedTagName: "",
      editedTagAlias: "",
      editedTagDescription: "",
      //상세옵션
      optionDialog: false, // 태그 설정(옵션 창)
      editDialog: false, //태그 옵션 설정
      //기타
      isDataChanged: false,
    };
  },

  async created() {
    //생성 시 데이터 로드
    this.$store.dispatch("fetchTags");
  },

  watch: {
    //상세 변경 주시
    "$store.state.tagModule.tags": {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal);
        console.log(isEqual(newVal, oldVal));
        /*
            if (isEqual(newVal, oldVal)==true) {
              console.log('tag 데이터가 변경되었습니다:', newVal);
              this.isDataChanged = true;
            }else{
              //
              this.isDataChanged = false;
            }*/
        this.isDataChanged = true;
      },
      deep: true, //세부 요소 감시
    },
  },

  computed: {
    Tags() {
      return this.$store.state.tagModule.tags;
    },

    //검색기능을 이걸로 연결시킬까 고민중
    //getTagByName(){},
  },

  methods: {
    searchItems() {
      //검색기능 구현 예정
    },
    showAddTag() {
      //추가 화면도... 구현 예정
    },

    addTag() {
      //현재 form 태그 추가하기
      if (this.newTagName.trim() !== "" && this.newAliasName.trim() !== "") {
        const newTag = {
          id: this.Tags.length + 1,
          name: this.newTagName,
          alias: this.newAliasName,
          description: this.newDescription,
          isOn: true,
          isRequired: false,
        }; // 예시 데이터
        //DB에 auto increase가 있어도 직접 넣어줘야 오류가 안생김
        this.$store.dispatch("addTag", newTag);
        //alert(newCategory.id);
        this.newTagName = ""; // 입력창 초기화
        this.newAliasName = "";
        this.newDescription = "";
      }
    },

    clearEditTag() {
      this.editedTagyId = null;
      // this.editedTagName = "";
      // this.editedTagAlias = "";
      // this.editedTagDescription = "";
      //this.editTagDialog = false;
    },

    openEditTag(tag) {
      this.selectedTagId = tag.id;
      // this.editedTagId = tag.id;
      this.editedTagName = tag.name;
      this.editedTagAlias = tag.alias;
      this.editedTagDescription = tag.description;
      this.editTagDialog = true;
    },

    closeEditTag() {
      this.clearEditTag();
      this.editTagDialog = false;
    },

    updateTag(selectedTagId) {
      if (this.editedTagName.trim() !== "") {
        const newName = this.editedTagName;
        const newAlias = this.editedTagAlias;
        const newDescription = this.editedTagDescription;
        const editedId = selectedTagId;
        //alert(editedId);
        this.$store.dispatch("updateTag", {
          id: editedId,
          name: newName,
          alias: newAlias,
          description: newDescription,
        });

        this.clearEditTag();
        this.editTagDialog = false;
      } else {
        alert("입력 예외");
      }
    },

    isOnSwitch(editedId, changedState) {
      //표시여부스위치 활성화
      console.log(
        `Tag ID ${editedId}의 스위치 상태가 변경되었습니다. 새로운 상태: ${!changedState}`
      );
      console.log(editedId);
      this.$store.dispatch("toggleIsOn", { id: editedId, isOn: changedState });
    },

    requireSwitch(editedId, changedState) {
      //필수여부 스위치 활성화
      console.log(
        `Tag ID ${editedId}의 스위치 상태가 변경되었습니다. 새로운 상태: ${!changedState}`
      );
      console.log(editedId);
      this.$store.dispatch("toggleRequired", {
        id: editedId,
        isRequired: changedState,
      });
    },

    deleteEditTag(selectedTagId) {
      const id = selectedTagId;
      //alert(selectedTagId);
      this.$store.dispatch("deleteTag", id);
      this.editTagDialog = false;
      this.clearEditTag();
    },

    applyEditTag() {
      const editedTag = this.Tags.find((cat) => cat.id === this.selectedTagId);
      editedTag.name = this.editedTagName;
      editedTag.alias = this.editedTagAlias;
      editedTag.description = this.editedTagDescription;

      this.clearEditTag();
      this.editTagDialog = false;
    },

    replaceTag() {},

    //상세 옵션 다루기 창
    addOption() {},

    deleteOption() {},

    updateOption() {},

    setTag() {
      //태그 다시 가져오기
    },

    //바닥 표시창(저장여부)
    saveTotalChange(newTag) {
      this.$store.dispatch("applyTag", newTag);
      alert("데이터 변경 적용 완료");
      this.isDataChanged = false;
    },
    closeBottom() {
      this.$store.dispatch("cancelTag");
      alert("데이터 변경 취소!");
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
