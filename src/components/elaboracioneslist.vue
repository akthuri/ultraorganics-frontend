<template>
  <div id="elaboraciones-list">
    <!-- Tool bar -->
    <div class="nav">
      <span class="menuButton"><router-link to="/" class="home">Inicio</router-link></span>
      <span class="menuButton"><router-link to="/elaboracion" class="create">Crear Elaboracion</router-link></span>
    </div>

    <div id="main" class="contenedor">
      <h1>Elaboraciones</h1>

      <div id="listado">
        <el-table :data="elaboraciones">
          <el-table-column prop="folio" label="Folio"></el-table-column>
          <el-table-column prop="dateCreated" label="Fecha Captura" :formatter="ffecha" />
          <el-table-column prop="estatus" label="Estatus"></el-table-column>
          <el-table-column width="50px">
            <template slot-scope="scope">
              <router-link :to="{ name: 'elaboracion', params: { id: scope.row._id } }">
                <i class="el-icon-view"></i>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div> <!-- elaboraciones-list -->
</template>

<script>
import axios from 'axios'
import moment from 'moment'

const metodos = {
  ffecha (row, column, cellValue) {
    let theValue = null
    if (cellValue) theValue = moment(cellValue).format('DD-MM-YYYY HH:mm')
    return theValue
  }
}

export default {
  name: 'elaboracioneslist',
  data: () => {
    return {
      elaboraciones: []
    }
  },
  created () {
    const _this = this
    axios.get('/api/elaboraciones')
      .then(function (response) {
        if (response.status === 200) {
          _this.elaboraciones = response.data.data
        }
      })
  },
  methods: metodos
}
</script>
<style scoped>
  #listado {
    border: solid 1px lightgrey;
    margin: 15px 0 0 0;
  }
  .el-icon-view {
    color: blue;
  }
</style>
