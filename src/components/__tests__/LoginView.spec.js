import { describe, it, expect, assert } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginView from '@/views/LoginView.vue'
import { assert } from '@vue/compiler-core'

describe('當會員登入資料正確', () => {
    it('需順利登入，且顯示登入成功', async() => {
        const wrapper = mount(LoginView)
        // Arrange
        const email = "eve.holt@reqres.in"
        const password = 'cityslicka'

        // Act
        await wrapper.find('[data-test="email"]').setValue(email)
        await wrapper.find('[data-test="password"]').setValue(password)
        await wrapper.find('form').trigger('submit')

        // Assert
        expect(wrapper.find('[data-test="success"]').text()).toBe("登入成功")
    })
})