<template>
  <div class="recommend-view">
    <h1>Find the Best Drink for You!</h1>
    <input
      v-model="userInput"
      @keyup.enter="fetchRecommendation"
      placeholder="Enter your preferences (e.g., 'I like something sweet and cold')"
    />
    <button @click="fetchRecommendation">Recommend</button>
    <p v-if="recommendedDrink">
      Recommended Drink: <strong>{{ recommendedDrink }}</strong>
    </p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userInput: "",
      recommendedDrink: null,
      drinks: [
        {
          name: "아이스 아메리카노",
          description: "진한 맛과 산미가 특징, 시원하게 즐길 수 있음",
          keywords: ["strong", "acidic", "no sweetness", "coffee", "cold"],
        },
        {
          name: "바닐라 라떼",
          description: "부드럽고 달콤한 맛, 바닐라 향이 감도는 음료",
          keywords: ["smooth", "sweet", "vanilla", "coffee", "hot"],
        },
        {
          name: "카라멜 마키아토",
          description: "달콤한 카라멜과 부드러운 밀크의 완벽한 조화",
          keywords: ["sweet", "caramel", "milk", "coffee", "hot"],
        },
        {
          name: "그린 티 라떼",
          description:
            "고소한 맛과 풍부한 그린티의 향, 건강하게 즐기기 좋은 선택",
          keywords: ["nutty", "green tea", "low sweetness", "no coffee", "hot"],
        },
        {
          name: "에스프레소",
          description: "깊고 강렬한 풍미, 커피 본연의 맛을 느낄 수 있음",
          keywords: ["deep", "intense", "no sweetness", "coffee", "hot"],
        },
        {
          name: "콜드 브루",
          description: "부드러우면서도 강한 카페인, 산미가 적고 맛이 깊은 커피",
          keywords: [
            "smooth",
            "strong caffeine",
            "low acidity",
            "optional sweetness",
            "coffee",
            "cold",
          ],
        },
        {
          name: "플랫 화이트",
          description: "진하고 크리미한 스팀 밀크와 에스프레소의 완벽한 조화",
          keywords: ["rich", "creamy", "low sweetness", "coffee", "hot"],
        },
        {
          name: "모카 라떼",
          description: "초콜릿 시럽을 추가하여 달콤하고 향긋한 커피 음료",
          keywords: ["chocolate", "sweet", "coffee", "hot"],
        },
        {
          name: "마끼아토",
          description:
            "에스프레소 위에 조금의 우유 거품을 더한 이탈리아식 커피",
          keywords: ["espresso", "milk foam", "no sweetness", "coffee", "hot"],
        },
        {
          name: "아이스 티",
          description:
            "다양한 향의 티를 시원하게 즐길 수 있으며, 여름에 인기 많은 음료",
          keywords: [
            "various flavors",
            "optional sweetness",
            "no coffee",
            "cold",
          ],
        },
        // Add all other drinks here
      ],
    };
  },
  methods: {
    async fetchRecommendation() {
      try {
        const response = await axios.post("/recommend-drink", {
          userInput: this.userInput,
          drinks: this.drinks,
        });
        this.recommendedDrink = response.data.recommendedDrink;
      } catch (error) {
        console.error("Failed to get recommendation:", error);
        this.recommendedDrink = "Error: Could not retrieve any data.";
      }
    },
  },
};
</script>

<style scoped>
.recommend-view {
  text-align: center;
  padding: 20px;
}
</style>
