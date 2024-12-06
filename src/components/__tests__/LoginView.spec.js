import { describe, it, expect, assert } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginView from '@/views/LoginView.vue'
import { assert } from '@vue/compiler-core'
import { Polly } from '@pollyjs/core';
import FetchAdapter from '@pollyjs/adapter-fetch';
import LocalStoragePersister from '@pollyjs/persister-local-storage';
import fetch, {Request, Response} from 'node-fetch';

global.fetch = fetch;
global.Request = Request;
global.Response = Response;

Polly.register(LocalStoragePersister);
Polly.register(FetchAdapter);

describe('當會員要登入時', async() => {
    const polly = new Polly('取得會員資料', {
        adapters: ['fetch'],
        persister: 'local-storage',
        logLevel: 'info',
        recordFailedRequests: true, 
    });

    it('需順利登入，且顯示登入成功', async() => {
        // Arrange
        const email = "eve.holt@reqres.in"
        const password = "cityslicka"
        // Act
        const response = await fetch('https://reqres.in/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        })

        const data = await response.json()
        // Assert
        expect(response.status).to.equal(200)
    })

    it('密碼錯誤，無法登入', async() => {
        // Arrange
        const email = "peter@klaven"
        // Act
        const response = await fetch('https://reqres.in/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
            }),
        })

        const data = await response.json()
        // Assert
        expect(response.status).to.equal(400)
        expect(data.error).to.equal("Missing password")
    })
    await polly.stop()
})


describe('當會員登入資料錯誤', () => {
    const MAX_ATTEMPTS = 3

    it('顯示帳號或密碼錯誤', async() => {
        const wrapper = mount(LoginView)
        // Arrange
        const email = "132123.holt@reqres.in"
        const wrongpassword = 'fdfdsf'

        // Act
        await wrapper.find('[data-test="email"]').setValue(email)
        await wrapper.find('[data-test="password"]').setValue(wrongpassword)
        await wrapper.find('form').trigger('submit')

        // Assert
        expect(wrapper.find('[data-test="error"]').text()).toBe("信箱或密碼錯誤")
    })

    it('嘗試登入三次後帳號鎖定', async() => {
        const wrapper = mount(LoginView)
        // Arrange
        const email = "132123.holt@reqres.in"
        const wrongpassword = 'fdfdsf'
        const isLocked = false

        // Act
        for (let i = 0; i <= MAX_ATTEMPTS; i++) {
            await wrapper.find('[data-test="email"]').setValue(email)
            await wrapper.find('[data-test="password"]').setValue(wrongpassword)
            await wrapper.find('form').trigger('submit')
        }

        // Assert
        expect(wrapper.find('[data-test="error"]').text()).toBe("鎖定帳號15分鐘")
    })
})