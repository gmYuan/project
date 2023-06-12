import "../../dist/vue.js";

// eslint-disable-next-line no-undef, no-unused-vars
const app = new Vue({
  el: "#app",
  data: {
    name: "haha",
    info: {
      mid: 123,
    },
    friends: ["朋友a", "朋友b"],
  },
  computed: {},

  watch: {},

  methods: {
    handleChage1() {
      console.log("修改了mid");
      this.info.mid = "456";
      // this.info = { name: "新name" };
      this.info.money = 200;
    },
    handleChage2() {
      console.log("修改了money");
      this.info.money = 100;
    },
    handleChage3() {
      console.log("修改了friends");
      this.friends[1] = "新朋友啊";
      // this.$set(this.friends, "1", "新朋友");
    },
  },
});