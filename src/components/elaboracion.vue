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
          <el-col :span="8">
            <span class="label">Folio</span>
            <span class="valor">{{ elaboracion.folio }}</span>
          </el-col>
          <el-col :span="8">
            <span class="label">Fecha</span>
            <span class="valor">{{ ffecha(elaboracion.dateCreated) }}</span>
          </el-col>
          <el-col :span="8">
            <span class="label">Estatus</span>
            <span class="valor">{{ elaboracion.estatus }}</span>
          </el-col>
        </el-row>
      </div> <!-- encabezado -->

      <div id="partidas">
        <table width="100%" class="tabla">
          <thead>
          <tr>
            <th width="200px">Codigo</th>
            <th>Descripcion</th>
            <th width="150px">Cantidad</th>
            <th width="30px"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in elaboracion.partidas" :key="index">
            <td>{{ item.itemCode }}</td>
            <td>
              <el-autocomplete size="small" :trigger-on-focus="false"
                               class="input-descripcion" v-model="item.searchText"
                               @select="producto_onselect" @focus="producto_onfocus(index)"
                               @blur="producto_onblur(index)"
                               :fetch-suggestions="buscarProductos">
                <template slot-scope="props">
                  <span class="opcion">{{ props.item.ItemCode }} - {{ props.item.ItemName }}</span>
                </template>
              </el-autocomplete>
            </td>
            <td>
              <el-input v-model="item.cantidad" size="mini"
                :disabled="!item.isProducto"
                @focus="producto_onfocus(index)"
                @change="cantidad_onchange(index)"
              />
            </td>
            <td class="semaforos">
                <div class="stock" v-if="item.isStock">
                  <i class="el-icon-success"></i>
                </div>
                <div class="faltante" v-if="item.isFaltante">
                  <i class="el-icon-error"></i>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div><!-- partidas -->

      <div id="botones">
        <div v-if="!isReadOnly">
        <el-button type="primary" size="small" :disabled="isGuardarDisabled"
                   @click="guardar">Guardar</el-button>
        <el-button @click="cancelar" size="small" :disabled="guardando">
        Cancelar
        </el-button>
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
import moment from 'moment'

