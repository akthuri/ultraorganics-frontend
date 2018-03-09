<template>
  <div id="app">
    <el-container>
      <el-header height="20">
        <el-row>
          <el-col :span="2">
            <router-link to="/">
              <img src="./assets/img/logo.png" height="45" border="0" />
            </router-link>
          </el-col>
          <el-col :span="22" class="link-salir">
            <el-row type="flex" justify="end">
              <el-col :span="8">
                {{ usuario }}
              </el-col>
              <el-col :span="1">
                <a href="#" @click="logout">Salir</a>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-header>

      <el-main><router-view/></el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    logout () {
      this.$store.commit('logout')
      this.$router.push('/login')
    }
  },
  computed: {
    usuario () {
      let texto = ''
      if (this.$store.state.usuario.username) {
        texto = `${this.$store.state.usuario.nombre}
            | ${this.$store.state.usuario.username}`
      }
      return texto
    }
  }
}
</script>
<style>
  .el-main {
    padding: 0;
  }
  .link-salir {
    margin-top: 10px;
  }
</style>
