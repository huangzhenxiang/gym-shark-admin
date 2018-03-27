<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    <span v-show="!is_login">注册</span>
                    <span v-show="is_login">欢迎登录</span>
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <span class="login" v-show="is_login">
                                <Button @click="handleSubmit" type="primary" long>登录</Button>
                                <div style="margin: 10px 0;"></div>
                                <Button @click="is_login = false" type="info" long>注册</Button>
                            </span>
                            <span class="register" v-show="!is_login">
                                <Button @click="handleRegister" type="primary" long>提交</Button>
                                <div style="margin: 10px 0;"></div>
                                <Button @click="is_login = true" long>返回</Button>
                            </span>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
    data () {
        return {
            is_login: true,
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.$http.post('users/login', {
                        username: this.form.userName,
                        password: this.form.password
                    }).then(res => {
                        Cookies.set('user', this.form.userName);
                        Cookies.set('password', this.form.password);
                        Cookies.set('access', res.data.roles[0]);
                        Cookies.set('logintime', res.data.logintime);
                        Cookies.set('token', res.data.token);
                        this.$Message.success(res.msg);
                        this.$router.push({
                            name: 'home_index'
                        });
                    }).catch(res => {
                    });
                }
            });
        },
        handleRegister () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.$http.post('users/register', {
                        username: this.form.userName,
                        password: this.form.password
                    }).then(res => {
                        this.is_login = true;
                        this.$Message.success(res.msg);
                    }).catch(res => {
                    });
                }
            });
        }
    }
};
</script>

