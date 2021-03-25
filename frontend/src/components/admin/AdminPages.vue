<template>
    <div class="admin-pages">
        <PageTitle icon="fa fa-cogs" main="Administração do Sistema"
            sub="Cadastros" />
        <div class="admin-pages-tabs">
            <b-card no-body>
                <b-tabs card>
                    <b-tab title="Diarios" active>
                        <DiarioAdmin />
                    </b-tab>
                    <b-tab title="Materias">
                        <MateriaAdmin />
                    </b-tab>
                    <b-tab title="Pontos">
                        <PontoAdmin />
                    </b-tab>
                    <b-tab title="Usuários">
                        <UserAdmin />
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
    </div>
</template>

<script>
import PageTitle from '../template/PageTitle'
import DiarioAdmin from './DiarioAdmin'
import MateriaAdmin from './MateriaAdmin'
import PontoAdmin from './PontoAdmin'
import UserAdmin from './UserAdmin'

export default {
    name: 'AdminPages',
    components: { PageTitle, DiarioAdmin,MateriaAdmin, PontoAdmin, UserAdmin }
}
</script>

<style>

</style>
