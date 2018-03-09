<template>
  <div id="index">
    <div class="nav">
      <span class="menuButton"></span>
    </div>
    <div class="body">
      <h1>Ultraorganics</h1>
      <br />
      <h3>Bienvenido al Portal de Elaboraciones</h3>
      <br />
      <div id="menu">
        <div class="opcion">
          <router-link to="/elaboraciones-list">
            <img src="../assets/img/elaboraciones.png">
            <div class="texto-opcion">Elaboraciones</div>
          </router-link>
        </div>
        <div class="opcion">
          <router-link to="/traslados-list">
            <img src="../assets/img/envios.png">
            <div class="texto-opcion">Envios</div>
          </router-link>
        </div>
        <div class="opcion" v-if="isAdmin">
          <router-link to="/usuarios-list">
            <img src="../assets/img/usuarios.png" />
            <div class="texto-opcion">Usuarios</div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  computed: {
    isAdmin () {
      return false
    }
  }
}
</script>
<style scoped>
  .opcion {
    display: inline-block;
    border: solid #909090 2px;;
    box-shadow: 3px 3px;
    border-radius: 25px;
    width: 150px;
    text-align: center;
    vertical-align: middle;
    margin-left: 15px;
    margin-top: 15px;
    padding: 10px;
  }

  .opcion :hover {
    color: green;
  }

  .texto-opcion {
    font-family: Verdana;
    font-size: 18px;
  }
  h3 {
    font-weight: 400;
  }
  #menu {
    margin-left: 200px;
    width: 550px;
  }
</style>
