<template>
  <div id="traslado">
    <div id="toolbar" class="nav">
      <span class="menuButton">
        <router-link to="/" class="home">Inicio</router-link>
      </span>
      <span class="menuButton">
        <router-link to="/traslados-list" class="list">
          Listado
        </router-link>
      </span>
    </div><!-- toolbar -->
    <div id="contenido" class="contenedor">
      <h1>Traspaso</h1>

      <div id="encabezado">
        <el-row class="row">
          <el-col :span="3">
            <span class="label">Folio</span>
            <span class="valor">{{ traspaso.folio }}</span>
          </el-col>
          <el-col :span="5">
            <span class="label">Estatus</span>
            <span class="valor">{{ traspaso.estatus }}</span>
          </el-col>
          <el-col :span="6">
            <span class="label">Almacen Envia</span>
            <span class="valor">{{ traspaso.almacenEnvia }}</span>
          </el-col>
          <el-col :span="3" class="label">Almacen Recibe</el-col>
          <el-col :span="7">
            <el-autocomplete size="mini" :trigger-on-focus="false"
                             @select="almacen_onselect"
                             :fetch-suggestions="buscarAlmacenes"
                             v-model="textoAlmacen">
              <template slot-scope="props">
                <span class="opcion">
                  {{ props.item.whsName }}
                </span>
              </template>
            </el-autocomplete>
          </el-col>
        </el-row>
      </div> <!-- encabezado -->
      <div id="partidas">
        <table width="100%" class="tabla">
          <thead>
          <th>Codigo</th>
          <th>Descripcion</th>
          <th>Cantidad</th>
          </thead>
          <tbody>
          <tr v-for="item in traspaso.partidas" :key="item.index">
            <td>{{ item.itemCode }}</td>
            <td>
              <div>
              <el-autocomplete size="small" :trigger-on-focus="false"
                 @focus="producto_onfocus(item.index)" @blur="producto_onblur"
                 @select="producto_onselect" v-model="item.textoPoducto"
                :fetch-suggestions="buscarProducto">
                <template slot-scope="props">
                  <span class="opcion">{{ props.item.itemCode }} - {{ props.item.itemName }}</span>
                </template>
              </el-autocomplete>
              </div>
            </td>
            <td width="70px">
              <el-input size="small" v-model="item.cantidad"></el-input>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div id="botones">
        <div v-if="isWriteable">
          <el-button size="small" type="primary" @click="guardar_onclick">Guardar</el-button>
          <el-button size="small" @click="cancelar_onclick">Cancelar</el-button>
        </div>
        <div v-if="!isWriteable">
          <el-button size="small" type="primary">Ok</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const metodos = {
  buscarAlmacenes (texto, callback) {
    axios.get('/api/almacenes?$search=' + texto)
      .then((response) => {
        if (response.status === 200) {
          callback(response.data.data)
        } else {
          callback(null)
        }
      })
      .catch((err) => {
        console.log(err)
        callback(null)
      })
  },
  producto_onfocus (index) {
    this.currentIndex = index
  },
  producto_onblur () {
    setTimeout(() => {
      const partida = this.traspaso.partidas[this.currentIndex]
      partida.textoPoducto = partida.itemName
    }, 150)
  },
  producto_onselect (producto) {
    const partida = this.traspaso.partidas[this.currentIndex]
    partida.textoPoducto = producto.itemName
    partida.itemCode = producto.itemCode
    partida.itemName = producto.itemName
    partida.cantidad = null

    this.agregarPartidaBlank()
  },
  agregarPartidaBlank () {
    const partida = this.traspaso.partidas[this.traspaso.partidas.length - 1]
    if (partida.itemCode !== null) {
      this.traspaso.partidas.push({
        index: this.traspaso.partidas.length,
        itemCode: null,
        itemName: null,
        textoPoducto: null,
        cantidad: null
      })
    }
  },
  almacen_onselect (almacen) {
    this.traspaso.almacenRecibe = almacen
    this.textoAlmacen = almacen.whsName
  },
  cancelar_onclick () {
    this.$router.push('/traslados-list')
  },
  buscarProducto (texto, callback) {
    axios.get('/api/productos?$search=' + texto)
      .then((response) => {
        if (response.status === 200) {
          callback(response.data.data)
        } else {
          callback(null)
        }
      })
      .catch((err) => {
        console.log(err)
        callback(null)
      })
  },
  guardar_onclick () {
    this.traspaso.estatus = 'Enviado'

    if (this.$props.id) {
      this.actualizar()
    } else {
      this.insertar()
    }
  },
  insertar () {
    axios.post('/api/traslados', this.traspaso)
      .then((response) => {
        if (response.status === 201) {
          this.$router.push('/traslados-list')
        } else {
          console.log(response) //  TODO: manejar error
        }
      })
      .catch((err) => {
        console.log(err) // TODO: manejar error
      })
  },
  actualizar () {
    axios.put('/api/traslados/' + this.$props.id, this.traspaso)
      .then((response) => {
        if (response.status === 200) {
          this.$router.push('/traslados-list')
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
    axios.get('/api/traslados/' + this.$props.id)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data)
          this.traspaso = response.data
          this.textoAlmacen = response.data.almacenRecibe.whsName
        } else {
          console.log(response)
          //  TODO: manejar el error
        }
      })
      .catch((err) => {
        console.log(err)
        //  TODO: manejar el error
      })
  }
}

export default {
  name: 'traslado',
  props: ['id'],
  data: () => {
    return {
      traspaso: {
        folio: null,
        estatus: 'Capturando',
        almacenEnvia: null,
        almacenRecibe: {},
        partidas: [{
          index: 0,
          itemCode: null,
          itemName: null,
          textoPoducto: null,
          cantidad: null
        }]
      },
      textoAlmacen: '',
      currentIndex: 0
    }
  },
  computed: {
    isWriteable () {
      if (this.traspaso.estatus === 'Capturando') {
        return true
      } else {
        return false
      }
    }
  },
  methods: metodos,
  created () {
    if (this.$props.id) this.consultar()
  }
}
</script>

<style scoped>
  #encabezado {
    margin: 10px 0 0 0;
    border: solid 1px lightgrey;
    padding: 10px;
  }
  .row {
    display: flex;
    align-items: center;
  }
  .label {
    font-weight: bold;
  }
  .valor {
    margin: 0 0 0 15px;
  }
  .opcion {
    font: 11px verdana, arial, helvetica, sans-serif;
  }
  #partidas {
    margin: 10px 0 0 0;
  }
  #botones {
    margin: 10px 0 0 0;
    background-color: whitesmoke;
    border: solid 1px lightgrey;
    padding: 8px 0 8px 15px;

  }
  .descripcion {
    width: 300px;
  }
  .el-autocomplete {
    width: 100%
  }
  td {
    vertical-align: middle;
  }
</style>
