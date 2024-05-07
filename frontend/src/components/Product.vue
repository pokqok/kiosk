<template>
  <div class="product" @click="$emit('selectProduct', product)">
    <div class="product-img-container">
      <img class="product-img" :src="product.image" alt="" />
    </div>
    <div class="product-info">
      <p class="product-name">{{ product.name }}</p>
      <p class="product-price">{{ product.price }} 원</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductItem",

  props: {
    product: Object,
  },
};
</script>

<style>
.product {
  background-color: white;
  border: 1px solid #e1e1e1;
  margin: 4%;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  cursor: pointer;
}

.product:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.product-img-container {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
}

.product-img {
  max-width: 80%;
  max-height: 80%;
}

.product-info {
  padding: 10px;
}

.product-name {
  font-weight: bold;
  color: #333;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  color: #666;
  margin: 5px 0 0;
}
</style>
