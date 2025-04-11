<template>
    <div class="footer-wrapper">
        <RouterLink :to="{ name: 'about' }"><span>About us</span></RouterLink>
        © vessel™ {{new Date().getFullYear()}}
    </div>
</template>

<style lang="scss" scoped>
@import "../styles.scss";

.footer-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 3em;

    padding-inline: $px-m;
    margin-top: $px-xs;
    padding: $px-xxs;

    color: $highlight;

    font-size: small;
    text-decoration: underline;
}

span {
    cursor: pointer;
}
</style>