<template>
  <div id="almacenes">
    <div id="toolbar">
       <span class="menuButton"><router-link to="/" class="home">Inicio</router-link></span>
    </div>
    <div id="contenido" class="contenedor">
      <h1>Almacenes</h1>
      <div id="listado">
        <el-table :data="almacenes">
          <el-table-column prop="codigoSAP" label="Codigo SAP"></el-table-column>
          <el-table-column prop="almacen" label="Almacen"></el-table-column>
          <el-table-column prop="dateCreated" label="Fecha Alta"></el-table-column>
          <el-table-column prop="lastUpdated" label="Actualizado"></el-table-column>
          <el-table-column>
            <template slot-scope="scope" width="30px">
              <i class="el-icon-edit"></i>
            </template>
          </el-table-column>
        </el-table>
        <div id="botones">
          <el-button size="mini" type="primary" @click="agregar">Agregar</el-button>
        </div>
      </div>
      <div id="leyendas"></div>
    </div>
  </div>
</template>

<script>

const metodos = {
  agregar () {
    const nuevoAlmacen = {
      codigoSAP: null,
      almacen: null,
      dateCreated: null,
      lastUpdated: null
    }
    this.nuevos.push(nuevoAlmacen)
    this.almacenes.push(nuevoAlmacen)
  }
}
export default {
  name: 'almacenes',
  data: () => {
    return {
      almacenes: [],
      nuevos: []
    }
  },
  methods: metodos
}
</script>

<style scoped>
  #listado {
    margin: 10px 0 0 0;
  }
  #botones {
    margin: 8px 0 0 0;
  }
</style>
