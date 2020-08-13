import { construct } from "../functions/construct.js";

construct("p-show", {
    mounted() {
        if (this.props.if) {
                this.style.display = (this.props.display || "block") as string;
            this.setAttribute("hidden", "hidden");
        } else {
            this.style.display = "none";
            this.setAttribute("hidden", "");
        }
    },

    watch: {
        if() {
            if (this.props.if) {
                this.style.display = (this.props.display || "block") as string;
                this.setAttribute("hidden", "hidden");
            } else {
                this.style.display = "none";
                this.setAttribute("hidden", "");
            }
        }
    },
    castedProps: { if: "boolean" }
});