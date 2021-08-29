import { $themeBreakpoints, $themeConfig } from '~~/assets/themeConfig'
export const state = () => {
    return {
        windowWidth: 0,
        shallShowOverlay: false,
        isVerticalMenuCollapsed: $themeConfig.layout.menu.isCollapsed,
    }
}
export const getters = {
    currentBreakPoint: state => {
        const { windowWidth } = state
        if (windowWidth >= $themeBreakpoints.xl) return 'xl'
        if (windowWidth >= $themeBreakpoints.lg) return 'lg'
        if (windowWidth >= $themeBreakpoints.md) return 'md'
        if (windowWidth >= $themeBreakpoints.sm) return 'sm'
        return 'xs'
    },
}
export const mutations = {
    UPDATE_WINDOW_WIDTH(state, val) {
        state.windowWidth = val
    },
    UPDATE_VERTICAL_MENU_COLLAPSED(state, val) {
        state.isVerticalMenuCollapsed = val
    },
    TOGGLE_OVERLAY(state, val) {
        state.shallShowOverlay = val !== undefined ? val : !state.shallShowOverlay
    },
    updateChannels(state, payload) {
        state.auth.user.channels.push(payload)
    }
}
export const actions = {

}