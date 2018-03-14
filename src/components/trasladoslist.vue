<template>
  <div id="traslados-list">
    <div id="toolbar" class="nav">
      <span class="menuButton"><router-link to="/" class="home">Inicio</router-link></span>
      <span class="menuButton"><router-link to="/traslado" class="create">Crear Traspaso</router-link></span>
    </div>

    <div id="contenido" class="contenedor">
      <h1>Traspasos</h1>

      <div id="listado">
        <el-table :data="traspasos">
          <el-table-column prop="folio" label="Folio"></el-table-column>
          <el-table-column prop="estatus" label="Estatus"></el-table-column>
          <el-table-column prop="almacenEnvia" label="Almacen Envia"></el-table-column>
          <el-table-column prop="almacenRecibe.whsName" label="Almacen Recibe"></el-table-column>
          <el-table-column width="50px">
            <template slot-scope="scope">
              <router-link :to="{ name: 'traslado', params: { id: scope.row._id } }">
              <i class="el-icon-view"></i>
              </router-link>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination :total="totalRegistros" :page-size="pageSize"
           layout="total, prev, pager, next"
           @current-change="listado_onpagechange"
          :currentPage="currentpage"
        ></el-pagination>
      </div>

      <div id="leyendas">
        <i class="el-icon-view"></i> Consultar
      </div>
    </div>
  </div> <!-- traslados-list -->
</template>

<script>
import axios from 'axios'

const metodos = {
  consultar () {
    const skip = (this.currentPage - 1) * this.pagesize

    axios.get('/api/traslados?$skip=' + skip)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.total > 0) {
            this.totalRegistros = response.data.total
            this.traspasos = response.data.data
          }
        }
      })
  },
  listado_onpagechange (newPage) {
    this.currentPage = newPage
    this.consultar()
  }
}

export default {
  name: 'traslados-list',
  data: () => {
    return {
      traspasos: [],
      currentpage: 1,
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
    margin: 10px 0 0 0;
    border: solid 1px lightgrey;
  }
  .el-table {
    font: 11px verdana, arial, helvetica, sans-serif;
  }
  .el-icon-view {
    color: blue;
  }
  #leyendas {
    margin: 10px 0 0 0;
  }
</style>
