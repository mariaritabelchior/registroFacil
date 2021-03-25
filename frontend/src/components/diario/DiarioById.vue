<template>
    <div class="diario-by-id">
        <PageTitle icon="fa fa-file-o" :main="diario.name" :sub="diario.description" />
        <div class="diario-content" v-html="diario.content"></div>
    </div>
</template>

<script>
import 'highlightjs/styles/dracula.css'
import hljs from 'highlightjs/highlight.pack.js'
import { baseApiUrl } from '@/global'
import axios from 'axios'
import PageTitle from '../template/PageTitle'

export default {
    name: 'DiarioById',
    components: { PageTitle },
    data: function() {
        return {
            diario: {}
        }
    },
    mounted() {
        const url = `${baseApiUrl}/diarios/${this.$route.params.id}`
        axios.get(url).then(res => this.diario = res.data)
    },
    updated() {
        document.querySelectorAll('.diario-content pre.ql-syntax').forEach(e => {
            hljs.highlightBlock(e)
        })
    }
}
</script>

<style>
    .diario-content {
        background-color: #FFF;
        border-radius: 8px;
        padding: 25px;
    }

    .diario-content pre {
        padding: 20px;
        border-radius: 8px;
        font-size: 1.2rem;
        background-color: #1e1e1e;
        color: #FFF;
    }

    .diario-content img {
        max-width: 100%;
    }

    .diario-content :last-child {
        margin-bottom: 0px;
    }
</style>
