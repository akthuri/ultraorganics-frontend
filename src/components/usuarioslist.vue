<template>
    <div id="usuarios-list">
      <div id="toolbar" class="nav">
        <span class="menuButton"><router-link to="/" class="home">Inicio</router-link></span>
        <span class="menuButton"><router-link to="/usuario" class="create">Crear Usuario</router-link></span>
      </div>
      <div id="contenido" class="contenedor">
        <h1>Usuarios</h1>
        <div id="listado">
          <el-table :data="usuarios">
            <el-table-column label="Nombre">
              <template slot-scope="scope">
                {{ fullName(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column prop="username" label="Usuario"></el-table-column>
            <el-table-column prop="perfil" label="Perfil"></el-table-column>
            <el-table-column prop="almacen.whsName" label="Almacen"></el-table-column>
            <el-table-column width="50px">
              <template slot-scope="scope">
                <router-link :to="{ name: 'usuario', params: { id: scope.row._id } }">
                <i class="el-icon-view"></i>
                </router-link>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination :total="totalRegistros" :page-size="pageSize"
                         :current-page="currentPage"
                         layout="total, prev, pager, next"
                         @current-change="listado_onpagechange"
          />
        </div>
        <div id="leyendas">
          <i class="el-icon-view"></i> Consultar
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'

const metodos = {
  consultar () {
    const skip = (this.currentPage - 1) * this.pageSize
    axios.get('/api/usuarios?$skip=' + skip)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.total > 0) {
            this.totalRegistros = response.data.total
            this.usuarios = response.data.data
          }
        } else {
          console.log(response)
          // TODO: manejar error
        }
      })
      .catch((err) => {
        console.log(err)
        //  TODO: manejar error
      })
  },
  fullName (usuario) {
    return `${usuario.nombres} ${usuario.apellidos}`
  },
  listado_onpagechange (newPage) {
    this.currentPage = newPage
    this.consultar()
  }
}

export default {
  name: 'usuarioslist',
  data: () => {
    return {
      usuarios: [],
      totalRegistros: 0,
      pageSize: 10,
      currentPage: 1
    }
  },
  created () {
    this.consultar()
  },
  methods: metodos
}
</script>
<style scoped>
  .el-icon-view {
    color: blue;
  }
  #leyendas {
    margin: 10px 0 0 0;
  }
  #listado {
    margin: 10px 0 0 0;
    border: solid 1px lightgrey;
  }
  .el-table {
    font: 11px verdana, arial, helvetica, sans-serif;
  }
</style>
