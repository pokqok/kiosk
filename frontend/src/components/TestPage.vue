<template>
    <div class="test-page">
        <!-- File Upload Form -->
        <form @submit.prevent="uploadFile">
            <div>
                <input type="file" name="uploaded_file" id="uploaded_file" @change="handleFileUpload($event)">
                <input type="text" placeholder="Number of speakers" @change="handleNumSpeakers($event)">
                <button type="submit">Upload and Analyze</button>
                <AudioRecord />
            </div>
        </form>

        <ul>
            <li v-for="msg in messages" :key="msg">{{ msg }}</li>
        </ul>
        <!-- Message Input and Send Button -->
        <input v-model="message" autocomplete="off">
        <button @click="sendMessage">Send</button>

        <!-- Recognition Result Display -->
        <div v-if="showResult" style="margin-top: 20px; padding: 10px; background-color: #f0f0f0; border-radius: 5px;">
            <span>{{ resultText }}</span>
        </div>

        <div>
            <!-- 상품 이름 입력 -->
            <input type="text" @change="handleProductName" placeholder="상품 이름">
            <!-- 상품 금액 입력 -->
            <input type="number" @change="handleProductAmount" placeholder="상품 금액">
            <button @click="requestPay" :disabled="productAmount < 100">결제하기</button>
            <button @click="requestPayKakao" :disabled="productAmount < 100">카카오페이</button>
            <button @click="requestPayToss" :disabled="productAmount < 100">토스페이</button>
        </div>

        <button @click="goToRootPage">메인 페이지로 돌아가기</button>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import AudioRecord from './record.vue'
import axios from 'axios';

export default {
    name: 'TestPage',
    data() {
        return {
            message: '',
            resultText: '',
            showResult: false,
            IMP: window.IMP,
        }
    },

    props: {
        showButton: Number
    },

    mounted() {
        this.initSocket();
        this.IMP.init("imp03664607");
    },

    components: {
        AudioRecord
    },

    computed: {
        ...mapState(['file', 'numSpeakers', 'messages', 'socket', 'jwt', 'productName', 'productAmount']),
    },

    methods: {
        ...mapMutations(['setFile', 'setNumSpeakers', 'setProductName', 'setProductAmount']),
        ...mapActions(['initSocket']),

        handleFileUpload(event) {
            const file = event.target.files[0]
            this.setFile(file)
        },

        handleNumSpeakers(event) {
            const value = event.target.value
            this.setNumSpeakers(value)
        },

        handleProductName(event) {
            const name = event.target.value
            this.setProductName(name)
        },

        handleProductAmount(event) {
            const amount = event.target.value
            this.setProductAmount(amount)
            console.log(this.productAmount)
        },

        uploadFile() {
            const formData = new FormData();
            formData.append('uploaded_file', this.file);
            formData.append('nspeakers', this.numSpeakers);

            fetch('/upload', {
    method: 'POST',
    body: formData,
})
.then(response => {
    if (!response.ok) {
        throw new Error('Internal Server Error');
    }
    return response.text(); // 텍스트로 처리
})
.then(data => {
    this.resultText = data; // 텍스트로 출력
    this.showResult = true;
})
.catch(error => {
    console.error('Error:', error);
    this.resultText = 'Error submitting the form.';
    this.showResult = true;
});
        },

        sendMessage() {
            if (this.message === '') return;
            this.socket.emit('chat message', this.message);
            this.message = ''; // Clear the input after sending
        },

        requestPay() {
            const merchantUid = "merchant_" + new Date().getTime(); // Generate unique order number

            this.IMP.request_pay({
                pg: "html5_inicis.INIpayTest",
                // pay_method: "kakaopay", 카카오페이만을 결제 수단으로 한다면 추가. 여러가지 존재 가능
                merchant_uid: merchantUid,
                name: this.productName,
                amount: this.productAmount,
                buyer_email: "Iamport@chai.finance",
                buyer_name: "포트원 기술지원팀",
                buyer_tel: "010-1234-5678",
                buyer_addr: "서울특별시 강남구 삼성동",
                buyer_postcode: "123-456",
            }, rsp => {
                if (rsp.success) {
                    console.log("성공");
                    axios({
                        url: "/payments/verify", // ipconfig 이후 본인의 ipv4주소로 변경
                        method: "post",
                        headers: { "Content-Type": "application/json" },
                        data: {
                            imp_uid: rsp.imp_uid,
                            merchant_uid: rsp.merchant_uid
                        }
                    }).then(() => {
                        console.log("성공");
                        alert("결제가 완료되었습니다.");
                    })
                } else {
                    alert(`결제에 실패하였습니다. 에러 내용: ${rsp.error_msg}`);
                }
            });
        },

        requestPayKakao() {
            const merchantUid = "merchant_" + new Date().getTime(); // Generate unique order number

            this.IMP.request_pay({
                pg: "html5_inicis.INIpayTest",
                pay_method: "kakaopay",
                merchant_uid: merchantUid,
                name: this.productName,
                amount: this.productAmount,
                buyer_email: "Iamport@chai.finance",
                buyer_name: "포트원 기술지원팀",
                buyer_tel: "010-1234-5678",
                buyer_addr: "서울특별시 강남구 삼성동",
                buyer_postcode: "123-456",
            }, rsp => {
                if (rsp.success) {
                    console.log("성공");
                    axios({
                        url: "/payments/verify", // ipconfig 이후 본인의 ipv4주소로 변경
                        method: "post",
                        headers: { "Content-Type": "application/json" },
                        data: {
                            imp_uid: rsp.imp_uid,
                            merchant_uid: rsp.merchant_uid
                        }
                    }).then(() => {
                        console.log("성공");
                        alert("결제가 완료되었습니다.");
                    })
                } else {
                    alert(`결제에 실패하였습니다. 에러 내용: ${rsp.error_msg}`);
                }
            });
        },

        requestPayToss() {
            const merchantUid = "merchant_" + new Date().getTime(); // Generate unique order number

            this.IMP.request_pay({
                pg: "html5_inicis.INIpayTest",
                pay_method: "tosspay",
                merchant_uid: merchantUid,
                name: this.productName,
                amount: this.productAmount,
                buyer_email: "Iamport@chai.finance",
                buyer_name: "포트원 기술지원팀",
                buyer_tel: "010-1234-5678",
                buyer_addr: "서울특별시 강남구 삼성동",
                buyer_postcode: "123-456",
            }, rsp => {
                if (rsp.success) {
                    console.log("성공");
                    axios({
                        url: "/payments/verify", // ipconfig 이후 본인의 ipv4주소로 변경
                        method: "post",
                        headers: { "Content-Type": "application/json" },
                        data: {
                            imp_uid: rsp.imp_uid,
                            merchant_uid: rsp.merchant_uid
                        }
                    }).then(() => {
                        console.log("성공");
                        alert("결제가 완료되었습니다.");
                    })
                } else {
                    alert(`결제에 실패하였습니다. 에러 내용: ${rsp.error_msg}`);
                }
            });
        },

        goToRootPage() {
            this.$router.push("/")
            this.$emit("comeBack")
        },
    }
}
</script>

<style>
.test-page {
    margin-top: 60px;
}
</style>