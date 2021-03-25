<template>
    <div class="diario-admin">
        <b-form>
            <input id="diario-id" type="hidden" v-model="diario.id" />
            <b-form-group label="Escolha a data:" label-for="diario-data">
                <b-form-input id="diario-data" type="date"
                    v-model="diario.data"
                    :readonly="mode === 'remove'"
                    placeholder="Informe a Data do Diario..." />
            </b-form-group>
            <b-form-group v-if="mode === 'save'" 
                label="Matéria:" label-for="diario-materiaId">
                <b-form-select id="diario-materiaId"
                    :options="materias" v-model="diario.materiaId" />
            </b-form-group>
            <b-form-group v-if="mode === 'save'" 
                label="Professor(a):" label-for="diario-userId">
                <b-form-select id="diario-userId"
                    :options="users" v-model="diario.userId" />
            </b-form-group>
            <b-form-group v-if="mode === 'save'"
                label="Conteúdo" label-for="diario-content">
                <VueEditor v-model="diario.content"
                    placeholder="Informe o Conteúdo do Diario..." />
            </b-form-group>
            <b-form-group v-if="mode === 'save'"
                label="Relatório" label-for="diario-report">
                <VueEditor v-model="diario.report"
                    placeholder="Informe o Relatório do Diario..." />
            </b-form-group>
            <b-button variant="primary" v-if="mode === 'save'"
                @click="save">Salvar</b-button>
            <b-button variant="danger" v-if="mode === 'remove'"
                @click="remove">Excluir</b-button>
            <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-form>
        <hr>
        <b-table hover striped :items="diarios" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadDiario(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadDiario(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
        <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />
    </div>
</template>

<script>
import { VueEditor } from "vue2-editor"
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
    name: 'DiarioAdmin',
    components: { VueEditor },
    data: function() {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        // 15th two months prior
        const minDate = new Date(today)
        minDate.setMonth(minDate.getMonth() - 2)
        minDate.setDate(15)
        // 15th in two months
        const maxDate = new Date(today)
        maxDate.setMonth(maxDate.getMonth() + 2)
        maxDate.setDate(15)
        return {
            value: '',
            min: minDate,
            max: maxDate,
            mode: 'save',
            diario: {},
            diarios: [],
            materias: [],
            users: [],
            page: 1,
            limit: 0,
            count: 0,
            fields: [
                { key: 'id', label: 'Código', sortable: true },
                { key: 'data', label: 'Data', sortable: true },
                { key: 'materiaId', label: 'Matéria', sortable: true },
                { key: 'userId', label: 'Professor(a)', sortable: true },
                { key: 'content', label: 'Conteúdo', sortable: true },
                { key: 'report', label: 'Relatório', sortable: true },
                { key: 'actions', label: 'Ações' }
            ]
        }
    },
    methods: {
        loadDiarios() {
            const url = `${baseApiUrl}/diarios?page=${this.page}`
            axios.get(url).then(res => {
                this.diarios = res.data.data
                this.count = res.data.count
                this.limit = res.data.limit
            })
        },
        reset() {
            this.mode = 'save'
            this.diario = {}
            this.loadDiarios()
        },
        save() {
            const method = this.diario.id ? 'put' : 'post'
            const id = this.diario.id ? `/${this.diario.id}` : ''
            axios[method](`${baseApiUrl}/diarios${id}`, this.diario)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
            const id = this.diario.id
            axios.delete(`${baseApiUrl}/diarios/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        loadDiario(diario, mode = 'save') {
            this.mode = mode
            axios.get(`${baseApiUrl}/diarios/${diario.id}`)
                .then(res => this.diario = res.data)
        },
        loadMaterias() {
            const url = `${baseApiUrl}/materias`
            axios.get(url).then(res => {
                this.materias = res.data.map(materia => {
                    return { value: materia.id, text: materia.path }
                })
            })
        },
        loadUsers() {
            const url = `${baseApiUrl}/users`
            axios.get(url).then(res => {
                this.users = res.data.map(user => {
                    return { value: user.id, text: `${user.name} - ${user.email}` }
                })
            })
        }
    },
    watch: {
        page() {
            this.loadDiarios()
        }
    },
    mounted() {
        this.loadUsers()
        this.loadMaterias()
        this.loadDiarios()
    }
}
</script>

<style>

</style>