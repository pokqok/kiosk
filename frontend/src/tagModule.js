import axios from "axios";

const HOST = "http://localhost:3000";

const tagModule = {
  state() {
    return {
      tags: [],
      // [{ id: 1, name: '태그 1' ,description: '설명', alias: 'tag1', isOn: falsem isRequired,},];
    };
  },

  mutations: {
    //태그 표시 여부
    toggleIsOn(state, TagId) {
      const Tag = state.tags.find((cat) => cat.id === TagId);
      if (Tag) {
        let switchOn = Tag.isOn;
        Tag.isOn = switchOn;
        //바꾸지 않은 이유는, v-switch에 모델을 설정해주면, 이벤트 함수 설정 없이도 switch를 누르면 값이 바뀐다.
      }
    },
    //필수 여부
    toggleRequired(state, TagId) {
      const Tag = state.tags.find((cat) => cat.id === TagId);
      if (Tag) {
        let switchOn = Tag.isRequired;
        Tag.isRequired = switchOn;
        //바꾸지 않은 이유는, v-switch에 모델을 설정해주면, 이벤트 함수 설정 없이도 switch를 누르면 값이 바뀐다.
      }
    },
    //DB에서 태그 업데이트
    setTags(state, Tags) {
      state.tags = Tags; // 카테고리 데이터 업데이트
    },

    //새로고침할 시,
    changeTags(state, newTags) {
      state.tags = newTags;
    },

    //태그 생성
    addTag(state, newTag) {
      if (newTag.name.trim() !== "") {
        //+1하는 걸 vue에서 하도록 바꿈, 10단위로 올라가는 문제가 자꾸 생김
        state.tags.push(newTag);
        console.log("추가 내용:",newTag)
      }
    },

    //태그 변경
    updateTag(state, { id, name, alias, description }) {
      const TagToUpdate = state.tags.find((Tag) => Tag.id == id);
      if (TagToUpdate) {
        TagToUpdate.name = name;
        TagToUpdate.alias = alias;
        TagToUpdate.description = description;
        //TagToUpdate.description = description;
      }
      //vue에서 사용법 (함수 내에서 )= this.$store.commit('updateTag', { id: 1, newName: '새로운 이름', newAlias: '새로운 별칭' });
    },

    //태그 삭제
    deleteTag(state, id) {
      const indexToDelete = state.tags.findIndex((Tag) => Tag.id === id);
      if (indexToDelete !== -1) {
        // 선택한 id의 카테고리 삭제
        state.tags.splice(indexToDelete, 1);
      }
    },

    //밑에 더 추가 바람
  },

  actions: {
    async fetchTags({ commit }) {
      // try {
      //   const response = await axios.get("/tag/getTag");

      //   let TagData = [];
      //   // 응답에서 카테고리 데이터 추출
      //   const responseData = response.data;

      //   responseData.forEach((item) => {
      //     // 원하는 형태로 변환하여 객체 생성
      //     const setTag = {
      //       id: item.TagNO,
      //       name: item.TagName,
      //       alias: item.TagAlias,
      //       description: item.TagDet,
      //       isRequired: item.IsRequired == 1 ? true : false,
      //       isOn: item.IsOn == 1 ? true : false,
      //       //mariaDB는 1/0 으로 저장하기에 이렇게 지속적인 변경이 필요하다.
      //     };
      //     TagData.push(setTag);
      //   });
      //   // 받아온 카테고리 데이터를 저장하기 위해 mutation 호출
      //   commit("setTags", TagData);
      // } catch (error) {
      //   console.error("카테고리 데이터를 불러오는 중 오류 발생:", error);
      // }

      try {
        const response = await axios.get(HOST+"/tag/getTag");
        const responseData = response.data;
        commit("setTags", responseData);
      } catch (error) {
        console.error("태그 데이터를 불러오는 중 오류 발생:", error);
      }
    },
    //카테고리 추가
    async addTag({commit}, newTag) {
      try {
        // // 서버에 카테고리 추가 요청 보내기
        // await axios.post("/tag/addTag", {
        //   TagId: newTag.id,
        //   TagName: newTag.name,
        //   TagAlias: newTag.alias,
        //   TagDescription: newTag.description,
        // });

        // // DB에 추가하면 이제 여기 store(웹페이지)에서에 데이터 추가도 적용
        // console.log(newTag.name + "추가 성공");
        commit("addTag", newTag);
      } catch (error) {
        console.error("카테고리 추가 중 오류 발생:", error);
      }
      //context.commit('addTag', newTag);
    },

    async deleteTag({commit}, id) {
      try {
        // 서버에 카테고리 삭제 요청 보내기
        // alert("id: " + id);
        // await axios.post("/tag/deleteTag", { TagId: id });

        // DB에 추가하면 이제 여기 store에도 적용
        commit("deleteTag", id);
      } catch (error) {
        console.error("카테고리 삭제 중 오류 발생:", error);
      }
      //context.commit('deleteTag', id);
    },

    async updateTag({commit}, { id, name, alias, description }) {
      try {
        //{ id: editedId, name: newName, alias: newAlias, description: newDescription}
        // alert("이름: " + name + "id: " + id);
        // await axios.post("/tag/updateTag", {
        //   TagId: id,
        //   TagName: name,
        //   TagAlias: alias,
        //   TagDescrption: description,
        // });

        // 변경 성공 시 스토어 상태 업데이트
        commit("updateTag", { id, name, alias, description });
      } catch (error) {
        console.error("카테고리 변경 중 오류 발생:", error);
      }
      // context.commit('updateTag', { id, newName, newAlias });
    },

    // 카테고리 적용,
    async applyTag({commit}, newTags) {
      // 카테고리 데이터 교체 뮤테이션 호출
      try {
        await axios.post(HOST+"/tag/apply", newTags);
        commit("changeTags", newTags);
      } catch (error) {
        console.error("태그 업데이트 중 오류 발생:", error);
      }
      //context.commit('applyTag', newTags);
    },

    //카테고리 적용 취소, 다 rollback하고 다시 DB에서 가져온다.
    async cancelTag(context) {
      try {
        // 서버에 카테고리 취소 요청 보내기
        await axios.post("/tag/cancel");
        // 취소 성공 시 다시 DB에서 가져와서 초기화하기
        context.dispatch("fetchTags");
      } catch (error) {
        console.error("카테고리 취소 중 오류 발생:", error);
      }
    },

    async toggleIsOn(context, { id, isOn }) {
      try {
        // 서버에 카테고리 취소 요청 보내기
        console.log("toggleIsOn action called with id:", id, "isOn:", isOn);

        await axios.post("/tag/toggleIsOn", { TagId: id, TagOn: isOn });
        // 취소 성공 시 다시 DB에서 가져와서 초기화하기

        context.commit("toggleIsOn", id);
      } catch (error) {
        console.error("표시 스위칭 중 오류 발생:", error);
      }
    },

    async toggleRequired(context, { id, isRequired }) {
      try {
        // 서버에 카테고리 취소 요청 보내기
        console.log(isRequired);
        await axios.post("/tag/toggleRequired", {
          TagId: id,
          TagOn: isRequired,
        });
        // 취소 성공 시 다시 DB에서 가져와서 초기화하기
        context.commit("toggleRequired", id);
      } catch (error) {
        console.error("필수 스위칭 중 오류 발생:", error);
      }
    },
  },

  getters: {
    // 모든 카테고리 반환
    allTags: (state) => state.tags,

    /*
        // 특정 이름을 가진 카테고리 반환
        getTagByName: (state) => (name) => {
            return state.tags.find(Tag => Tag.name === name);
        },
        */
  },
};

export default tagModule;
