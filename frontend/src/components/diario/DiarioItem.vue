<template>
    <div class="diario-item">
        <router-link :to="{ name: 'diarioById', params: { id: diario.id } }">
            <div class="diario-item-image d-none d-sm-block">
                <img v-if="diario.imageUrl"
                    :src="diario.imageUrl"
                    height="150" width="150" alt="Diario">
                <img v-else
                    src="@/assets/diario.png"
                    height="150" width="150" alt="Diario">
            </div>
            <div class="diario-item-info">
                <h2>{{ diario.name }}</h2>
                <p>{{ diario.description }}</p>
                <span class="diario-item-author">
                    <strong>Autor: </strong>{{ diario.author }}
                </span>
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
    name: 'DiarioItem',
    props: ['diario']
}
</script>

<style>
    .diario-item {
        border-radius: 8px;
        margin-bottom: 20px;
        background-color: #FFF;
        padding: 20px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
    }

    .diario-item a {
        display: flex;
        align-items: flex-start;
        text-decoration: none;
        color: #000;
    }

    .diario-item-info h2 {
        font-size: 1.7rem;
    }

    .diario-item-image {
        padding-right: 20px;
        margin-right: 20px;
        border-right: 1px solid #AAA;
    }

    .diario-item-image img {
        border-radius: 5px;
    }

    .diario-item-info {
        display: flex;
        align-self: stretch;
        flex-direction: column;
    }

    .diario-item-info p {
        flex: 1;
        color: #555;
        font-size: 1.1rem;
    }
</style>
