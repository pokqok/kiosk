<template>
    <div>
      <v-container>
        <h2>매출 내역</h2>
        <v-btn-toggle v-model="activeTab" mandatory>
          <v-btn value="daily">일별</v-btn>
          <v-btn value="weekly">주별</v-btn>
          <v-btn value="monthly">월별</v-btn>
        </v-btn-toggle>
  
        <v-card v-if="activeTab === 'daily'">
          <v-card-title>일별 매출 내역</v-card-title>
          <v-data-table :headers="headers" :items="dailySales" class="elevation-1">
            <template v-slot:[`item.details`]="{ item }">
              <v-expand-transition>
                <v-card flat v-if="item.showDetails">
                  <v-card-text>
                    <h3>Top 3 인기 메뉴</h3>
                    <ol>
                      <li v-for="(menu, index) in item.top3" :key="index">{{ menu.productName }} ({{ menu.count }}개)</li>
                    </ol>
                    <div v-for="(product, index) in item.productsSorted" :key="index" class="product-info">
                      <div class="product-name">{{ product.productName }} - {{ product.productPrice }}원 ({{ product.count }}개)</div>
                      <ul>
                        <li v-for="(option, index) in product.option" :key="index">
                          {{ option.tagName }}: {{ option.optionName }} ({{ option.optionPrice }}원)
                        </li>
                      </ul>
                    </div>
                    <div><strong>포장/매장 여부:</strong> {{ item.orderType === 0 ? '포장' : '매장' }}</div>
                    <div><strong>총 가격:</strong> {{ item.total }}원</div>
                  </v-card-text>
                </v-card>
              </v-expand-transition>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn @click="toggleDetails(item)">상세 보기</v-btn>
              <v-btn color="red" @click="deleteSalesRecord(item.key)">삭제</v-btn>
            </template>
          </v-data-table>
        </v-card>
  
        <v-card v-if="activeTab === 'weekly'">
          <v-card-title>주별 매출 내역</v-card-title>
          <v-data-table :headers="headers" :items="weeklySales" class="elevation-1">
            <template v-slot:[`item.details`]="{ item }">
              <v-expand-transition>
                <v-card flat v-if="item.showDetails">
                  <v-card-text>
                    <h3>Top 3 인기 메뉴</h3>
                    <ol>
                      <li v-for="(menu, index) in item.top3" :key="index">{{ menu.productName }} ({{ menu.count }}개)</li>
                    </ol>
                    <div v-for="(product, index) in item.productsSorted" :key="index" class="product-info">
                      <div class="product-name">{{ product.productName }} - {{ product.productPrice }}원 ({{ product.count }}개)</div>
                      <ul>
                        <li v-for="(option, index) in product.option" :key="index">
                          {{ option.tagName }}: {{ option.optionName }} ({{ option.optionPrice }}원)
                        </li>
                      </ul>
                    </div>
                    <div><strong>포장/매장 여부:</strong> {{ item.orderType === 0 ? '포장' : '매장' }}</div>
                    <div><strong>총 가격:</strong> {{ item.total }}원</div>
                  </v-card-text>
                </v-card>
              </v-expand-transition>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn @click="toggleDetails(item)">상세 보기</v-btn>
              <v-btn color="red" @click="deleteSalesRecord(item.key)">삭제</v-btn>
            </template>
          </v-data-table>
        </v-card>
  
        <v-card v-if="activeTab === 'monthly'">
          <v-card-title>월별 매출 내역</v-card-title>
          <v-data-table :headers="headers" :items="monthlySales" class="elevation-1">
            <template v-slot:[`item.details`]="{ item }">
              <v-expand-transition>
                <v-card flat v-if="item.showDetails">
                  <v-card-text>
                    <h3>Top 3 인기 메뉴</h3>
                    <ol>
                      <li v-for="(menu, index) in item.top3" :key="index">{{ menu.productName }} ({{ menu.count }}개)</li>
                    </ol>
                    <div v-for="(product, index) in item.productsSorted" :key="index" class="product-info">
                      <div class="product-name">{{ product.productName }} - {{ product.productPrice }}원 ({{ product.count }}개)</div>
                      <ul>
                        <li v-for="(option, index) in product.option" :key="index">
                          {{ option.tagName }}: {{ option.optionName }} ({{ option.optionPrice }}원)
                        </li>
                      </ul>
                    </div>
                    <div><strong>포장/매장 여부:</strong> {{ item.orderType === 0 ? '포장' : '매장' }}</div>
                    <div><strong>총 가격:</strong> {{ item.total }}원</div>
                  </v-card-text>
                </v-card>
              </v-expand-transition>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn @click="toggleDetails(item)">상세 보기</v-btn>
              <v-btn color="red" @click="deleteSalesRecord(item.key)">삭제</v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </div>
  </template>
  
  <script>
  import { groupByDate, groupByWeek, groupByMonth } from "@/utils.js";
  
  export default {
    name: "SalesPage",
    data() {
      return {
        headers: [
          { text: "날짜", value: "date" },
          { text: "총 매출", value: "total" },
          { text: "상세 내역", value: "details", sortable: false },
          { text: "액션", value: "actions", sortable: false }
        ],
        dailySales: [],
        weeklySales: [],
        monthlySales: [],
        activeTab: 'daily'
      };
    },
    methods: {
      loadSalesData() {
        const dailySalesData = groupByDate();
        const weeklySalesData = groupByWeek();
        const monthlySalesData = groupByMonth();
  
        this.dailySales = this.formatSalesData(dailySalesData);
        this.weeklySales = this.formatSalesData(weeklySalesData);
        this.monthlySales = this.formatSalesData(monthlySalesData);
      },
      formatSalesData(salesData) {
        return salesData.map(record => {
          const total = record.data.reduce((sum, order) => sum + order.details.totalPrice, 0);
  
          const productMap = {};
          record.data.forEach(order => {
            order.details.products.forEach(product => {
              const productKey = product.productName + JSON.stringify(product.option);
              if (!productMap[productKey]) {
                productMap[productKey] = { ...product, count: 0 };
              }
              productMap[productKey].count += 1;
            });
          });
  
          const productsSorted = Object.values(productMap).sort((a, b) => b.count - a.count);
          const top3 = productsSorted.slice(0, 3);
  
          return {
            key: record.key,
            date: record.key,
            total,
            products: Object.values(productMap),
            productsSorted,
            top3,
            orderType: record.data[0].details.orderType, // Assuming all orders on the same date have the same order type
            showDetails: false
          };
        }).sort((a, b) => b.total - a.total);
      },
      toggleDetails(item) {
        item.showDetails = !item.showDetails;
      },
      deleteSalesRecord(key) {
        if (confirm('정말 이 매출 기록을 삭제하시겠습니까?')) {
          localStorage.removeItem(key);
          this.loadSalesData();
        }
      }
    },
    mounted() {
      this.loadSalesData();
    }
  };
  </script>
  
  <style scoped>
  .product-info {
    margin-bottom: 10px;
  }
  
  .product-name {
    font-weight: bold;
  }
  </style>
  