const metodos = {
  cantidad_onchange (index) {
    const partida = this.elaboracion.partidas[index]
    const config = {
      params: {
        code: partida.itemCode,
        cantidad: partida.cantidad,
        whsCode: this.elaboracion.whsCode
      }
    }

    partida.isStock = false
    partida.isFaltante = false
    axios.get('/api/existencias', config)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.length === 0) {
            partida.isStock = true
          } else {
            partida.isFaltante = true
            this.mostrarFaltantes(response.data)
          }
        } else {
          console.log(response) // TODO: manejar error
        }
      })
      .catch((err) => {
        console.log(err) // TODO: manejar error
      })
      .finally(() => {
        this.$forceUpdate() // HACK: Vue no actualiza sin esto
      })
  },
  mostrarFaltantes (componentes) {
    const h = this.$createElement
    const faltantes = componentes.map(function (componente) {
      const codigo = componente.ItemCode
      const name = componente.ItemName
      const cantidadRequerida = componente.CantidadRequerida
      const stock = componente.Existencia

      const row = h('tr', [
        h('td', codigo),
        h('td', name),
        h('td', {style: 'text-align: right;'}, cantidadRequerida),
        h('td', {style: 'text-align: right;'}, stock)
      ])

      return row
    })
    this.$msgbox({
      title: 'Materiales Insuficientes',
      type: 'error',
      message: h('div', [
        h('div', 'Faltan los siguientes componentes:'),
        h('br'),
        h('table', {class: 'tabla'}, [
          h('tr', [
            h('th', 'Codigo'),
            h('th', 'Componente'),
            h('th', 'Requerido'),
            h('th', 'Existencia')
          ]),
          faltantes
        ])
      ])
    })
  },
  ffecha (theDate) {
    if (theDate) {
      return moment(theDate).format('DD.MM.YYYY HH:mm')
    } else {
      return ''
    }
  },
  cancelar () {
    this.$router.push('/elaboraciones-list')
  },
  buscarProductos (term, callback) {
    axios.get('/api/boms?$search=' + term)
      .then(function (response) {
        if (response.status === 200) {
          callback(response.data)
        } else {
          console.log(response)
          callback(null) // TDOO: manejar error
        }
      })
      .catch((err) => {
        console.log(err) // TODO: manejar error
        callback(null)
      })
  },
  producto_onfocus (index) {
    this.currentIndex = index
  },
  producto_onblur (index) {
    setTimeout(() => {
      const partida = this.elaboracion.partidas[index]
      partida.searchText = partida.itemName
    }, 150)
  },
  producto_onselect (producto) {
    const partida = this.elaboracion.partidas[this.currentIndex]
    partida.itemCode = producto.ItemCode
    partida.itemName = producto.ItemName
    partida.searchText = producto.ItemName
    partida.cantidad = null
    partida.isProducto = true
    partida.isStock = false
    partida.isFaltante = false

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
  isFaltantes () {
    const faltantes = this.elaboracion.partidas.filter((partida) => {
      return partida.isFaltante
    })

    return faltantes.length > 0
  },
  async guardar () {
    if (this.guardando) return // Fue un doble clic

    if (this.isFaltantes()) {
      this.$message.error('Hay productos Faltantes')
      return
    }

    this.guardando = true
    // this.$forceUpdate() // HACK: Vue no actualiza sin esto
    this.$nextTick(() => {
      if (this.$props.id) {
        this.actualizar()
      } else {
        this.insertar()
      }
    })
  },
  async insertar () {
    axios.post('/api/elaboraciones', this.elaboracion)
      .then((response) => {
        if (response.status === 201) {
          return this.generarDocumento(response.data._id)
        } else {
          console.log('CODIGO ' + response.status + ', TEXT ' + response.statusText)
          this.$message.error(response.statusText)
        }
      })
      .catch((err) => {
        this.$message.error(err.toString())
        console.log(err.toString())
        this.$nextTick(() => {
          this.guardando = false
        })
      })
  },
  async actualizar () {
    axios.put('/api/elaboraciones/' + this.$props.id, this.elaboracion)
      .then((response) => {
        if (response.status === 200) {
          return this.generarDocumento(response.data._id)
        } else {
          console.log('CODIGO ' + response.status + ', TEXT ' + response.statusText)
          this.$message.error(response.statusText)
        }
      })
      .catch((err) => {
        this.$message.error(err.toString())
        console.log(err.toString())
        this.$nextTick(() => {
          this.guardando = false
        })
      })
  },
  async generarDocumento (id) {
    const elaboracion = {id: id, ...this.elaboracion}
    axios.post('/api/elaboraciones-sap', elaboracion)
      .then((response) => {
        if (response.status === 201) {
          const resultadoVO = response.data
          if (resultadoVO.Success) {
            this.$message.success('Documento generado correctamente')
            this.$router.push('/elaboraciones-list')
          } else {
            this.$message.error({
              message: resultadoVO.Mensaje,
              duration: 5000,
              showClose: true
            })
            this.$nextTick(() => {
              this.guardando = false
            })
          }
        } else {
          this.$message.error({
            message: response.statusText,
            duration: 5000,
            showClose: true
          })
          this.$nextTick(() => {
            this.guardando = false
          })
        }
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
        estatus: 'Capturando',
        whsCode: '01',
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
      if (this.elaboracion.estatus === 'Enviado' ||
        this.elaboracion.estatus === 'Generado') {
        readonly = true
      }

      return readonly
    },
    isGuardarDisabled () {
      return this.guardando
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
<style src="@/assets/css/elaboracion.css" scoped></style>
