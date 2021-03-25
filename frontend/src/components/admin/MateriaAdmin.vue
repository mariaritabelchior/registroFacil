<template>
    <div class="materia-admin">
        <b-form>
            <input id="materia-id" type="hidden" v-model="materia.id" />
            <b-form-group label="Nome:" label-for="materia-name">
                <b-form-input id="materia-name" type="text"
                    v-model="materia.name" required
                    :readonly="mode === 'remove'"
                    placeholder="Informe o Nome da Materia..." />
            </b-form-group>
            <b-form-group label="Materia Pai:" label-for="materia-parentId">
                <b-form-select v-if="mode === 'save'"
                    id="materia-parentId"
                    :options="materias" v-model="materia.parentId" />
                <b-form-input v-else
                    id="materia-parentId" type="text"
                    v-model="materia.path"
                    readonly />
            </b-form-group>
            <b-button variant="primary" v-if="mode === 'save'"
                @click="save">Salvar</b-button>
            <b-button variant="danger" v-if="mode === 'remove'"
                @click="remove">Excluir</b-button>
            <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-form>
        <hr>
        <b-table hover striped :items="materias" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadMateria(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadMateria(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
    </div>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
    name: 'MateriaAdmin',
    data: function() {
        return {
            mode: 'save',
            materia: {},
            materias: [],
            fields: [
                { key: 'id', label: 'Código', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'path', label: 'Caminho', sortable: true },
                { key: 'actions', label: 'Ações' }
            ]
        }
    },
    methods: {
        loadMaterias() {
            const url = `${baseApiUrl}/materias`
            axios.get(url).then(res => {
                // this.materias = res.data
                this.materias = res.data.map(materia => {
                    return { ...materia, value: materia.id, text: materia.path }
                })
            })
        },
        reset() {
            this.mode = 'save'
            this.materia = {}
            this.loadMaterias()
        },
        save() {
            const method = this.materia.id ? 'put' : 'post'
            const id = this.materia.id ? `/${this.materia.id}` : ''
            axios[method](`${baseApiUrl}/materias${id}`, this.materia)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
            const id = this.materia.id
            axios.delete(`${baseApiUrl}/materias/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        loadMateria(materia, mode = 'save') {
            this.mode = mode
            this.materia = { ...materia }
        }
    },
    mounted() {
        this.loadMaterias()
    }
}
</script>

<style>

</style>