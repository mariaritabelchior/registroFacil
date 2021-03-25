<template>
    <div class="diarios-by-materia">
        <PageTitle icon="fa fa-folder-o"
            :main="materia.name" sub="Materia" />
        <ul>
            <li v-for="diario in diarios" :key="diario.id">
                <DiarioItem :diario="diario" />
            </li>
        </ul>
        <div class="load-more">
            <button v-if="loadMore"
                class="btn btn-lg btn-outline-primary"
                @click="getDiarios">Carregar Mais Diarios</button>
        </div>
    </div>
</template>

<script>
import { baseApiUrl } from '@/global'
import axios from 'axios'
import PageTitle from '../template/PageTitle'
import DiarioItem from './DiarioItem'

export default {
    name: 'DiariosByMateria',
    components: { PageTitle, DiarioItem },
    data: function() {
        return {
            materia: {},
            diarios: [],
            page: 1,
            loadMore: true
        }
    },
    methods: {
        getMateria() {
            const url = `${baseApiUrl}/materias/${this.materia.id}`
            axios(url).then(res => this.materia = res.data)
        },
        getDiarios() {
            const url = `${baseApiUrl}/materias/${this.materia.id}/diarios?page=${this.page}`
            axios(url).then(res => {
                this.diarios = this.diarios.concat(res.data)
                this.page++

                if(res.data.length === 0) this.loadMore = false
            })
        }
    },
    watch: {
        $route(to) {
            this.materia.id = to.params.id
            this.diarios = []
            this.page = 1
            this.loadMore = true

            this.getMateria()
            this.getDiarios()
        }
    },
    mounted() {
        this.materia.id = this.$route.params.id
        this.getMateria()
        this.getDiarios()
    }
}
</script>

<style>
    .diarios-by-materia ul {
        list-style-type: none;
        padding: 0px;
    }

    .diarios-by-materia .load-more {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 25px;
    }
</style>
