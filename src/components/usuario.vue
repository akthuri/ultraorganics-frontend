<template>
    <div id="usuario">
      <div id="toolbar" class="nav">
        <span class="menuButton"><router-link to="/" class="home">Inicio</router-link></span>
        <span class="menuButton"><router-link to="/usuarios-list" class="list">Listado</router-link></span>
      </div>

      <div id="contenido" class="contenedor">
        <div id="captura">
          <h1>Usuario</h1>

          <div id="campos">

            <el-row>
              <el-col :span="3">Nombres</el-col>
              <el-col :span="7">
                <el-input v-model="usuario.nombres" size="small" label="Nombres"
                          :autofocus="true"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">Apellidos</el-col>
              <el-col :span="7">
                <el-input v-model="usuario.apellidos" size="small" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">Usuario</el-col>
              <el-col :span="7">
                <el-input v-model="usuario.username" size="small" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">Password</el-col>
              <el-col :span="7">
                <el-input type="password" v-model="usuario.password" size="small" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">Almacen</el-col>
              <el-col :span="7">
                <el-autocomplete :fetch-suggestions="buscarAlmacen" size="small"
                                 :trigger-on-focus="false"
                                 @select="almacen_onselect" @blur="almacen_onblur"
                                 v-model="usuario.textoAlmacen"
                >
                  <template slot-scope="scope">
                    <span class="opcion">{{ scope.item.whsCode }} - {{ scope.item.whsName }}</span>
                  </template>
                </el-autocomplete>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3">Perfil</el-col>
              <el-col :span="7">
                <el-select v-model="usuario.perfil" :clearable="true">
                  <el-option v-for="(perfil, index) in perfiles"
                             :key="index" :label="perfil.label" :value="perfil.value"
                  />
                </el-select>
              </el-col>
            </el-row>

          </div> <!-- campos -->
        </div>
        <div id="botones">
          <el-button size="small" type="primary" @click="guardar_onclick">Guardar</el-button>
          <el-button @click="cancelar_onclick" size="small">Cancelar</el-button>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'

const metodos = {
  almacen_onselect (almacen) {
    this.usuario.almacen = almacen
    this.usuario.textoAlmacen = almacen.whsName
  },
  almacen_onblur () {
    setTimeout(() => {
      this.usuario.textoAlmacen = this.usuario.almacen ? this.usuario.almacen.whsName : null
    }, 150)
  },
  guardar_onclick () {
    if (this.$props.id) {
      this.actualizar()
    } else {
      this.insertar()
    }
  },
  insertar () {
    axios.post('/api/usuarios', this.usuario)
      .then((response) => {
        if (response.status === 201) {
          this.$router.push('/usuarios-list')
        } else {
          console.log(response) //  TODO: manejar error
        }
      })
      .catch((err) => {
        console.log(err) // TODO: manejar error
      })
  },
  actualizar () {
    axios.put('/api/usuarios/' + this.$props.id, this.usuario)
      .then((response) => {
        if (response.status === 200) {
          this.$router.push('/usuarios-list')
        } else {
          console.log(response) //  TODO: manejar error
        }
      })
      .catch((err) => {
        console.log(err) // TODO: manejar error
      })
  },
  cancelar_onclick () {
    this.$router.push('/usuarios-list')
  },
  buscarAlmacen (text, callback) {
    axios.get('/api/almacenes?$search=' + text)
      .then((response) => {
        if (response.status === 200) {
          callback(response.data.data)
        } else {
          console.log(response)
          //  TODO: manejar error
        }
      })
      .catch((err) => {
        console.log(err)
        //  TODO: manejar error
      })
  },
  consultar () {
    axios.get('/api/usuarios/' + this.$props.id)
      .then((response) => {
        if (response.status === 200) {
          this.usuario = response.data
        } else {
          console.log(response) //  TODO: manejar error
        }
      })
      .catch((err) => {
        console.log(err) // TODO: manejar error
      })
  }
}

export default {
  name: 'usuario',
  props: ['id'],
  data: () => {
    return {
      usuario: {
        nombres: null,
        apellidos: null,
        username: null,
        password: null,
        almacen: null,
        textoAlmacen: null,
        perfil: null
      },
      perfiles: [{value: 'ROLE_ADMIN', label: 'Administrador'}]
    }
  }, //  data
  methods: metodos,
  created () {
    if (this.$props.id) {
      this.consultar()
    }
  }
}
</script>
<style scoped>
  #campos {
    margin: 10px 0 0 0;
    border: solid 1px lightgrey;
    padding: 15px;
  }
  #botones {
    margin: 10px 0 0 0;
    border: solid 1px lightgrey;
    background-color: whitesmoke;
    padding: 10px;
  }
  .el-row {
    display: flex;
    align-items: center;
  }
  .el-autocomplete {
    width: 100%
  }
  .el-select {
    width: 100%;
  }
  .opcion {
    font: 11px verdana, arial, helvetica, sans-serif;
  }
</style>
