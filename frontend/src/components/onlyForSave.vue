<template></template>

<v-card>
    <v-card-title>새로운 입력창</v-card-title>
    <v-card-text>
      <div>
          <v-text-field clearable label="카테고리명" variant="outlined"></v-text-field>
          <v-btn
            :disabled="!form"
            :loading="loading"
            color="success"
            size="large"
            type="submit"
            variant="elevated"
            block
          >
            적용
          </v-btn>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="saveAndClose">저장</v-btn>
      <v-btn color="error" @click="closeDialog">취소</v-btn>
    </v-card-actions>
  </v-card>
