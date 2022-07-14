
export function initState(vm) { // vm.$options
    const opts = vm.$options;
    if (opts.props) {
        initProps(vm);
    }
}
function initProps() {}