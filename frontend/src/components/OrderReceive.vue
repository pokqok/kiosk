<template>
  <div>
    <v-container>
      <audio
        ref="cashRequestAudio"
        src="/assets/현금요청.mp3"
        type="audio/mp3"
      ></audio>
      <v-row>
        <v-col v-for="order in orders" :key="order.id" cols="12" md="6" lg="4">
          <v-card class="mb-4">
            <v-card-title>
              <span class="headline">주문번호: {{ order.id }}</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="toggleOrder(order.id)">
                <v-icon>{{
                  order.minimized ? "mdi-chevron-down" : "mdi-chevron-up"
                }}</v-icon>

              </v-btn>
              <v-btn icon @click="confirmResetSingleOrder(order.id)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text v-if="!order.minimized">
              <div v-if="order.details">

                <div>
                  <strong>총 가격:</strong> {{ order.details.totalPrice }}원
                </div>
                <div>
                  <strong>옵션들:</strong>
                  <div
                    v-for="product in order.details.products"
                    :key="product.productName"
                    class="product-info"
                  >
                    <div class="product-name">
                      {{ product.productName }} - {{ product.productPrice }}원
                    </div>
                    <ul>
                      <li
                        v-for="option in product.option"
                        :key="option.optionId"
                      >
                        {{ option.optionName }} ({{ option.optionPrice }}원)
                      </li>
                    </ul>
                  </div>
                </div>
                <div>
                  <strong>포장/매장 여부:</strong>
                  {{ order.details.orderType === 0 ? "포장" : "매장" }}
                </div>
                <div>
                  <strong>상태:</strong> {{ order.status }}
                  <span v-if="order.paymentMethod === 'cash'" class="cash-tag"
                    >현금결제</span
                  >
                </div>
              </div>
              <div v-else>
                <p>주문 세부 정보가 없습니다.</p>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="green darken-1"
                @click="completeOrder(order.id)"
                v-if="order.status === 'pending'"
              >
                주문 완료
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-btn color="blue darken-1" @click="logOrders"
        >주문 데이터 콘솔 출력</v-btn
      >
      <v-btn color="red darken-1" @click="confirmResetAllOrders"
        >모든 주문 초기화</v-btn
      >
    </v-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "OrderReceive",
  computed: {
    ...mapState(["orders"]),
  },
  watch: {
    orders: {
      handler(newOrders, oldOrders) {
        const oldCashOrders = oldOrders.filter(
          (order) => order.paymentMethod === "cash"
        ).length;
        const newCashOrders = newOrders.filter(
          (order) => order.paymentMethod === "cash"
        ).length;

        if (newCashOrders > oldCashOrders) {
          this.playCashRequestAudio();
        }
      },
      deep: true,
    },
  },
  created() {
    window.addEventListener('storage', this.syncOrders);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.syncOrders);
  },
  methods: {
    ...mapMutations([
      "completeOrder",
      "resetOrders",
      "resetSingleOrder",
      "setOrders",
    ]),
    logOrders() {
      console.log(this.orders);
    },
    toggleOrder(orderId) {
      const order = this.orders.find((order) => order.id === orderId);
      if (order) {
        order.minimized = !order.minimized;
      }
    },
    confirmResetSingleOrder(orderId) {
      if (confirm("정말 이 주문을 초기화하시겠습니까?")) {
        this.resetSingleOrder(orderId);
      }
    },
    confirmResetAllOrders() {
      if (confirm("정말 모든 주문을 초기화하시겠습니까?")) {
        this.resetOrders();
      }
    },
    syncOrders(event) {
      if (event.key === "orders") {
        this.setOrders(JSON.parse(event.newValue));
      }
    },
    playCashRequestAudio() {
      const audio = this.$refs.cashRequestAudio;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
    },
  },
};
</script>

<style scoped>
.headline {
  font-weight: bold;
}

.product-info {
  margin-bottom: 10px;
}
.product-name {
  font-weight: bold;
}
.cash-tag {
  background-color: #ffeb3b;
  color: #000;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 10px;
}

</style>
