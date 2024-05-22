<template>
  <div>
    <v-container>
      <v-row>
        <v-col v-for="order in orders" :key="order.id">
          <v-card>
            <v-card-title>
              주문번호: {{ order.id }}
            </v-card-title>
            <v-card-text>
              메뉴 이름: {{ order.details.productName }} <br>
              옵션들: 
              <ul>
                <li v-for="option in order.details.option" :key="option">{{ option }}</li>
              </ul>
              포장/매장 여부: {{ order.details.orderType === 0 ? '포장' : '매장' }}
            </v-card-text>
            <v-card-actions>
              <v-btn @click="completeOrder(order.id)">주문 완료</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'OrderReceive',
  computed: {
    ...mapState(['orders'])
  },
  methods: {
    ...mapActions(['completeOrder'])
  }
}
</script>
