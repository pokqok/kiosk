<template>
    <v-dialog v-model="localDialog" max-width="500px" @update:model="updateDialog">
      <v-card>
        <v-card-title>
          <span class="headline">이미지 업로드</span>
        </v-card-title>
  
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-file-input
              v-model="file"
              label="이미지 업로드"
              prepend-icon="mdi-paperclip"
              :rules="fileRules"
              required
            ></v-file-input>
          </v-form>
        </v-card-text>
  
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">취소</v-btn>
          <v-btn color="blue darken-1" text @click="uploadFile">업로드</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import axios from 'axios';

export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    productId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      localDialog: this.dialog,
      valid: true,
      file: null,
      fileRules: [(v) => !!v || '파일을 업로드하세요']
    };
  },
  watch: {
    dialog(val) {
      this.localDialog = val;
    }
  },
  methods: {
    close() {
      this.$emit('close');
      this.localDialog = false;
    },
    async uploadFile() {
      if (this.$refs.form.validate()) {
        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('productId', this.productId);
        formData.append('overwrite', 'true'); // 이미지를 덮어씌울지 여부
        console.log("업로드 파일", this.file);
        console.log("아이디", this.productId);
        
        try {
          const response = await axios.post('http://localhost:3000/image/uploadImage', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          this.$emit('upload-success', response.data);
          this.$store.dispatch('fetchProducts');
          this.close();
        } catch (error) {
          console.error('Error uploading file:', error);
          alert('Error uploading file');
        }
      }
    },
    updateDialog(val) {
      this.$emit('update:dialog', val);
    }
  }
};
</script>

<style scoped>
.headline {
  font-size: 20px;
}
</style>

  