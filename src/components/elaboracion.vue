<template>
  <div id="elaboracion">
    <!-- Tool bar -->
    <div class="nav">
      <span class="menuButton"><router-link to="/" class="home">Inicio</router-link></span>
      <span class="menuButton"><router-link to="/elaboraciones-list" class="create">Listado</router-link></span>
    </div>

    <div id="captura" class="contenedor">

      <h1>Elaboracion de Productos</h1>
      <div id="encabezado">
        <el-row>
          <el-col :span="8">Folio {{ elaboracion.folio }}</el-col>
          <el-col :span="8">Fecha {{ elaboracion.dateCreated }}</el-col>
          <el-col :span="8">Estatus {{ elaboracion.estatus }} </el-col>
        </el-row>
      </div> <!-- encabezado -->

      <div id="partidas">
        <table width="100%" class="tabla">
          <thead>
          <tr>
            <th width="200px">Codigo</th>
            <th>Descripcion</th>
            <th width="150px">Cantidad</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in elaboracion.partidas" :key="index">
            <td class="td-codigo">{{ item.itemCode }}</td>
            <td>
              <el-autocomplete size="small" :trigger-on-focus="false"
                               class="input-descripcion" v-model="item.searchText"
                               @select="producto_onselect" @focus="producto_onfocus(index)"
                               @blur="producto_onblur(index)"
                               :fetch-suggestions="buscarProductos">
                <template slot-scope="props">
                  {{ props.item.itemCode }} {{ props.item.itemName }}
                </template>
              </el-autocomplete>
            </td>
            <td>
              <el-input class="input-cantidad" v-model="item.cantidad" size="mini" />
            </td>
          </tr>
          </tbody>
        </table>
      </div><!-- partidas -->

      <div id="botones">
        <div v-if="!isReadOnly">
        <el-button type="primary" size="small" :disabled="guardando"
                   @click="guardar">Guardar</el-button>
        <el-button @click="cancelar" size="small" :disabled="guardando"
        >Cancelar</el-button>
        </div>
        <el-button @click="cancelar" size="small"
                   v-if="isReadOnly" type="primary">
          Ok</el-button>
      </div>

    </div> <!-- captura -->

  </div> <!-- elaboracion -->
</template>

<script>
import axios from 'axios'

const metodos = {
  cancelar () {
    this.$router.push('/elaboraciones-list')
  },
  buscarProductos (term, callback) {
    axios.get('/api/productos?$search=' + term)
      .then(function (response) {
        callback(response.data.data)
      })
  },
  producto_onfocus (index) {
    this.currentIndex = index
  },
  producto_onblur (index) {
    const _this = this
    setTimeout(function () {
      const partida = _this.elaboracion.partidas[index]
      partida.searchText = partida.itemName
    }, 150)
  },
  producto_onselect (producto) {
    const partida = this.elaboracion.partidas[this.currentIndex]
    partida.itemCode = producto.itemCode
    partida.itemName = producto.itemName
    partida.searchText = producto.itemName
    partida.cantidad = null

    this.agregarPartidaBlank()
  },
  agregarPartidaBlank () {
    const lastIndex = this.elaboracion.partidas.length - 1
    if (this.elaboracion.partidas[lastIndex].itemCode !== null) {
      this.elaboracion.partidas.push({
        index: lastIndex + 1,
        itemCode: null,
        itemName: null,
        searchText: null,
        cantidad: null
      })
    }
  },
  guardar () {
    if (this.$props.id) {
      this.actualizar()
    } else {
      this.insertar()
    }
  },
  insertar () {
    this.guardando = true
    axios.post('/api/elaboraciones', this.elaboracion)
      .then((response) => {
        this.guardando = false
        if (response.status === 201) {
          this.$router.push('/elaboraciones-list')
        }
      })
      .catch(() => {
        this.guardando = false
      })
  },
  actualizar () {
    this.guardando = true
    axios.put('/api/elaboraciones/' + this.$props.id, this.elaboracion)
      .then((response) => {
        this.guardando = false
        if (response.status === 200) {
          this.$router.push('/elaboraciones-list')
        }
      })
      .catch(() => {
        this.guardando = false
      })
  }
}

export default {
  name: 'elaboracion',
  props: ['id'],
  data: () => {
    return {
      elaboracion: {
        folio: null,
        dateCreated: null,
        estatus: null,
        partidas: [{
          index: 0,
          itemCode: null,
          itemName: null,
          searchText: null,
          cantidad: null
        }]
      },
      currentIndex: null,
      productos: [],
      guardando: false
    }
  },
  computed: {
    isReadOnly () {
      let readonly = false
      if (this.elaboracion.estatus === 'Enviado') {
        readonly = true
      }

      return readonly
    }
  },
  methods: metodos,
  mounted () {
    if (this.$props.id) {
      axios.get('/api/elaboraciones/' + this.$props.id)
        .then((response) => {
          if (response.status === 200) {
            this.elaboracion = response.data
          }
        })
    }
  }
}
</script>
<style scoped>
  #encabezado {
    margin: 15px 0 0 0;
    border: solid 1px lightgrey;
    padding: 15px;
  }
  #partidas {
    margin: 5px 0 0 0;
  }
  #botones {
    margin: 5px 0 0 0;
    background-color: whitesmoke;
    border: solid 1px lightgrey;
    padding: 8px 0 8px 15px;
  }
  .input-cantidad {
    width: 100px;
  }
  .input-descripcion {
    width: 450px;
  }
  .td-codigo {
    vertical-align: middle;
  }
</style>
