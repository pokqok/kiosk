<template>
    <div class="head-container row">
        <div class="col-4">
            <button @click="$router.go(-1 - 2*cntCanclePay)" type="button" class="btn btn-light"><i class="bi bi-x-lg icon"></i>
                <p>취소</p>
            </button>
        </div>
        <h2 class="title col-4">결제 방법 선택</h2>
    </div>

    <div class="row" style="margin-top: 12%;">
        <button @click="requestPay" type="button" class="btn btn-light col-4">
            <i class="bi bi-credit-card pay-icon"></i>
            <p>카드 결제</p>
        </button>
        <button @click="requestPayKakao" type="button" class="btn btn-light col-4">
            <i class="bi bi-chat-fill pay-icon"></i>
            <p>카카오 페이</p>
        </button>
        <button @click="requestPayToss" type="button" class="btn btn-light col-4">
            <i class="bi bi-fonts pay-icon"></i>
            <p>토스 페이</p>
        </button>
    </div>
</template>



<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
    name: 'PaymentPage',

    data() {
        return {
            IMP: window.IMP,
            cntCanclePay: 0, //결제 눌렀다 취소하면 왜인지 뒤로가기가 한번에 안먹혀서 추가
        }
    },

    computed: {
        ...mapState(['productName', 'productAmount']),
    },

    mounted() {
        this.IMP.init("imp03664607");

        // 결제 test 용
        this.$store.commit('setProductAmount', 100)
        this.$store.commit('setProductName', 'test')
    },

    methods: {
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
                    this.cntCanclePay++
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
                    this.cntCanclePay++
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
                    this.cntCanclePay++
                }
            });
        },
    }
}
</script>

<style>
.head-container {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #229954;
    padding: 10px 0;
    z-index: 100;
}

.title {
    color: white;
    text-align: center;
    font-weight: bold;
    margin: 0;
}

.pay-icon {
    font-size: 150px;
}
</style>