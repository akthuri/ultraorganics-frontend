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

        <el-pagination :total="totalRegistros" :page-size="pageSize"
            :currentPage="currentPage" layout="total, prev, pager, next"
            @current-change="listado_onpagechange" />
      </div>

      <div class="leyendas">
        <i class="el-icon-view"></i> Consultar
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
  },
  listado_onpagechange (newPage) {
    this.currentPage = newPage
    this.consultar()
  },
  consultar () {
    const config = {
      params: {
        $skip: (this.currentPage - 1) * this.pageSize,
        '$sort[dateCreated]': -1
      }
    }
    axios.get('/api/elaboraciones', config)
      .then((response) => {
        if (response.status === 200) {
          this.totalRegistros = response.data.total
          this.elaboraciones = response.data.data
        }
      })
  }
}

export default {
  name: 'elaboracioneslist',
  props: ['id'],
  data: () => {
    return {
      elaboraciones: [],
      currentPage: 1,
      pageSize: 10,
      totalRegistros: 0
    }
  },
  created () {
    this.consultar()
  },
  methods: metodos
}
</script>
<style scoped>
  #listado {
    border: solid 1px lightgrey;
    margin: 15px 0 0 0;
  }
  .el-table {
    font: 11px verdana, arial, helvetica, sans-serif;
  }
  .el-icon-view {
    color: blue;
  }
  .leyendas {
    margin: 10px 0 0 0;
  }
</style>
