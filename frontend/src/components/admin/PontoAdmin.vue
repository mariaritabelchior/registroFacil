<template>
    <div class="ponto-admin">
        <b-form>
            <input id="ponto-id" type="hidden" v-model="ponto.id" />
            <b-form-group v-if="mode === 'save'" 
                label="Funcionário(a):" label-for="diario-userId">
            <b-form-select id="diario-userId"
                     :options="users" v-model="ponto.userId" />
            </b-form-group>
            <b-form-group v-if="mode === 'save'"
                 label="Observação" label-for="diario-report">
                 <VueEditor v-model="ponto.report"
                     placeholder="Observação ou justificativa..." />
            </b-form-group>
            <b-button variant="primary" v-if="mode === 'save'"
                @click="save">Salvar</b-button>
            <b-button variant="danger" v-if="mode === 'remove'"
                @click="remove">Excluir</b-button>
            <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-form>
        <hr>
        <b-table hover striped :items="pontos" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadPontos(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadPontos(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
            <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />
        </b-table>
    </div>
</template>

<script>
import { VueEditor } from "vue2-editor"
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
    name: 'PontoAdmin',
    components: { VueEditor },
    data: function() {
        return {
            mode: 'save',
            ponto: {},
            pontos: [],
            users: [],
            fields: []
        }
    },
    methods: {
        loadPontos() {
            const url = `${baseApiUrl}/pontos`
            axios.get(url).then(res => {
                this.pontos = res.data
               // this.pontos = res.data.map(ponto => {
                 //   return { ...ponto, value: ponto.id, text: ponto.path }
               // })
            })
        },
        loadUsers() {
            const url = `${baseApiUrl}/users`
            axios.get(url).then(res => {
                this.users = res.data.map(user => {
                    return { value: user.id, text: `${user.name} - ${user.email}` }
                })
            })
        },
        reset() {
            this.mode = 'save'
            this.ponto = {}
            this.loadPontos()
        },
        save() {
            const method = this.ponto.id ? 'put' : 'post'
            const id = this.ponto.id ? `/${this.ponto.id}` : ''
            axios[method](`${baseApiUrl}/pontos${id}`, this.ponto)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
            const id = this.ponto.id
            axios.delete(`${baseApiUrl}/pontos/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        loadPonto(ponto, mode = 'save') {
            this.mode = mode
            this.ponto = { ...ponto }
        }
    },
    watch: {
        page() {
            this.loadPontos()
        }
    },
    mounted() {
        this.loadUsers()
        this.loadPontos()
    }
}
</script>

<style>

</style>