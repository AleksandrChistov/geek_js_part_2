Vue.component('error-handler', {
    template: `
        <div v-show="isActivated" class="handler-error">{{message}}</div>
    `,
    props: {
        ms: {
            default: 3000
        },
    },
    data() {
        return {
            message: {
                default: 'Unknown error!'
            },
            isActivated: false
        }
    },
    methods: {
        emitError(message) {
            this.message = message;

            this.isActivated = true;
            setTimeout(() => this.isActivated = false, this.ms);
        },
    },
})
